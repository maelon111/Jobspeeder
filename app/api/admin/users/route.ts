import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(token: string | undefined) {
  return token === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  if (!isAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 50

  const [usersRes, subsRes, profilesRes, appsCountRes, referralsRes] = await Promise.all([
    supabase.auth.admin.listUsers({ page, perPage: limit }),
    supabase.from('subscriptions').select('user_id, plan, status, billing_period, current_period_end'),
    supabase.from('profiles').select('user_id, full_name, location'),
    supabase.from('applications').select('user_id, applied_at'),
    supabase.from('coach_referrals').select('referred_user_id, coach_id, created_at, coaches(name, slug)'),
  ])

  const users = usersRes.data?.users ?? []
  const subs = subsRes.data ?? []
  const profiles = profilesRes.data ?? []
  const allApps = appsCountRes.data ?? []
  const referrals = referralsRes.data ?? []

  const subMap = Object.fromEntries(subs.map(s => [s.user_id, s]))
  const profileMap = Object.fromEntries(profiles.map(p => [p.user_id, p]))
  const appCountMap: Record<string, number> = {}
  const lastAppMap: Record<string, string> = {}
  allApps.forEach(a => {
    appCountMap[a.user_id] = (appCountMap[a.user_id] || 0) + 1
    if (!lastAppMap[a.user_id] || a.applied_at > lastAppMap[a.user_id]) {
      lastAppMap[a.user_id] = a.applied_at
    }
  })
  const referralMap: Record<string, { coach_name: string; coach_slug: string; referred_at: string }> = {}
  referrals.forEach((r) => {
    const coaches = r.coaches as { name?: string; slug?: string } | { name?: string; slug?: string }[] | null
    const coach = Array.isArray(coaches) ? coaches[0] : coaches
    if (coach) {
      referralMap[r.referred_user_id] = {
        coach_name: coach.name ?? '',
        coach_slug: coach.slug ?? '',
        referred_at: r.created_at,
      }
    }
  })

  const enriched = users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    full_name: profileMap[u.id]?.full_name ?? null,
    location: profileMap[u.id]?.location ?? null,
    plan: subMap[u.id]?.plan ?? 'free',
    sub_status: subMap[u.id]?.status ?? null,
    billing_period: subMap[u.id]?.billing_period ?? null,
    period_end: subMap[u.id]?.current_period_end ?? null,
    applications_count: appCountMap[u.id] ?? 0,
    last_application_at: lastAppMap[u.id] ?? null,
    referred_by_coach_name: referralMap[u.id]?.coach_name ?? null,
    referred_by_coach_slug: referralMap[u.id]?.coach_slug ?? null,
    referred_at: referralMap[u.id]?.referred_at ?? null,
  }))

  const total = usersRes.data && 'total' in usersRes.data ? (usersRes.data as { total: number }).total : users.length

  return NextResponse.json({
    users: enriched,
    total,
    page,
  })
}
