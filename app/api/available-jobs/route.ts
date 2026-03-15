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

// Colonnes: A=job_id, B=user_id, G=date_publication, H=titre, K=entreprise_nom,
//           L=localisation, M=remote, N=type_contrat, O=statut_traitement, AJ=logo_entreprise
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  const userId = user.id.replace(/'/g, "\\'")
  let where = `where B = '${userId}' and H is not null`
  if (search) {
    const s = search.toLowerCase().replace(/'/g, "\\'")
    where += ` and (lower(H) contains '${s}' or lower(K) contains '${s}' or lower(L) contains '${s}')`
  }

  const dataQuery = `select A,H,K,L,M,N,AJ ${where} order by G desc`
  const url = buildUrl(dataQuery)

  const res = await fetch(url, { next: { revalidate: 60 } })
  const text = await res.text()
  const json = parseGviz(text)

  if (!json || json.status === 'error') {
    return NextResponse.json({ error: 'Failed to fetch sheet data' }, { status: 500 })
  }

  type GvizRow = { c: ({ v: string | null } | null)[] }
  const rows: GvizRow[] = json?.table?.rows || []

  const jobs = rows
    .map((row) => ({
      job_id: row.c?.[0]?.v || null,
      titre: row.c?.[1]?.v || '',
      entreprise_nom: row.c?.[2]?.v || '',
      localisation: row.c?.[3]?.v || '',
      remote: row.c?.[4]?.v || '',
      type_contrat: row.c?.[5]?.v || '',
      logo_entreprise: row.c?.[6]?.v || null,
    }))
    .filter((job) => job.titre)

  return NextResponse.json({ jobs })
}
