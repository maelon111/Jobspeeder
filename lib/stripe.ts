import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return _stripe
}

// Convenience alias used in route handlers
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type PlanId = 'gold' | 'platinum' | 'elite'
export type BillingPeriod = 'monthly' | 'annual'

export const PRICE_IDS: Record<PlanId, Record<BillingPeriod, string>> = {
  gold: {
    monthly: process.env.STRIPE_PRICE_GOLD_MONTHLY!,
    annual: process.env.STRIPE_PRICE_GOLD_ANNUAL!,
  },
  platinum: {
    monthly: process.env.STRIPE_PRICE_PLATINUM_MONTHLY!,
    annual: process.env.STRIPE_PRICE_PLATINUM_ANNUAL!,
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
    annual: process.env.STRIPE_PRICE_ELITE_ANNUAL!,
  },
}
