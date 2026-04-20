-- =====================
-- COACH PROMO CODES
-- Code promo personnalisé par coach (10% réduction candidat, 10% commission coach)
-- =====================

ALTER TABLE coaches ADD COLUMN IF NOT EXISTS promo_code TEXT UNIQUE;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS stripe_promo_code_id TEXT;
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS stripe_coupon_id TEXT;
ALTER TABLE coaches ALTER COLUMN commission_rate SET DEFAULT 0.15;

-- Traçabilité : commission via lien d'affiliation ou code promo
ALTER TABLE coach_commissions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'referral';

CREATE INDEX IF NOT EXISTS idx_coaches_stripe_promo_code_id ON coaches(stripe_promo_code_id);
CREATE INDEX IF NOT EXISTS idx_coaches_promo_code ON coaches(promo_code);
