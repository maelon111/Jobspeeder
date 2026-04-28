import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/extension/skip-domains
// Returns domains where 3+ DEAD_END and 0 SUCCESS — the extension skips these.
// Public endpoint (returns only aggregate domain names, no personal data).
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('form_fill_attempts')
    .select('domain, status')
    .not('domain', 'is', null)

  if (error) return NextResponse.json({ domains: [] })

  const stats: Record<string, { dead: number; success: number }> = {}
  for (const row of data ?? []) {
    if (!row.domain) continue
    if (!stats[row.domain]) stats[row.domain] = { dead: 0, success: 0 }
    if (row.status === 'DEAD_END') stats[row.domain].dead++
    if (row.status === 'SUCCESS')  stats[row.domain].success++
  }

  const domains = Object.entries(stats)
    .filter(([, s]) => s.dead >= 3 && s.success === 0)
    .map(([domain]) => domain)

  return NextResponse.json({ domains }, {
    headers: { 'Cache-Control': 'public, max-age=300' }, // cache 5 min
  })
}
