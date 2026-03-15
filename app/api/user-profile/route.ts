import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SHEET_ID = '1_-3ex3Dh1wSLHrXFos1pUbqrnv1gsIPehJ3WTfZwul4'
const SHEET_NAME = 'USER_PROFILES'

function parseGviz(text: string) {
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/)
  if (!match) return null
  return JSON.parse(match[1])
}

function safeJson(val: string | null) {
  if (!val) return null
  try { return JSON.parse(val) } catch { return val }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = user.id.replace(/'/g, "\\'")

  // Colonnes: A=profil_id, B=user_id, C=job_titles_cibles, Q=date_mise_a_jour,
  // R=cv_url, U=first_name, V=last_name, W=email, X=phone, Y=cv_city, Z=cv_country,
  // AA=nationality, AB=driving_license, AC=linkedin, AD=cv_language, AE=years_experience,
  // AF=experience_summary, AG=key_skills, AH=languages,
  // AI=work_experience_1, AJ=work_experience_2, AK=work_experience_3, AL=work_experience_4,
  // AM=highest_degree, AN=education_field, AO=school, AP=graduation_year,
  // AQ=education_history_1, AR=education_history_2,
  // AS=poste, AT=localisation, AU=contrat, AV=remote,
  // AW=salary_expectation, AX=availability, AY=work_authorization, AZ=volume_par_jour
  const query = `select A,B,C,Q,R,U,V,W,X,Y,Z,AA,AB,AC,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ,AR,AS,AT,AU,AW,AX,AY where B = '${userId}'`

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&tq=${encodeURIComponent(query)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  const text = await res.text()
  const json = parseGviz(text)

  if (!json || json.status === 'error') {
    return NextResponse.json({ profiles: [] })
  }

  type GvizRow = { c: ({ v: string | number | null } | null)[] }
  const rows: GvizRow[] = json?.table?.rows || []

  const profiles = rows.map((row) => {
    const v = (i: number) => row.c?.[i]?.v ?? null
    return {
      profil_id: v(0),
      user_id: v(1),
      job_titles_cibles: v(2),
      date_mise_a_jour: v(3),
      cv_url: v(4),
      first_name: v(5),
      last_name: v(6),
      email: v(7),
      phone: v(8),
      cv_city: v(9),
      cv_country: v(10),
      nationality: v(11),
      driving_license: v(12),
      linkedin: v(13),
      years_experience: v(14),
      experience_summary: v(15),
      key_skills: safeJson(v(16) as string),
      languages: safeJson(v(17) as string),
      work_experience_1: safeJson(v(18) as string),
      work_experience_2: safeJson(v(19) as string),
      work_experience_3: safeJson(v(20) as string),
      work_experience_4: safeJson(v(21) as string),
      highest_degree: v(22),
      education_field: v(23),
      school: v(24),
      graduation_year: v(25),
      education_history_1: safeJson(v(26) as string),
      education_history_2: safeJson(v(27) as string),
      poste: v(28),
      localisation: v(29),
      contrat: v(30),
      salary_expectation: v(31),
      availability: v(32),
      work_authorization: v(33),
    }
  })

  return NextResponse.json({ profiles })
}
