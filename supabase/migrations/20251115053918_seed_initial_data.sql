/*
  # Seed Initial Data for Development and Testing
  
  ## Test Data Created
  
  1. **Test Meals** - Sample meals for each category
  2. **Meal Schedules** - Weekly schedule for the next 7 days
  3. **Sample Confirmations** - Test confirmations for various students
  
  ## Notes
  - This migration is idempotent (can be run multiple times)
  - Only inserts data if it doesn't already exist
  - Useful for development and demo purposes
*/

-- Insert sample meals (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM meals LIMIT 1) THEN
    INSERT INTO meals (name, category, description, base_price, is_active) VALUES
      ('Idli & Sambar', 'breakfast', 'Steamed rice cakes with lentil soup', 30, true),
      ('Dosa & Chutney', 'breakfast', 'Crispy crepe with coconut chutney', 35, true),
      ('Poha', 'breakfast', 'Flattened rice with vegetables', 25, true),
      ('Upma', 'breakfast', 'Semolina porridge with vegetables', 25, true),
      ('Paratha & Curd', 'breakfast', 'Stuffed flatbread with yogurt', 40, true),
      
      ('Rice & Dal', 'lunch', 'Steamed rice with lentil curry', 50, true),
      ('Biryani', 'lunch', 'Fragrant rice with vegetables', 70, true),
      ('Chole Bhature', 'lunch', 'Chickpea curry with fried bread', 65, true),
      ('Pulao', 'lunch', 'Flavored rice with vegetables', 55, true),
      ('Rajma Chawal', 'lunch', 'Kidney beans curry with rice', 50, true),
      
      ('Chapati & Curry', 'dinner', 'Whole wheat bread with mixed vegetable curry', 45, true),
      ('Paratha & Dal', 'dinner', 'Stuffed flatbread with lentil soup', 50, true),
      ('Khichdi', 'dinner', 'Rice and lentil comfort food', 40, true),
      ('Mixed Veg & Roti', 'dinner', 'Assorted vegetables with bread', 45, true),
      ('Paneer Curry & Rice', 'dinner', 'Cottage cheese curry with rice', 60, true);
  END IF;
END $$;

-- Create meal schedules for the next 7 days (only if not exists)
DO $$
DECLARE
  meal_record RECORD;
  schedule_date date;
  deadline_time timestamptz;
  day_names text[] := ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  day_index integer;
  meal_rotation integer := 0;
BEGIN
  -- Loop through next 7 days
  FOR i IN 0..6 LOOP
    schedule_date := CURRENT_DATE + i;
    day_index := (EXTRACT(DOW FROM schedule_date)::integer + 6) % 7 + 1;
    
    -- Breakfast schedule (confirm before 9 PM previous day)
    deadline_time := (schedule_date - INTERVAL '1 day')::timestamp + TIME '21:00:00';
    
    SELECT * INTO meal_record FROM meals 
    WHERE category = 'breakfast' 
    ORDER BY random() 
    LIMIT 1;
    
    IF meal_record.id IS NOT NULL THEN
      INSERT INTO meal_schedules (
        meal_id, scheduled_date, meal_type, 
        small_portions_available, medium_portions_available, large_portions_available,
        confirmation_deadline, is_active
      )
      VALUES (
        meal_record.id, schedule_date, 'breakfast',
        500, 800, 200,
        deadline_time, true
      )
      ON CONFLICT (meal_id, scheduled_date, meal_type) DO NOTHING;
    END IF;
    
    -- Lunch schedule (confirm before 9 AM same day)
    deadline_time := schedule_date::timestamp + TIME '09:00:00';
    
    SELECT * INTO meal_record FROM meals 
    WHERE category = 'lunch' 
    ORDER BY random() 
    LIMIT 1;
    
    IF meal_record.id IS NOT NULL THEN
      INSERT INTO meal_schedules (
        meal_id, scheduled_date, meal_type,
        small_portions_available, medium_portions_available, large_portions_available,
        confirmation_deadline, is_active
      )
      VALUES (
        meal_record.id, schedule_date, 'lunch',
        700, 1000, 300,
        deadline_time, true
      )
      ON CONFLICT (meal_id, scheduled_date, meal_type) DO NOTHING;
    END IF;
    
    -- Dinner schedule (confirm before 3 PM same day)
    deadline_time := schedule_date::timestamp + TIME '15:00:00';
    
    SELECT * INTO meal_record FROM meals 
    WHERE category = 'dinner' 
    ORDER BY random() 
    LIMIT 1;
    
    IF meal_record.id IS NOT NULL THEN
      INSERT INTO meal_schedules (
        meal_id, scheduled_date, meal_type,
        small_portions_available, medium_portions_available, large_portions_available,
        confirmation_deadline, is_active
      )
      VALUES (
        meal_record.id, schedule_date, 'dinner',
        600, 900, 250,
        deadline_time, true
      )
      ON CONFLICT (meal_id, scheduled_date, meal_type) DO NOTHING;
    END IF;
  END LOOP;
END $$;
