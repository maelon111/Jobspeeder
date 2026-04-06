import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ATS_WEBHOOK_URL = process.env.N8N_ATS_WEBHOOK_URL

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!ATS_WEBHOOK_URL) {
      return NextResponse.json({ error: 'ATS webhook not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const cvFile = formData.get('cv_file') as File | null
    const jobOffer = formData.get('job_offer') as string | null

    if (!cvFile || !jobOffer?.trim()) {
      return NextResponse.json({ error: 'cv_file and job_offer are required' }, { status: 400 })
    }

    // Convert file to base64 for n8n
    const arrayBuffer = await cvFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const payload = {
      user_id: user.id,
      cv_filename: cvFile.name,
      cv_mimetype: cvFile.type,
      cv_base64: base64,
      job_offer: jobOffer.trim(),
    }

    const response = await fetch(ATS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[ats-analysis] n8n error:', response.status, text)
      return NextResponse.json({ error: 'Analysis failed' }, { status: 502 })
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('[ats-analysis] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
