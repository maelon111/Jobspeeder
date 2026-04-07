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

    // Upload CV to Supabase Storage
    const fileExt = cvFile.name.split('.').pop()
    const filePath = `ats/${user.id}/${Date.now()}.${fileExt}`
    const arrayBuffer = await cvFile.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('campaign-cvs')
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: cvFile.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[ats-analysis] upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload CV' }, { status: 500 })
    }

    const { data: { publicUrl: cvUrl } } = supabase.storage
      .from('campaign-cvs')
      .getPublicUrl(filePath)

    const payload = {
      user_id: user.id,
      cv_filename: cvFile.name,
      cv_url: cvUrl,
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

    const raw = await response.json()
    const item = Array.isArray(raw) ? raw[0] : raw
    const result = item?.json ?? item

    // Normalize: n8n may return comma-separated strings instead of arrays
    const toArray = (v: unknown): string[] => {
      if (Array.isArray(v)) return v
      if (typeof v === 'string' && v.length > 0) return v.split(',').map((s) => s.trim())
      return []
    }

    const normalized = {
      ...result,
      keywords_found: toArray(result.keywords_found),
      keywords_missing: toArray(result.keywords_missing),
    }

    return NextResponse.json(normalized)

  } catch (error) {
    console.error('[ats-analysis] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
