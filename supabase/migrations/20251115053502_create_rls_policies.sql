/*
  # Row Level Security Policies
  
  ## Security Model
  All tables have restrictive RLS policies by default.
  Access is granted based on user role and ownership.
  
  ## Policy Categories
  
  1. **Profiles**
     - Users can read all profiles
     - Users can update own profile
     - Admins can update any profile
  
  2. **Meals**
     - Everyone can read active meals
     - Only admin/canteen_staff can create/update/delete
  
  3. **Meal Schedules**
     - Everyone can read active schedules
     - Only admin/canteen_staff can manage
  
  4. **Meal Confirmations**
     - Users can read own confirmations
     - Users can create/update own confirmations
     - Admins can read all confirmations
  
  5. **Feedback**
     - Users can create feedback
     - Users can read own feedback
     - Admins can read all feedback
  
  6. **Waste Logs**
     - Only canteen_staff/admin can manage
     - Everyone can read (for transparency)
  
  7. **Notifications**
     - Users can read own notifications
     - Users can update own notifications (mark as read)
  
  8. **Audit Logs**
     - Only admins can read
     - System writes automatically
*/

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'canteen_staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- MEALS POLICIES
CREATE POLICY "Everyone can view active meals"
  ON meals FOR SELECT
  TO authenticated
  USING (is_active = true OR is_staff());

CREATE POLICY "Staff can create meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

CREATE POLICY "Staff can update meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

CREATE POLICY "Staff can delete meals"
  ON meals FOR DELETE
  TO authenticated
  USING (is_staff());

-- MEAL SCHEDULES POLICIES
CREATE POLICY "Everyone can view active schedules"
  ON meal_schedules FOR SELECT
  TO authenticated
  USING (is_active = true OR is_staff());

CREATE POLICY "Staff can create schedules"
  ON meal_schedules FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

CREATE POLICY "Staff can update schedules"
  ON meal_schedules FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

CREATE POLICY "Staff can delete schedules"
  ON meal_schedules FOR DELETE
  TO authenticated
  USING (is_staff());

-- MEAL CONFIRMATIONS POLICIES
CREATE POLICY "Users can view own confirmations"
  ON meal_confirmations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_staff());

CREATE POLICY "Users can create own confirmations"
  ON meal_confirmations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own confirmations"
  ON meal_confirmations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can update any confirmation"
  ON meal_confirmations FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

-- FEEDBACK POLICIES
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_staff());

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- WASTE LOGS POLICIES
CREATE POLICY "Everyone can view waste logs"
  ON waste_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can create waste logs"
  ON waste_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_staff());

CREATE POLICY "Staff can update waste logs"
  ON waste_logs FOR UPDATE
  TO authenticated
  USING (is_staff())
  WITH CHECK (is_staff());

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- AUDIT LOGS POLICIES
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);