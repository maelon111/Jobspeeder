import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserPlan } from '@/lib/get-user-plan'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const webhookUrl = process.env.NEXT_PUBLIC_JOBSPEEDER_WEBHOOK
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const planInfo = user ? await getUserPlan(supabase, user.id) : null

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        _plan: planInfo?.plan ?? 'decouverte',
        _plan_status: planInfo?.status ?? 'active',
        _billing_period: planInfo?.billing_period ?? 'monthly',
        _plan_expires_at: planInfo?.current_period_end ?? null,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('[campaign/launch] webhook error:', response.status, text)
      return NextResponse.json({ error: `Webhook returned ${response.status}` }, { status: 502 })
    }

    const data = await response.json()

    if (data?.error === 'quota_exceeded') {
      return NextResponse.json(
        {
          error: 'quota_exceeded',
          quota_type: /quotidien|jour/i.test(data.message ?? '') ? 'daily' : 'monthly',
          message: data.message,
          quota_used: data.quota_used,
          quota_limit: data.quota_limit,
        },
        { status: 429 }
      )
    }

    return NextResponse.json({ success: true, webhook: data })
  } catch (error) {
    console.error('[campaign/launch] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
