-- Add 'decouverte' to allowed plan values and replace 'free' default
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free', 'decouverte', 'gold', 'platinum', 'elite'));
ALTER TABLE subscriptions ALTER COLUMN plan SET DEFAULT 'decouverte';
