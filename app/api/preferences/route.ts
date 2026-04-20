import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserPlan } from '@/lib/get-user-plan'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data } = await supabase
      .from('job_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json({ error: 'Failed to get preferences' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { cv_content, cv_id, ...prefData } = body

    // Save preferences
    const { data: prefs, error } = await supabase
      .from('job_preferences')
      .upsert({
        user_id: user.id,
        job_title: prefData.job_title || null,
        location: prefData.location || null,
        contract_types: prefData.contract_types || [],
        work_time: prefData.work_time || null,
        work_mode: prefData.work_mode || null,
        salary_min: prefData.salary_min || null,
        salary_max: prefData.salary_max || null,
        is_active: prefData.is_active ?? false,
        n8n_webhook_url: prefData.n8n_webhook_url || null,
      })
      .select()
      .single()

    if (error) throw error

    // Trigger n8n webhook if configured
    const webhookUrl = prefData.n8n_webhook_url || process.env.N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'preferences_updated',
            user_id: user.id,
            cv_content,
            cv_id,
            job_preferences: prefs,
            ...(await getUserPlan(supabase, user.id).then(p => ({
              _plan: p.plan,
              _plan_status: p.status,
              _billing_period: p.billing_period,
              _plan_expires_at: p.current_period_end,
            }))),
          }),
        })
      } catch (webhookError) {
        // Non-fatal: log but don't fail
        console.error('n8n webhook error:', webhookError)
      }
    }

    return NextResponse.json({ success: true, preferences: prefs })

  } catch (error) {
    console.error('Save preferences error:', error)
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
