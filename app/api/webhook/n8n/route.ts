import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// This endpoint receives updates FROM n8n automation
// n8n sends: { user_id, company, job_title, job_url, applied_via, status }
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { user_id, company, job_title, job_url, applied_via, status, notes } = body

    if (!user_id || !company || !job_title) {
      return NextResponse.json({ error: 'Missing required fields: user_id, company, job_title' }, { status: 400 })
    }

    // Use service role client (bypasses RLS for webhook)
    const supabase = createServiceClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if application already exists (avoid duplicates)
    const { data: existing } = await supabase
      .from('applications')
      .select('id, status')
      .eq('user_id', user_id)
      .eq('company', company)
      .eq('job_title', job_title)
      .single()

    if (existing) {
      // Update status only if it's a progression
      const { data } = await supabase
        .from('applications')
        .update({ status: status || existing.status, notes: notes || undefined })
        .eq('id', existing.id)
        .select()
        .single()
      return NextResponse.json({ success: true, action: 'updated', application: data })
    } else {
      // Create new application
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id,
          company,
          job_title,
          job_url: job_url || null,
          applied_via: applied_via || 'skyvern',
          status: status || 'sent',
          notes: notes || null,
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, action: 'created', application: data })
    }

  } catch (error) {
    console.error('n8n webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
