-- =====================
-- COACH AFFILIATE SYSTEM
-- =====================

-- Ajout du code de parrainage et lien Appo sur coaches
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS appo_slug TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 0.20;

-- Génère un code de parrainage pour les coaches existants sans code
UPDATE coaches
SET referral_code = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || SUBSTRING(id::text, 1, 6)
WHERE referral_code IS NULL;

-- Index
CREATE INDEX IF NOT EXISTS idx_coaches_referral_code ON coaches(referral_code);
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(user_id);

-- =====================
-- COACH REFERRALS
-- Qui s'est inscrit via quel coach
-- =====================
CREATE TABLE IF NOT EXISTS coach_referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE coach_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach can view own referrals" ON coach_referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM coaches c WHERE c.id = coach_id AND c.user_id = auth.uid())
  );

CREATE POLICY "Service role can manage referrals" ON coach_referrals
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_coach_referrals_coach_id ON coach_referrals(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_referrals_referred_user ON coach_referrals(referred_user_id);

-- =====================
-- COACH COMMISSIONS
-- Commissions générées par les abonnements des coachés
-- =====================
CREATE TABLE IF NOT EXISTS coach_commissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  amount_cents INTEGER NOT NULL,        -- montant payé par le coaché
  commission_cents INTEGER NOT NULL,    -- commission du coach (20%)
  commission_rate NUMERIC NOT NULL DEFAULT 0.20,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  period_month TEXT NOT NULL,           -- 'YYYY-MM'
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE coach_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coach can view own commissions" ON coach_commissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM coaches c WHERE c.id = coach_id AND c.user_id = auth.uid())
  );

CREATE POLICY "Service role can manage commissions" ON coach_commissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_coach_commissions_coach_id ON coach_commissions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_commissions_referred_user ON coach_commissions(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_coach_commissions_period ON coach_commissions(period_month);
