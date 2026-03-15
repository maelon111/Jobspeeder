import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const webhookUrl = process.env.NEXT_PUBLIC_JOBSPEEDER_WEBHOOK
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[campaign/launch] webhook error:', response.status, text)
      return NextResponse.json({ error: `Webhook returned ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, webhook: data })
  } catch (error) {
    console.error('[campaign/launch] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
