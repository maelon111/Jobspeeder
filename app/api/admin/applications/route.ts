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
  const limit = parseInt(searchParams.get('limit') || '100')

  const { data: apps, error } = await supabase
    .from('applications')
    .select('id, user_id, company, job_title, status, applied_via, applied_at, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch emails for each unique user_id
  const userIds = Array.from(new Set((apps ?? []).map(a => a.user_id)))
  const usersRes = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const userMap = Object.fromEntries(
    (usersRes.data?.users ?? [])
      .filter(u => userIds.includes(u.id))
      .map(u => [u.id, u.email])
  )

  const enriched = (apps ?? []).map(a => ({
    ...a,
    user_email: userMap[a.user_id] ?? a.user_id,
  }))

  return NextResponse.json({ applications: enriched })
}
