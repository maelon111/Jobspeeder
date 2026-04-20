import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { referral_code } = await req.json() as { referral_code: string }
  if (!referral_code?.trim()) {
    return NextResponse.json({ error: 'Code requis' }, { status: 400 })
  }

  // Vérifie que le code existe et que le coach est approuvé
  const { data: coach } = await supabaseAdmin
    .from('coaches')
    .select('id')
    .eq('referral_code', referral_code.trim())
    .eq('status', 'approved')
    .single()

  if (!coach) {
    // Code invalide — on ignore silencieusement (pas bloquant pour l'inscription)
    return NextResponse.json({ ok: false, reason: 'code_not_found' })
  }

  // Vérifie que l'utilisateur n'est pas déjà parrainé
  const { data: existing } = await supabaseAdmin
    .from('coach_referrals')
    .select('id')
    .eq('referred_user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ ok: false, reason: 'already_referred' })
  }

  // Enregistre le parrainage
  await supabaseAdmin.from('coach_referrals').insert({
    coach_id: coach.id,
    referred_user_id: user.id,
  })

  return NextResponse.json({ ok: true })
}
