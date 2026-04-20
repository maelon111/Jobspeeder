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

  // Récupère le profil coach
  const { data: coach } = await supabaseAdmin
    .from('coaches')
    .select('id, commission_rate')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single() as { data: { id: string; commission_rate: number } | null }

  if (!coach) return NextResponse.json({ error: 'Profil coach introuvable' }, { status: 404 })

  // Coachés référés
  const { data: referrals } = await supabaseAdmin
    .from('coach_referrals')
    .select('referred_user_id, created_at')
    .eq('coach_id', coach.id)

  const referredUserIds = (referrals || []).map(r => r.referred_user_id)

  // Subscriptions actives des coachés
  let activeSubscriptions = 0
  if (referredUserIds.length > 0) {
    const { data: subs } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, status')
      .in('user_id', referredUserIds)
      .eq('status', 'active')
      .neq('plan', 'free')

    activeSubscriptions = subs?.length ?? 0
  }

  // Candidatures des coachés (tous statuts)
  let totalApplications = 0
  let totalInterviews = 0
  if (referredUserIds.length > 0) {
    const { count: appCount } = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .in('user_id', referredUserIds)

    const { count: interviewCount } = await supabaseAdmin
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .in('user_id', referredUserIds)
      .eq('status', 'interview')

    totalApplications = appCount ?? 0
    totalInterviews = interviewCount ?? 0
  }

  // Revenus ce mois
  const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'
  const { data: monthlyCommissions } = await supabaseAdmin
    .from('coach_commissions')
    .select('commission_cents, status')
    .eq('coach_id', coach.id)
    .eq('period_month', currentMonth)

  const monthlyEarningsCents = (monthlyCommissions || []).reduce(
    (sum, c) => sum + c.commission_cents, 0
  )

  // Total gains toutes périodes
  const { data: allCommissions } = await supabaseAdmin
    .from('coach_commissions')
    .select('commission_cents, status')
    .eq('coach_id', coach.id)

  const totalEarningsCents = (allCommissions || []).reduce(
    (sum, c) => sum + c.commission_cents, 0
  )
  const pendingCents = (allCommissions || [])
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.commission_cents, 0)

  return NextResponse.json({
    total_coachees: referredUserIds.length,
    active_subscribers: activeSubscriptions,
    total_applications: totalApplications,
    total_interviews: totalInterviews,
    monthly_earnings_cents: monthlyEarningsCents,
    total_earnings_cents: totalEarningsCents,
    pending_cents: pendingCents,
    commission_rate: coach.commission_rate,
  })
}
