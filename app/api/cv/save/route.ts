import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ResumeData, TemplateType } from '@/types/resume'

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json() as {
      id?: string
      title: string
      template: TemplateType
      primaryColor: string
      content: ResumeData
      settings?: {
        roundedPhoto?: boolean
        photoSize?: number
        photoPositionX?: number
        photoContainerSize?: number
      }
    }

    const storedContent = body.settings
      ? { ...body.content, _settings: body.settings }
      : body.content

    if (body.id) {
      // Update
      const { error } = await supabase
        .from('resumes')
        .update({
          title: body.title,
          template: body.template,
          primary_color: body.primaryColor,
          content: storedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.id)
        .eq('user_id', user.id)

      if (error) throw error
      return NextResponse.json({ success: true, id: body.id })
    } else {
      // Insert
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: body.title || `CV de ${body.content?.personal?.name || 'Nouveau'}`,
          template: body.template,
          primary_color: body.primaryColor,
          content: storedContent,
        })
        .select('id')
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, id: data.id })
    }
  } catch (err) {
    console.error('[cv/save]', err)
    return NextResponse.json({ error: 'Erreur sauvegarde' }, { status: 500 })
  }
}
