import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SHEET_ID = '1_-3ex3Dh1wSLHrXFos1pUbqrnv1gsIPehJ3WTfZwul4'
const SHEET_NAME = 'USER_PROFILES'
const N8N_WEBHOOK = process.env.N8N_DELETE_PROFILE_WEBHOOK || process.env.NEXT_PUBLIC_JOBSPEEDER_WEBHOOK || ''

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { profil_id } = await request.json()
  if (!profil_id) return NextResponse.json({ error: 'Missing profil_id' }, { status: 400 })

  const res = await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete_profile',
      profil_id,
      user_id: user.id,
      sheet_id: SHEET_ID,
      sheet_name: SHEET_NAME,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
