import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 })

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, template, primary_color, content, updated_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[cv/get]', err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
