import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: coach, error } = await supabaseAdmin
    .from('coaches')
    .select('id, name, slug, photo_url, bio, referral_code, promo_code, appo_slug, commission_rate, status, is_active, created_at')
    .eq('user_id', user.id)
    .eq('status', 'approved')
    .single() as { data: Record<string, unknown> | null; error: unknown }

  if (error || !coach) {
    return NextResponse.json({ error: 'Profil coach introuvable' }, { status: 404 })
  }

  return NextResponse.json(coach)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifie qu'il n'a pas déjà un profil
  const { data: existing } = await supabaseAdmin
    .from('coaches')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Profil coach déjà existant' }, { status: 409 })
  }

  const body = await req.json() as {
    name: string
    appo_slug?: string
    bio?: string
    specialties?: string[]
    city?: string
    country?: string
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  }

  // Génère le referral_code depuis le slug Appo ou le nom
  const base = body.appo_slug?.trim() || body.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
  const suffix = Math.random().toString(36).slice(2, 6)
  const referral_code = `${base}-${suffix}`

  // Génère le slug unique
  const slug = `${base}-${Date.now().toString(36)}`

  const { data: coach, error } = await supabaseAdmin
    .from('coaches')
    .insert({
      user_id: user.id,
      slug,
      name: body.name.trim(),
      email: user.email!,
      bio: body.bio?.trim() || null,
      appo_slug: body.appo_slug?.trim() || null,
      specialties: body.specialties || [],
      city: body.city?.trim() || null,
      country: body.country || 'France',
      referral_code,
      status: 'approved',
      is_active: true,
      commission_rate: 0.15,
    })
    .select()
    .single()

  if (error) {
    console.error('Coach create error:', error)
    return NextResponse.json({ error: 'Erreur création profil' }, { status: 500 })
  }

  // Marque l'utilisateur comme coach dans ses métadonnées (JWT)
  await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role: 'coach' },
  })

  return NextResponse.json(coach, { status: 201 })
}
