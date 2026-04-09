import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const WEBHOOK_URL = 'https://n8n.jobspeeder.online/webhook/importer-cv-builder'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const userId = (formData.get('user_id') as string) || 'anonymous'

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
    }

    // Upload to Supabase Storage using service role (no auth required)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const ext = file.name.split('.').pop() ?? 'pdf'
    const filePath = `cv-builder/${userId}/${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('campaign-cvs')
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('[cv/import] upload error:', uploadError)
      return NextResponse.json({ error: 'Erreur upload fichier' }, { status: 500 })
    }

    const { data: { publicUrl: cvUrl } } = supabase.storage
      .from('campaign-cvs')
      .getPublicUrl(filePath)

    // Send URL to n8n webhook
    const n8nRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cv_url: cvUrl,
        cv_filename: file.name,
        user_id: userId,
      }),
    })

    if (!n8nRes.ok) {
      const text = await n8nRes.text()
      console.error('[cv/import] n8n error:', n8nRes.status, text)
      return NextResponse.json({ error: 'Erreur analyse CV' }, { status: 502 })
    }

    const raw = await n8nRes.json()
    return NextResponse.json(raw)

  } catch (err) {
    console.error('[cv/import] error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
