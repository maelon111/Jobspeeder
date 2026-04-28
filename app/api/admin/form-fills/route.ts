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
  const limit = parseInt(searchParams.get('limit') || '200')
  const status = searchParams.get('status') || ''
  const domain = searchParams.get('domain') || ''
  const search = searchParams.get('search') || ''

  let query = supabase
    .from('form_fill_attempts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)
  if (domain) query = query.eq('domain', domain)
  if (search) query = query.or(`job_url.ilike.%${search}%,page_title.ilike.%${search}%,form_signature.ilike.%${search}%`)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggregate stats (always on full dataset)
  const { data: statsData } = await supabase
    .from('form_fill_attempts')
    .select('status, domain, ia_used, fields_mapped, fill_duration_ms, missing_fields')

  const stats = {
    total: statsData?.length ?? 0,
    byStatus: {} as Record<string, number>,
    byDomain: {} as Record<string, number>,
    avgFieldsMapped: 0,
    avgDurationMs: 0,
    withAI: 0,
    topMissingFields: [] as { field: string; count: number }[],
    blockedDomains: [] as string[],
  }

  if (statsData?.length) {
    let sumFields = 0, sumDuration = 0, countDuration = 0
    const missingCount: Record<string, number> = {}
    const domainDead: Record<string, number> = {}
    const domainSuccess: Record<string, number> = {}
    for (const row of statsData) {
      stats.byStatus[row.status] = (stats.byStatus[row.status] ?? 0) + 1
      if (row.domain) stats.byDomain[row.domain] = (stats.byDomain[row.domain] ?? 0) + 1
      if (row.ia_used) stats.withAI++
      sumFields += row.fields_mapped ?? 0
      if (row.fill_duration_ms) { sumDuration += row.fill_duration_ms; countDuration++ }
      if (Array.isArray(row.missing_fields)) {
        for (const f of row.missing_fields) {
          if (f) missingCount[String(f)] = (missingCount[String(f)] ?? 0) + 1
        }
      }
      if (row.domain) {
        if (row.status === 'DEAD_END') domainDead[row.domain] = (domainDead[row.domain] ?? 0) + 1
        if (row.status === 'SUCCESS')  domainSuccess[row.domain] = (domainSuccess[row.domain] ?? 0) + 1
      }
    }
    stats.avgFieldsMapped = Math.round(sumFields / statsData.length)
    stats.avgDurationMs = countDuration ? Math.round(sumDuration / countDuration) : 0
    stats.topMissingFields = Object.entries(missingCount)
      .map(([field, count]) => ({ field, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
    stats.blockedDomains = Object.keys(domainDead)
      .filter(d => (domainDead[d] ?? 0) >= 3 && !(domainSuccess[d]))
  }

  return NextResponse.json({ rows: data ?? [], count, stats })
}
