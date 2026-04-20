import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generatePromoCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `JS-${random}`
}

// GET — retourne le code promo existant du coach
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: coach } = await supabaseAdmin
    .from('coaches')
    .select('id, promo_code, stripe_promo_code_id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single() as { data: { id: string; promo_code: string | null; stripe_promo_code_id: string | null } | null }

  if (!coach) return NextResponse.json({ error: 'Profil coach introuvable' }, { status: 404 })

  return NextResponse.json({
    promo_code: coach.promo_code,
    has_promo_code: !!coach.promo_code,
  })
}

// POST — génère un code promo Stripe pour le coach (idempotent)
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: coach } = await supabaseAdmin
    .from('coaches')
    .select('id, name, promo_code, stripe_coupon_id, stripe_promo_code_id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single() as { data: { id: string; name: string; promo_code: string | null; stripe_coupon_id: string | null; stripe_promo_code_id: string | null } | null }

  if (!coach) return NextResponse.json({ error: 'Profil coach introuvable' }, { status: 404 })

  // Déjà généré → retourner l'existant
  if (coach.promo_code && coach.stripe_promo_code_id) {
    return NextResponse.json({ promo_code: coach.promo_code })
  }

  // Génère un code unique (retry si collision)
  let promoCode: string
  let attempts = 0
  do {
    promoCode = generatePromoCode()
    const { data: existing } = await supabaseAdmin
      .from('coaches')
      .select('id')
      .eq('promo_code', promoCode)
      .single()
    if (!existing) break
    attempts++
  } while (attempts < 10)

  // Crée le coupon Stripe (10% de réduction, sur le premier paiement uniquement)
  const coupon = await stripe.coupons.create({
    percent_off: 10,
    duration: 'once',
    name: `Code coach ${coach.name}`,
    metadata: { coach_id: coach.id },
  })

  // Crée le PromotionCode Stripe lié au coupon
  const promotionCode = await stripe.promotionCodes.create({
    promotion: { type: 'coupon', coupon: coupon.id },
    code: promoCode,
    metadata: { coach_id: coach.id },
  })

  // Sauvegarde en base
  await supabaseAdmin
    .from('coaches')
    .update({
      promo_code: promoCode,
      stripe_coupon_id: coupon.id,
      stripe_promo_code_id: promotionCode.id,
    })
    .eq('id', coach.id)

  return NextResponse.json({ promo_code: promoCode }, { status: 201 })
}
