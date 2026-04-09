import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prenom, nom, email, telephone, ville, specialite, message } = body

    if (!prenom || !nom || !email || !telephone || !ville || !specialite) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
    }

    // Forward to n8n webhook for notification
    const webhookUrl = process.env.JOBSPEEDER_COACHS_WEBHOOK
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, telephone, ville, specialite, message, source: 'welcome-coachs', date: new Date().toISOString() }),
      }).catch(() => {}) // non-fatal
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
