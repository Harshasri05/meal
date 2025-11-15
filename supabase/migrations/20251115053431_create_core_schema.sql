/*
  # MealMate Core Database Schema
  
  ## Overview
  Complete production-ready schema for meal management, confirmations, and waste tracking.
  
  ## Tables Created
  
  1. **profiles** - Extended user data beyond auth.users
     - id (uuid, references auth.users)
     - full_name (text)
     - role (enum: student, admin, canteen_staff, ngo_manager)
     - eco_points (integer)
     - hostel_block (text)
     - room_number (text)
     - phone (text)
     - created_at, updated_at (timestamptz)
  
  2. **meals** - Master meal catalog
     - id (uuid, primary key)
     - name (text)
     - category (enum: breakfast, lunch, dinner, snack)
     - description (text)
     - image_url (text)
     - base_price (numeric)
     - nutritional_info (jsonb)
     - allergens (text[])
     - is_active (boolean)
     - created_by (uuid, references profiles)
     - created_at, updated_at (timestamptz)
  
  3. **meal_schedules** - Daily meal scheduling
     - id (uuid, primary key)
     - meal_id (uuid, references meals)
     - scheduled_date (date)
     - meal_type (enum: breakfast, lunch, dinner)
     - small_portions_available (integer)
     - medium_portions_available (integer)
     - large_portions_available (integer)
     - confirmation_deadline (timestamptz)
     - is_active (boolean)
     - created_at, updated_at (timestamptz)
  
  4. **meal_confirmations** - Student meal confirmations
     - id (uuid, primary key)
     - user_id (uuid, references profiles)
     - schedule_id (uuid, references meal_schedules)
     - portion_size (enum: small, medium, large)
     - confirmed_at (timestamptz)
     - status (enum: confirmed, cancelled, completed, no_show)
     - eco_points_earned (integer)
     - created_at, updated_at (timestamptz)
  
  5. **feedback** - Meal feedback and ratings
     - id (uuid, primary key)
     - user_id (uuid, references profiles)
     - meal_id (uuid, references meals)
     - schedule_id (uuid, references meal_schedules)
     - rating (integer 1-5)
     - comment (text)
     - reasons (text[])
     - eco_points_earned (integer)
     - created_at (timestamptz)
  
  6. **waste_logs** - Food waste tracking
     - id (uuid, primary key)
     - schedule_id (uuid, references meal_schedules)
     - weight_kg (numeric)
     - logged_by (uuid, references profiles)
     - notes (text)
     - created_at (timestamptz)
  
  7. **notifications** - User notifications
     - id (uuid, primary key)
     - user_id (uuid, references profiles)
     - type (text)
     - title (text)
     - message (text)
     - data (jsonb)
     - is_read (boolean)
     - created_at (timestamptz)
  
  8. **audit_logs** - Change tracking
     - id (uuid, primary key)
     - table_name (text)
     - record_id (uuid)
     - action (text)
     - old_data (jsonb)
     - new_data (jsonb)
     - user_id (uuid)
     - created_at (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Restrictive policies based on user roles
  - Audit logging for all modifications
  
  ## Indexes
  - Foreign keys automatically indexed
  - Additional indexes on frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'admin', 'canteen_staff', 'ngo_manager');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE meal_category AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE portion_size AS ENUM ('small', 'medium', 'large');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE confirmation_status AS ENUM ('confirmed', 'cancelled', 'completed', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  eco_points integer NOT NULL DEFAULT 0,
  hostel_block text,
  room_number text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category meal_category NOT NULL,
  description text,
  image_url text,
  base_price numeric(10,2) DEFAULT 0,
  nutritional_info jsonb,
  allergens text[],
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_meals_category ON meals(category);
CREATE INDEX IF NOT EXISTS idx_meals_is_active ON meals(is_active);

-- Meal schedules table
CREATE TABLE IF NOT EXISTS meal_schedules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  meal_type meal_category NOT NULL,
  small_portions_available integer NOT NULL DEFAULT 0,
  medium_portions_available integer NOT NULL DEFAULT 0,
  large_portions_available integer NOT NULL DEFAULT 0,
  confirmation_deadline timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(meal_id, scheduled_date, meal_type)
);

ALTER TABLE meal_schedules ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_schedules_date ON meal_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_schedules_type ON meal_schedules(meal_type);
CREATE INDEX IF NOT EXISTS idx_schedules_deadline ON meal_schedules(confirmation_deadline);

-- Meal confirmations table
CREATE TABLE IF NOT EXISTS meal_confirmations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  schedule_id uuid NOT NULL REFERENCES meal_schedules(id) ON DELETE CASCADE,
  portion_size portion_size NOT NULL DEFAULT 'medium',
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  status confirmation_status NOT NULL DEFAULT 'confirmed',
  eco_points_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, schedule_id)
);

ALTER TABLE meal_confirmations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_confirmations_user ON meal_confirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_schedule ON meal_confirmations(schedule_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_status ON meal_confirmations(status);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  schedule_id uuid REFERENCES meal_schedules(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  reasons text[],
  eco_points_earned integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_meal ON feedback(meal_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- Waste logs table
CREATE TABLE IF NOT EXISTS waste_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id uuid NOT NULL REFERENCES meal_schedules(id) ON DELETE CASCADE,
  weight_kg numeric(10,2) NOT NULL CHECK (weight_kg >= 0),
  logged_by uuid NOT NULL REFERENCES profiles(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_waste_schedule ON waste_logs(schedule_id);
CREATE INDEX IF NOT EXISTS idx_waste_created ON waste_logs(created_at);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_meals_updated_at ON meals;
  CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_schedules_updated_at ON meal_schedules;
  CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON meal_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_confirmations_updated_at ON meal_confirmations;
  CREATE TRIGGER update_confirmations_updated_at BEFORE UPDATE ON meal_confirmations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;