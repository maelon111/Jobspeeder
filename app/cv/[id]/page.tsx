import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { CVShareView } from './CVShareView'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getResume(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, template, primary_color, content, updated_at')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data
}

const SITE_URL = 'https://jobspeeder.online'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const resume = await getResume(id)
  const name = resume?.content?.personal?.name ?? 'CV'
  const title = resume?.title ?? `CV de ${name}`
  const url = `${SITE_URL}/cv/${id}`
  return {
    title: `${name} — CV JobSpeeder`,
    description: `Consultez le CV de ${name} — créé et optimisé avec JobSpeeder CV Builder.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — CV JobSpeeder`,
      description: `CV de ${name}, créé avec JobSpeeder.`,
      url,
      type: 'profile',
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: `CV ${name}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — CV JobSpeeder`,
      description: `CV de ${name}, optimisé ATS.`,
      images: [`${SITE_URL}/og-image.png`],
    },
  }
}

export default async function CVSharePage({ params }: PageProps) {
  const { id } = await params
  const resume = await getResume(id)
  if (!resume) notFound()

  return <CVShareView resume={resume} />
}
