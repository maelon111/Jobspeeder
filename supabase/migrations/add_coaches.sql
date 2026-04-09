-- =====================
-- COACHES
-- =====================
CREATE TABLE IF NOT EXISTS coaches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  experience_years INTEGER,
  city TEXT,
  country TEXT DEFAULT 'France',
  remote BOOLEAN DEFAULT true,
  in_person BOOLEAN DEFAULT false,
  hourly_rate_min INTEGER,
  calendly_url TEXT,
  linkedin_url TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TRIGGER coaches_updated_at
  BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved coaches" ON coaches
  FOR SELECT USING (status = 'approved' AND is_active = true);

CREATE POLICY "Users can view own coach profile" ON coaches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert coach profile" ON coaches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach profile" ON coaches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage coaches" ON coaches
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_coaches_slug ON coaches(slug);
CREATE INDEX IF NOT EXISTS idx_coaches_status ON coaches(status);
CREATE INDEX IF NOT EXISTS idx_coaches_city ON coaches(city);

-- =====================
-- COACH SERVICES
-- =====================
CREATE TABLE IF NOT EXISTS coach_services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  price INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE coach_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services of approved coaches" ON coach_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM coaches c WHERE c.id = coach_id AND c.status = 'approved' AND c.is_active = true
    )
  );

CREATE POLICY "Coach owner can manage own services" ON coach_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM coaches c WHERE c.id = coach_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage coach_services" ON coach_services
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_coach_services_coach_id ON coach_services(coach_id);

-- =====================
-- COACH REVIEWS
-- =====================
CREATE TABLE IF NOT EXISTS coach_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  reviewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE coach_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON coach_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON coach_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_user_id);

CREATE POLICY "Service role can manage reviews" ON coach_reviews
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_coach_reviews_coach_id ON coach_reviews(coach_id);
