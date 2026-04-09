import { NextRequest, NextResponse } from 'next/server'
import { matchesService } from '@/lib/coach-services'

const APPO_URL = 'https://bzmqlwugrvgcheborvbp.supabase.co'
const APPO_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bXFsd3VncnZnY2hlYm9ydmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzcwMjQsImV4cCI6MjA4Nzk1MzAyNH0.Q9STobLzanNND48BhXpFFeTLuySHDv1Zyt0fASjzxGQ'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ville = searchParams.get('ville')
    const pays = searchParams.get('pays')
    const search = searchParams.get('search')
    const service = searchParams.get('service')

    const params = new URLSearchParams({
      select: 'slug,display_name,bio,bio_en,category,metier,secteur,ville,pays,rating,total_reviews,cover_image_url,is_verified,accent_color,instagram_url,linkedin_url,users(avatar_url)',
      onboarding_completed: 'eq.true',
      is_active: 'eq.true',
      order: 'rating.desc',
      limit: '100',
    })

    // Filtrer uniquement les profils de type "coach" (cherche dans category ET bio)
    params.append('or', '(category.ilike.*coach*,metier.ilike.*coach*,category.ilike.*carrière*,category.ilike.*career*,metier.ilike.*carrière*,metier.ilike.*career*,bio.ilike.*coach*,bio.ilike.*ICF*,bio.ilike.*PCC*,bio.ilike.*ACC*,bio.ilike.*MCC*)')

    if (ville) params.append('ville', `ilike.*${ville}*`)
    if (pays) params.append('pays', `ilike.*${pays}*`)

    const res = await fetch(`${APPO_URL}/rest/v1/provider_profiles?${params}`, {
      headers: {
        apikey: APPO_ANON,
        Authorization: `Bearer ${APPO_ANON}`,
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error('Failed to fetch from Appo')

    let data: AppoProfile[] = await res.json()

    // Filtre texte libre
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(p =>
        p.display_name?.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.metier?.toLowerCase().includes(q)
      )
    }

    // Filtre par service standardisé
    if (service) {
      data = data.filter(p => matchesService(p.category, p.metier, service))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Fetch coaches error:', error)
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 })
  }
}

type AppoProfile = {
  slug: string
  display_name: string
  bio: string | null
  bio_en: string | null
  category: string | null
  metier: string | null
  secteur: string | null
  ville: string | null
  pays: string | null
  rating: number
  total_reviews: number
  cover_image_url: string | null
  is_verified: boolean
  accent_color: string | null
  instagram_url: string | null
  linkedin_url: string | null
  users: { avatar_url: string | null } | null
}
