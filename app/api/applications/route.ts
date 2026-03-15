import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status as 'pending' | 'sent' | 'viewed' | 'interview' | 'rejected')
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ applications: data, total: count })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}
