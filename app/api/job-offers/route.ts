import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SHEET_ID = '1_-3ex3Dh1wSLHrXFos1pUbqrnv1gsIPehJ3WTfZwul4'
const SHEET_NAME = 'JOB_OFFERS'

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
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')
  const search = searchParams.get('search') || ''

  // Colonnes: B=user_id, G=date_publication, H=titre, K=entreprise_nom, AJ=logo_entreprise
  const userId = user.id.replace(/'/g, "\\'")
  let where = `where B = '${userId}' and H is not null`
  if (search) {
    const s = search.toLowerCase().replace(/'/g, "\\'")
    where += ` and (lower(H) contains '${s}' or lower(K) contains '${s}')`
  }

  const dataQuery = `select G,H,K,AJ ${where} order by G desc limit ${limit} offset ${offset}`
  const countQuery = `select count(H) ${where}`

  const [dataRes, countRes] = await Promise.all([
    fetch(buildUrl(dataQuery), { next: { revalidate: 60 } }),
    fetch(buildUrl(countQuery), { next: { revalidate: 60 } }),
  ])

  const [dataText, countText] = await Promise.all([dataRes.text(), countRes.text()])

  const dataJson = parseGviz(dataText)
  const countJson = parseGviz(countText)

  if (!dataJson || dataJson.status === 'error') {
    return NextResponse.json({ error: 'Failed to fetch sheet data' }, { status: 500 })
  }

  type GvizRow = { c: ({ v: string | null } | null)[] }
  const rows: GvizRow[] = dataJson?.table?.rows || []
  const total: number = countJson?.table?.rows?.[0]?.c?.[0]?.v || 0

  const jobs = rows
    .map((row) => ({
      date: row.c?.[0]?.v || null,
      titre: row.c?.[1]?.v || '',
      entreprise_nom: row.c?.[2]?.v || '',
      logo_entreprise: row.c?.[3]?.v || null,
    }))
    .filter((job) => job.titre)

  return NextResponse.json({ jobs, total })
}
