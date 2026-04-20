import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: coach } = await supabaseAdmin
    .from('coaches')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single() as { data: { id: string } | null }

  if (!coach) return NextResponse.json({ error: 'Profil coach introuvable' }, { status: 404 })

  const { data: commissions } = await supabaseAdmin
    .from('coach_commissions')
    .select('id, referred_user_id, plan, billing_period, amount_cents, commission_cents, status, source, period_month, created_at')
    .eq('coach_id', coach.id)
    .order('created_at', { ascending: false })

  if (!commissions || commissions.length === 0) {
    return NextResponse.json({ commissions: [], by_month: [] })
  }

  // Noms des coachés référencés
  const userIds = Array.from(new Set(commissions.map(c => c.referred_user_id).filter(Boolean)))
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('user_id, full_name')
    .in('user_id', userIds)

  const profileMap = new Map((profiles || []).map(p => [p.user_id, p.full_name]))

  const enriched = commissions.map(c => ({
    ...c,
    coachee_name: profileMap.get(c.referred_user_id) || 'Candidat',
  }))

  // Résumé par mois
  const byMonth = new Map<string, { month: string; total_cents: number; count: number; paid_cents: number }>()
  for (const c of enriched) {
    const entry = byMonth.get(c.period_month) || { month: c.period_month, total_cents: 0, count: 0, paid_cents: 0 }
    entry.total_cents += c.commission_cents
    entry.count += 1
    if (c.status === 'paid') entry.paid_cents += c.commission_cents
    byMonth.set(c.period_month, entry)
  }

  const byMonthSorted = Array.from(byMonth.values()).sort((a, b) => b.month.localeCompare(a.month))

  return NextResponse.json({ commissions: enriched, by_month: byMonthSorted })
}
