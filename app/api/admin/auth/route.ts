import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!
const ADMIN_SECRET = process.env.ADMIN_SECRET!

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  return NextResponse.json({ ok: true })
}
