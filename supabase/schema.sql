-- JobSpeeder Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================
-- CVS
-- =====================
CREATE TABLE IF NOT EXISTS cvs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Mon CV',
  content_json JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false NOT NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================
-- JOB PREFERENCES
-- =====================
CREATE TABLE IF NOT EXISTS job_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  job_title TEXT,
  location TEXT,
  contract_types TEXT[] DEFAULT '{}',
  work_time TEXT,  -- 'full_time', 'part_time'
  work_mode TEXT,  -- 'remote', 'onsite', 'hybrid'
  salary_min INTEGER,
  salary_max INTEGER,
  is_active BOOLEAN DEFAULT false NOT NULL,
  n8n_webhook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================
-- APPLICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  applied_via TEXT NOT NULL DEFAULT 'manual' CHECK (applied_via IN ('email', 'skyvern', 'manual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'viewed', 'interview', 'rejected')),
  applied_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =====================
-- TRIGGERS: updated_at
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cvs_updated_at BEFORE UPDATE ON cvs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER job_preferences_updated_at BEFORE UPDATE ON job_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- CVs
CREATE POLICY "Users can view own CVs" ON cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs" ON cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON cvs FOR DELETE USING (auth.uid() = user_id);

-- Job Preferences
CREATE POLICY "Users can view own preferences" ON job_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON job_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON job_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Applications
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON applications FOR DELETE USING (auth.uid() = user_id);

-- Service role bypass (for webhooks)
CREATE POLICY "Service role can do anything on applications" ON applications FOR ALL USING (auth.role() = 'service_role');

-- =====================
-- TRIGGER: Auto-create profile
-- =====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_active ON cvs(is_active);
