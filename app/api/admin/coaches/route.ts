import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const APPO_URL = 'https://bzmqlwugrvgcheborvbp.supabase.co'
const APPO_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bXFsd3VncnZnY2hlYm9ydmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzcwMjQsImV4cCI6MjA4Nzk1MzAyNH0.Q9STobLzanNND48BhXpFFeTLuySHDv1Zyt0fASjzxGQ'

// Catégories APPO pertinentes pour la recherche d'emploi
const CAREER_CATEGORIES = ['Career Coach', 'Life & Career Coach']

function isAdmin(token: string | undefined) {
  return token === process.env.ADMIN_SECRET
}

export async function GET() {
  const cookieStore = await cookies()
  if (!isAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Récupérer les coaches depuis APPO (conseil_coaching = coaching carrière)
  const params = new URLSearchParams({
    select: 'slug,display_name,bio,category,metier,ville,pays,rating,total_reviews,cover_image_url,is_verified,is_active,onboarding_completed,created_at,users(email,avatar_url)',
    onboarding_completed: 'eq.true',
    is_active: 'eq.true',
    secteur: 'eq.conseil_coaching',
    order: 'created_at.desc',
    limit: '500',
  })

  const appoRes = await fetch(`${APPO_URL}/rest/v1/provider_profiles?${params}`, {
    headers: {
      apikey: APPO_ANON,
      Authorization: `Bearer ${APPO_ANON}`,
    },
    next: { revalidate: 60 },
  })

  if (!appoRes.ok) {
    return NextResponse.json({ error: 'Erreur APPO' }, { status: 500 })
  }

  const appoCoaches: AppoProfile[] = await appoRes.json()

  // 2. Filtrer : uniquement les coaches en recherche d'emploi (Career Coach / Life & Career Coach)
  const careerCoaches = appoCoaches.filter(c =>
    c.category && CAREER_CATEGORIES.includes(c.category)
  )

  // 3. Récupérer les statuts locaux depuis JobSpeeder
  const supabase = createAdminClient()
  const { data: localCoaches } = await supabase
    .from('coaches')
    .select('slug, status, is_active, specialties')

  const localMap = Object.fromEntries(
    (localCoaches ?? []).map(c => [c.slug, c])
  )

  // 4. Fusionner : données APPO + statut local
  const coaches = careerCoaches.map(c => {
    const local = localMap[c.slug]
    return {
      slug: c.slug,
      name: c.display_name,
      email: (c.users as { email?: string } | null)?.email ?? null,
      avatar_url: (c.users as { avatar_url?: string } | null)?.avatar_url ?? c.cover_image_url,
      category: c.category,
      city: c.ville,
      country: c.pays,
      rating: c.rating,
      total_reviews: c.total_reviews,
      is_verified: c.is_verified,
      bio: c.bio,
      // Statut local (pending par défaut si pas encore géré)
      status: local?.status ?? 'pending',
      is_active: local?.is_active ?? false,
      specialties: local?.specialties ?? [],
      created_at: c.created_at,
      synced: !!local,
    }
  })

  return NextResponse.json({ coaches })
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  if (!isAdmin(cookieStore.get('admin_token')?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug, name, email, status, is_active } = await req.json()
  const supabase = createAdminClient()

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (status !== undefined) update.status = status
  if (is_active !== undefined) update.is_active = is_active

  // Upsert : crée l'entrée locale si elle n'existe pas encore (name + email requis à l'insertion)
  const { error } = await supabase
    .from('coaches')
    .upsert({ slug, name: name ?? slug, email: email ?? slug + '@appo.coach', ...update }, { onConflict: 'slug' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

type AppoProfile = {
  slug: string
  display_name: string
  bio: string | null
  category: string | null
  metier: string | null
  ville: string | null
  pays: string | null
  rating: number
  total_reviews: number
  cover_image_url: string | null
  is_verified: boolean
  is_active: boolean
  onboarding_completed: boolean
  created_at: string
  users: { email?: string; avatar_url?: string } | null
}
