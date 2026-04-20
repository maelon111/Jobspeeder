import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role to bypass RLS in webhook
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Résoudre le plan depuis un price_id Stripe
function getPlanFromPriceId(priceId: string): string | null {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_DECOUVERTE_MONTHLY!]: 'decouverte',
    [process.env.STRIPE_PRICE_DECOUVERTE_ANNUAL!]: 'decouverte',
    [process.env.STRIPE_PRICE_GOLD_MONTHLY!]: 'gold',
    [process.env.STRIPE_PRICE_GOLD_ANNUAL!]: 'gold',
    [process.env.STRIPE_PRICE_PLATINUM_MONTHLY!]: 'platinum',
    [process.env.STRIPE_PRICE_PLATINUM_ANNUAL!]: 'platinum',
    [process.env.STRIPE_PRICE_ELITE_MONTHLY!]: 'elite',
    [process.env.STRIPE_PRICE_ELITE_ANNUAL!]: 'elite',
  }
  return map[priceId] ?? null
}

// Résoudre la période de facturation depuis un price_id
function getBillingFromPriceId(priceId: string): string {
  const annuals = [
    process.env.STRIPE_PRICE_DECOUVERTE_ANNUAL!,
    process.env.STRIPE_PRICE_GOLD_ANNUAL!,
    process.env.STRIPE_PRICE_PLATINUM_ANNUAL!,
    process.env.STRIPE_PRICE_ELITE_ANNUAL!,
  ]
  return annuals.includes(priceId) ? 'annual' : 'monthly'
}

async function upsertSubscription(params: {
  userId: string
  customerId: string
  subscriptionId: string
  plan: string
  billing: string
  status: string
  periodEnd: number | null | undefined
  event?: string
}) {
  const periodEndIso = params.periodEnd
    ? new Date(params.periodEnd * 1000).toISOString()
    : null

  await supabaseAdmin.from('subscriptions').upsert({
    user_id: params.userId,
    stripe_customer_id: params.customerId,
    stripe_subscription_id: params.subscriptionId,
    plan: params.plan,
    billing_period: params.billing,
    status: params.status,
    current_period_end: periodEndIso,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' })

  // Notifier n8n du changement de plan
  const n8nUrl = 'https://n8n.jobspeeder.online/webhook/plan-status'
  fetch(n8nUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: params.event ?? 'subscription_updated',
      user_id: params.userId,
      _plan: params.plan,
      _plan_status: params.status,
      _billing_period: params.billing,
      _plan_expires_at: periodEndIso,
      stripe_customer_id: params.customerId,
      stripe_subscription_id: params.subscriptionId,
    }),
  }).catch(() => {}) // non-bloquant
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalide' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan
      const billing = session.metadata?.billing

      if (!userId || !plan) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const periodEnd = subscription.items.data[0]?.current_period_end

      await upsertSubscription({
        userId,
        customerId: session.customer as string,
        subscriptionId: subscription.id,
        plan,
        billing: billing ?? 'monthly',
        status: subscription.status,
        periodEnd,
        event: 'subscription_created',
      })

      if (session.amount_total && session.amount_total > 0) {
        const periodMonth = new Date().toISOString().slice(0, 7)

        // Commission via lien d'affiliation (priorité)
        const { data: referral } = await supabaseAdmin
          .from('coach_referrals')
          .select('coach_id, coaches(commission_rate)')
          .eq('referred_user_id', userId)
          .single() as { data: { coach_id: string; coaches: { commission_rate: number } | null } | null }

        if (referral) {
          const rate = referral.coaches?.commission_rate ?? 0.15
          await supabaseAdmin.from('coach_commissions').insert({
            coach_id: referral.coach_id,
            referred_user_id: userId,
            stripe_subscription_id: subscription.id,
            plan,
            billing_period: billing ?? 'monthly',
            amount_cents: session.amount_total,
            commission_cents: Math.round(session.amount_total * rate),
            commission_rate: rate,
            source: 'referral',
            status: 'pending',
            period_month: periodMonth,
          })
        } else {
          // Commission via code promo si aucun lien d'affiliation
          const discounts = (session as { discounts?: Array<{ promotion_code?: string | null }> }).discounts ?? []
          const promoCodeId = discounts.find(d => d.promotion_code)?.promotion_code ?? null

          if (promoCodeId) {
            const { data: promoCoach } = await supabaseAdmin
              .from('coaches')
              .select('id')
              .eq('stripe_promo_code_id', promoCodeId)
              .single() as { data: { id: string } | null }

            if (promoCoach) {
              const promoRate = 0.10
              await supabaseAdmin.from('coach_commissions').insert({
                coach_id: promoCoach.id,
                referred_user_id: userId,
                stripe_subscription_id: subscription.id,
                plan,
                billing_period: billing ?? 'monthly',
                amount_cents: session.amount_total,
                commission_cents: Math.round(session.amount_total * promoRate),
                commission_rate: promoRate,
                source: 'promo_code',
                status: 'pending',
                period_month: periodMonth,
              })
            }
          }
        }
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id
      if (!userId) break

      const priceId = subscription.items.data[0]?.price?.id
      // Priorité : price_id > metadata (plus fiable en cas de changement de plan)
      const plan = (priceId && getPlanFromPriceId(priceId))
        || subscription.metadata?.plan
        || 'free'
      const billing = (priceId && getBillingFromPriceId(priceId))
        || subscription.metadata?.billing
        || 'monthly'

      const periodEnd = subscription.items.data[0]?.current_period_end

      await upsertSubscription({
        userId,
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        plan,
        billing,
        status: subscription.status,
        periodEnd,
        event: 'subscription_updated',
      })
      break
    }

    case 'invoice.payment_succeeded': {
      // Renouvellement ou premier paiement : on met à jour current_period_end
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.parent?.type === 'subscription_details'
        ? (invoice.parent.subscription_details?.subscription as string | undefined)
        : undefined
      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = subscription.metadata?.user_id
      if (!userId) break

      const priceId = subscription.items.data[0]?.price?.id
      const plan = (priceId && getPlanFromPriceId(priceId))
        || subscription.metadata?.plan
        || 'free'
      const billing = (priceId && getBillingFromPriceId(priceId))
        || subscription.metadata?.billing
        || 'monthly'

      const periodEnd = subscription.items.data[0]?.current_period_end

      await upsertSubscription({
        userId,
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        plan,
        billing,
        status: subscription.status,
        periodEnd,
        event: 'subscription_renewed',
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.user_id
      if (!userId) break

      await supabaseAdmin.from('subscriptions')
        .update({ plan: 'decouverte', status: 'canceled', updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      fetch('https://n8n.jobspeeder.online/webhook/plan-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'subscription_canceled',
          user_id: userId,
          _plan: 'decouverte',
          _plan_status: 'canceled',
          _billing_period: 'monthly',
          _plan_expires_at: null,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
        }),
      }).catch(() => {})
      break
    }
  }

  return NextResponse.json({ received: true })
}
