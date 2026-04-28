import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function detectAtsType(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('lever.co')) return 'lever'
  if (u.includes('greenhouse.io') || u.includes('boards.greenhouse')) return 'greenhouse'
  if (u.includes('workday.com') || u.includes('myworkdayjobs.com')) return 'workday'
  if (u.includes('smartrecruiters.com')) return 'smartrecruiters'
  if (u.includes('talentsoft.com')) return 'talentsoft'
  if (u.includes('icims.com')) return 'icims'
  if (u.includes('successfactors.com') || u.includes('sapsf.com')) return 'successfactors'
  if (u.includes('jobvite.com')) return 'jobvite'
  if (u.includes('teamtailor.com')) return 'teamtailor'
  if (u.includes('breezy.hr')) return 'breezy'
  return 'direct'
}

// POST /api/extension/callback
// Receives form fill feedback from the Chrome extension and stores it in form_fill_attempts.
// This endpoint is public (no auth) — data is anonymous telemetry.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      status,
      timestamp,
      job_url,
      form_signature,
      fields_mapped,
      fields_map,
      missing_fields,
      validation_errors,
      ia_used,
      fill_duration_ms,
      page_title,
      step_count,
      failure_reason,
      total_fields_detected,
    } = body

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    const domain = job_url ? extractDomain(String(job_url)) : null
    const ats_type = job_url ? detectAtsType(String(job_url)) : null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('form_fill_attempts').insert({
      status: String(status),
      timestamp: timestamp ? String(timestamp) : new Date().toISOString(),
      job_url: job_url ? String(job_url) : null,
      domain,
      page_title: page_title ? String(page_title) : null,
      form_signature: form_signature ? String(form_signature) : null,
      fields_mapped: typeof fields_mapped === 'number' ? fields_mapped : 0,
      fields_map: fields_map && typeof fields_map === 'object' ? fields_map : null,
      missing_fields: Array.isArray(missing_fields) ? missing_fields : null,
      validation_errors: Array.isArray(validation_errors) ? validation_errors : null,
      ia_used: ia_used ? String(ia_used) : null,
      fill_duration_ms: typeof fill_duration_ms === 'number' ? fill_duration_ms : null,
      ats_type,
      step_count: typeof step_count === 'number' ? step_count : null,
      failure_reason: failure_reason ? String(failure_reason) : null,
      total_fields_detected: typeof total_fields_detected === 'number' ? total_fields_detected : null,
    })

    if (error) {
      console.error('[extension/callback]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[extension/callback]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
