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

  // Récupère les coachés avec leur date d'inscription
  const { data: referrals } = await supabaseAdmin
    .from('coach_referrals')
    .select('referred_user_id, created_at')
    .eq('coach_id', coach.id)
    .order('created_at', { ascending: false })

  if (!referrals || referrals.length === 0) {
    return NextResponse.json([])
  }

  const userIds = referrals.map(r => r.referred_user_id)

  // Profils + subscriptions + stats candidatures en parallèle
  const [profilesRes, subsRes, appsRes, interviewsRes] = await Promise.all([
    supabaseAdmin
      .from('profiles')
      .select('user_id, full_name')
      .in('user_id', userIds),
    supabaseAdmin
      .from('subscriptions')
      .select('user_id, plan, status, current_period_end')
      .in('user_id', userIds),
    supabaseAdmin
      .from('applications')
      .select('user_id, applied_at')
      .in('user_id', userIds)
      .order('applied_at', { ascending: false }),
    supabaseAdmin
      .from('applications')
      .select('user_id')
      .in('user_id', userIds)
      .eq('status', 'interview'),
  ])

  // Index par user_id pour lookup O(1)
  const profileMap = new Map((profilesRes.data || []).map(p => [p.user_id, p]))
  const subMap = new Map((subsRes.data || []).map(s => [s.user_id, s]))

  // Compte candidatures par user
  const appCountMap = new Map<string, number>()
  const lastAppMap = new Map<string, string>()
  for (const app of appsRes.data || []) {
    appCountMap.set(app.user_id, (appCountMap.get(app.user_id) || 0) + 1)
    if (!lastAppMap.has(app.user_id)) lastAppMap.set(app.user_id, app.applied_at)
  }

  const interviewCountMap = new Map<string, number>()
  for (const app of interviewsRes.data || []) {
    interviewCountMap.set(app.user_id, (interviewCountMap.get(app.user_id) || 0) + 1)
  }

  const coachees = referrals.map(r => {
    const uid = r.referred_user_id
    const profile = profileMap.get(uid)
    const sub = subMap.get(uid)
    return {
      user_id: uid,
      full_name: profile?.full_name || 'Candidat',
      referred_at: r.created_at,
      plan: sub?.plan || 'free',
      subscription_status: sub?.status || null,
      current_period_end: sub?.current_period_end || null,
      total_applications: appCountMap.get(uid) || 0,
      total_interviews: interviewCountMap.get(uid) || 0,
      last_application_at: lastAppMap.get(uid) || null,
    }
  })

  return NextResponse.json(coachees)
}
