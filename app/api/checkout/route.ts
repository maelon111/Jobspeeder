import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { stripe, PRICE_IDS, PlanId, BillingPeriod } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { plan, billing } = await req.json() as { plan: PlanId; billing: BillingPeriod }

  if (!plan || !PRICE_IDS[plan]) {
    return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
  }

  const priceId = PRICE_IDS[plan][billing ?? 'monthly']
  if (!priceId) {
    return NextResponse.json({ error: 'Prix non configuré' }, { status: 500 })
  }

  // Check if user already has a Stripe customer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subscription } = await (supabase as any)
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single() as { data: { stripe_customer_id: string | null } | null }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: subscription?.stripe_customer_id || undefined,
    customer_email: !subscription?.stripe_customer_id ? user.email : undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success&plan=${plan}`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: {
      user_id: user.id,
      plan,
      billing: billing ?? 'monthly',
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
        plan,
        billing: billing ?? 'monthly',
      },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
