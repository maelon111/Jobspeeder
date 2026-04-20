import { createClient } from '@supabase/supabase-js'

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type PublicJob = {
  id: string
  titre: string
  employeur: string
  logo_url: string | null
  secteur: string | null
  localisation: string | null
  type_contrat: string | null
  regime_travail: string | null
  date_publication: string | null
  date_limite: string | null
  experience_annees: string | null
  metier: string | null
  etudes: string | null
  langues: string | null
  permis: string | null
  avantages: string | null
  missions: string | null
  culture_entreprise: string | null
  recruteur: string | null
  email_contact: string | null
  lien_candidature: string
  plateforme: string
  nombre_postes: string | null
  date_scraping: string | null
  statut: string | null
  published: boolean
  created_at: string
}

export async function getPublishedJobs(page = 1, perPage = 30) {
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error, count } = await publicClient()
    .from('public_jobs')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('date_publication', { ascending: false })
    .range(from, to)
  if (error) throw error
  return { jobs: (data ?? []) as PublicJob[], total: count ?? 0 }
}

export async function getJobById(id: string): Promise<PublicJob | null> {
  const { data, error } = await publicClient()
    .from('public_jobs')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  if (error) return null
  return data as PublicJob
}

export async function getAllPublishedJobIds(): Promise<string[]> {
  const { data } = await publicClient()
    .from('public_jobs')
    .select('id')
    .eq('published', true)
  return (data ?? []).map((r: { id: string }) => r.id)
}
