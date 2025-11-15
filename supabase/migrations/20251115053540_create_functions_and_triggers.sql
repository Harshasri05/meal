/*
  # Database Functions and Triggers
  
  ## Functions Created
  
  1. **handle_new_user()** - Automatically create profile on signup
  2. **update_eco_points()** - Update user eco points
  3. **get_meal_stats()** - Calculate meal statistics
  4. **get_waste_trends()** - Calculate waste trends
  5. **audit_trigger()** - Log all table changes
  
  ## Triggers Created
  
  1. Auto-create profile on auth.users insert
  2. Audit log triggers on all major tables
  3. Eco points update on confirmation/feedback
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
EXCEPTION
  WHEN undefined_table THEN null;
END $$;

-- Function to update eco points
CREATE OR REPLACE FUNCTION update_eco_points()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'meal_confirmations' THEN
      -- Award points based on portion size
      UPDATE profiles
      SET eco_points = eco_points + NEW.eco_points_earned
      WHERE id = NEW.user_id;
    ELSIF TG_TABLE_NAME = 'feedback' THEN
      -- Award points for feedback
      UPDATE profiles
      SET eco_points = eco_points + NEW.eco_points_earned
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for eco points
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_eco_points_confirmation ON meal_confirmations;
  CREATE TRIGGER update_eco_points_confirmation
    AFTER INSERT ON meal_confirmations
    FOR EACH ROW EXECUTE FUNCTION update_eco_points();
  
  DROP TRIGGER IF EXISTS update_eco_points_feedback ON feedback;
  CREATE TRIGGER update_eco_points_feedback
    AFTER INSERT ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_eco_points();
END $$;

-- Function to calculate meal statistics
CREATE OR REPLACE FUNCTION get_meal_stats(
  start_date date DEFAULT CURRENT_DATE - INTERVAL '7 days',
  end_date date DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  meal_type meal_category,
  total_confirmations bigint,
  small_count bigint,
  medium_count bigint,
  large_count bigint,
  avg_rating numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ms.meal_type,
    COUNT(mc.id) as total_confirmations,
    COUNT(mc.id) FILTER (WHERE mc.portion_size = 'small') as small_count,
    COUNT(mc.id) FILTER (WHERE mc.portion_size = 'medium') as medium_count,
    COUNT(mc.id) FILTER (WHERE mc.portion_size = 'large') as large_count,
    ROUND(AVG(f.rating), 2) as avg_rating
  FROM meal_schedules ms
  LEFT JOIN meal_confirmations mc ON ms.id = mc.schedule_id
  LEFT JOIN feedback f ON ms.meal_id = f.meal_id
  WHERE ms.scheduled_date BETWEEN start_date AND end_date
  GROUP BY ms.meal_type;
END;
$$ LANGUAGE plpgsql;

-- Function to get waste trends
CREATE OR REPLACE FUNCTION get_waste_trends(
  days integer DEFAULT 7
)
RETURNS TABLE (
  date date,
  total_waste numeric,
  meal_type meal_category
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ms.scheduled_date as date,
    SUM(wl.weight_kg) as total_waste,
    ms.meal_type
  FROM waste_logs wl
  JOIN meal_schedules ms ON wl.schedule_id = ms.id
  WHERE ms.scheduled_date >= CURRENT_DATE - days
  GROUP BY ms.scheduled_date, ms.meal_type
  ORDER BY ms.scheduled_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get top eco warriors
CREATE OR REPLACE FUNCTION get_top_eco_warriors(
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  eco_points integer,
  total_confirmations bigint,
  small_portion_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id as user_id,
    p.full_name,
    p.eco_points,
    COUNT(mc.id) as total_confirmations,
    COUNT(mc.id) FILTER (WHERE mc.portion_size = 'small') as small_portion_count
  FROM profiles p
  LEFT JOIN meal_confirmations mc ON p.id = mc.user_id
  WHERE p.role = 'student'
  GROUP BY p.id, p.full_name, p.eco_points
  ORDER BY p.eco_points DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Audit log trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
DO $$
BEGIN
  DROP TRIGGER IF EXISTS audit_meals ON meals;
  CREATE TRIGGER audit_meals
    AFTER INSERT OR UPDATE OR DELETE ON meals
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
  
  DROP TRIGGER IF EXISTS audit_schedules ON meal_schedules;
  CREATE TRIGGER audit_schedules
    AFTER INSERT OR UPDATE OR DELETE ON meal_schedules
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
  
  DROP TRIGGER IF EXISTS audit_waste ON waste_logs;
  CREATE TRIGGER audit_waste
    AFTER INSERT OR UPDATE OR DELETE ON waste_logs
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
END $$;

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  target_user_id uuid,
  notif_type text,
  notif_title text,
  notif_message text,
  notif_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notif_type, notif_title, notif_message, notif_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check deadline and send reminders
CREATE OR REPLACE FUNCTION check_confirmation_deadlines()
RETURNS void AS $$
BEGIN
  -- Send reminders for upcoming deadlines (2 hours before)
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT
    p.id,
    'deadline_reminder',
    'Meal Confirmation Closing Soon!',
    'Confirm your ' || ms.meal_type || ' before ' || to_char(ms.confirmation_deadline, 'HH:MI AM'),
    jsonb_build_object('schedule_id', ms.id, 'deadline', ms.confirmation_deadline)
  FROM profiles p
  CROSS JOIN meal_schedules ms
  WHERE ms.confirmation_deadline BETWEEN now() AND now() + INTERVAL '2 hours'
    AND ms.is_active = true
    AND p.role = 'student'
    AND NOT EXISTS (
      SELECT 1 FROM meal_confirmations mc
      WHERE mc.user_id = p.id AND mc.schedule_id = ms.id
    )
    AND NOT EXISTS (
      SELECT 1 FROM notifications n
      WHERE n.user_id = p.id
        AND n.type = 'deadline_reminder'
        AND (n.data->>'schedule_id')::uuid = ms.id
        AND n.created_at > now() - INTERVAL '3 hours'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;