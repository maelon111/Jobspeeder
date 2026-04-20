import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

function isAdmin(token: string | undefined) {
  return token === process.env.ADMIN_SECRET
}

export async function GET() {
  const cookieStore = await cookies()
  if (!isAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const [
    usersRes,
    subsRes,
    coachesRes,
    appsRes,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabase.from('subscriptions').select('plan, status, created_at'),
    supabase.from('coaches').select('status, is_active, created_at'),
    supabase.from('applications').select('status, applied_at, created_at'),
  ])

  const users = usersRes.data?.users ?? []
  const subs = subsRes.data ?? []
  const coaches = coachesRes.data ?? []
  const apps = appsRes.data ?? []

  // Registrations par jour (30 derniers jours)
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)

  const regByDay: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(d.getDate() + i)
    regByDay[d.toISOString().slice(0, 10)] = 0
  }
  users.forEach(u => {
    const day = u.created_at?.slice(0, 10)
    if (day && day in regByDay) regByDay[day]++
  })

  // Candidatures par jour
  const appsByDay: Record<string, number> = { ...regByDay }
  Object.keys(appsByDay).forEach(k => (appsByDay[k] = 0))
  apps.forEach(a => {
    const day = (a.applied_at || a.created_at)?.slice(0, 10)
    if (day && day in appsByDay) appsByDay[day]++
  })

  // Plans distribution
  const planCount: Record<string, number> = { free: 0, gold: 0, platinum: 0, elite: 0 }
  subs.forEach(s => {
    if (s.plan in planCount) planCount[s.plan]++
  })
  // Users without subscription = free
  planCount.free += users.length - subs.length

  return NextResponse.json({
    totalUsers: users.length,
    totalCoaches: coaches.length,
    approvedCoaches: coaches.filter(c => c.status === 'approved').length,
    pendingCoaches: coaches.filter(c => c.status === 'pending').length,
    totalApplications: apps.length,
    activeSubscriptions: subs.filter(s => s.status === 'active' && s.plan !== 'free').length,
    planCount,
    appStatusCount: {
      pending: apps.filter(a => a.status === 'pending').length,
      sent: apps.filter(a => a.status === 'sent').length,
      viewed: apps.filter(a => a.status === 'viewed').length,
      interview: apps.filter(a => a.status === 'interview').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    },
    registrationsByDay: Object.entries(regByDay).map(([date, count]) => ({ date, count })),
    applicationsByDay: Object.entries(appsByDay).map(([date, count]) => ({ date, count })),
  })
}
