import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SHEET_ID = '1_-3ex3Dh1wSLHrXFos1pUbqrnv1gsIPehJ3WTfZwul4'
const SHEET_NAME = 'JOB_OFFERS'
const PER_PAGE = 20

function parseGviz(text: string) {
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/)
  if (!match) return null
  return JSON.parse(match[1])
}

function buildUrl(query: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&tq=${encodeURIComponent(query)}`
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Math.max(0, parseInt(searchParams.get('page') || '0'))
  const search = (searchParams.get('search') || '').toLowerCase().trim()

  const userId = user.id.replace(/'/g, "\\'")

  // Fetch all columns — discover indices from headers dynamically
  const query = `select * where B = '${userId}'`
  const res = await fetch(buildUrl(query), { next: { revalidate: 60 } })
  const text = await res.text()
  const json = parseGviz(text)

  if (!json || json.status === 'error') {
    return NextResponse.json({ error: 'Failed to fetch sheet data' }, { status: 500 })
  }

  // Build column index map from headers
  type GvizCol = { id: string; label: string; type: string }
  type GvizRow = { c: ({ v: string | null } | null)[] }

  const cols: GvizCol[] = json?.table?.cols || []
  const colIndex: Record<string, number> = {}
  cols.forEach((col, i) => {
    const key = col.label?.toLowerCase().trim().replace(/\s+/g, '_')
    if (key) colIndex[key] = i
  })

  const rows: GvizRow[] = json?.table?.rows || []

  // Map rows using discovered column indices
  const idx = (name: string) => colIndex[name] ?? -1

  const allJobs = rows
    .map((row) => ({
      job_id: row.c?.[idx('job_id')]?.v ?? null,
      titre: row.c?.[idx('titre')]?.v ?? '',
      entreprise_nom: row.c?.[idx('entreprise_nom')]?.v ?? '',
      localisation: row.c?.[idx('localisation')]?.v ?? '',
      remote: row.c?.[idx('remote')]?.v ?? null,
      type_contrat: row.c?.[idx('type_contrat')]?.v ?? '',
      statut_traitement: row.c?.[idx('statut_traitement')]?.v ?? '',
      logo_entreprise: row.c?.[idx('logo_entreprise')]?.v ?? null,
    }))
    .filter((job) => job.titre && job.statut_traitement === 'à traiter')

  // Apply search filter
  const filtered = search
    ? allJobs.filter(
        (job) =>
          job.titre.toLowerCase().includes(search) ||
          job.entreprise_nom.toLowerCase().includes(search) ||
          job.localisation.toLowerCase().includes(search)
      )
    : allJobs

  const total = filtered.length
  const jobs = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE)

  return NextResponse.json({ jobs, total, page, perPage: PER_PAGE })
}
