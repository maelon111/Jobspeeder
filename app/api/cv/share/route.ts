import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Public endpoint — no auth required. The UUID acts as an unguessable share token.
export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, template, primary_color, content, updated_at')
      .eq('id', id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[cv/share]', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
