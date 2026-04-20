import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { getPublishedJobs } from '@/lib/jobs-db'
import { JobsNavbar, JobsFooter } from '@/components/JobsPageLayout'
import JobsList from './JobsList'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'Offres d\'emploi en Belgique — JobSpeeder',
  description:
    'Découvrez les dernières offres d\'emploi en Belgique issues du Forem. CDI, CDD, temps plein, temps partiel — trouvez votre prochain emploi.',
  alternates: { canonical: `${SITE_URL}/jobs` },
  openGraph: {
    title: 'Offres d\'emploi en Belgique — JobSpeeder',
    description: 'Les dernières offres d\'emploi en Belgique issues du Forem.',
    url: `${SITE_URL}/jobs`,
    type: 'website',
    images: [{ url: `${SITE_URL}/logo-v2.png` }],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Offres d\'emploi', item: `${SITE_URL}/jobs` },
  ],
}

export default async function JobsPage() {
  const { jobs, total } = await getPublishedJobs(1, 100)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <JsonLd data={breadcrumbSchema} />

      <JobsNavbar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-3">Offres d&apos;emploi en Belgique</h1>
            <p className="text-gray-400">
              {total.toLocaleString('fr-BE')} offres disponibles — mises à jour quotidiennement depuis Le Forem
            </p>
          </div>

          <JobsList jobs={jobs} />
        </div>
      </main>

      <JobsFooter />
    </div>
  )
}
