import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Briefcase, Clock, Building2, ExternalLink, GraduationCap, Languages, Car, Send } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { getJobById } from '@/lib/jobs-db'
import JobApplicationButton from './JobApplicationButton'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://jobspeeder.online'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) return {}
  const title = `${job.titre} — ${job.employeur} | JobSpeeder`
  const description = job.missions
    ? job.missions.substring(0, 160).replace(/\n/g, ' ') + '…'
    : `Offre d'emploi : ${job.titre} chez ${job.employeur} à ${job.localisation ?? 'Belgique'}`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/jobs/${id}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/jobs/${id}`,
      type: 'article',
    },
  }
}

function buildJobPostingSchema(job: Awaited<ReturnType<typeof getJobById>>) {
  if (!job) return null
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.titre,
    description: [job.missions, job.culture_entreprise].filter(Boolean).join('\n\n') || job.titre,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.employeur,
      ...(job.logo_url ? { logo: job.logo_url } : {}),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.localisation ?? 'Belgique',
        addressCountry: 'BE',
      },
    },
    employmentType: mapContractType(job.type_contrat),
    datePosted: job.date_publication ?? job.date_scraping ?? new Date().toISOString().split('T')[0],
    url: `${SITE_URL}/jobs/${job.id}`,
    applyUrl: job.lien_candidature,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Le Forem',
      value: job.id,
    },
  }
  if (job.date_limite) schema.validThrough = job.date_limite
  if (job.nombre_postes && job.nombre_postes !== '1') schema.totalJobOpenings = parseInt(job.nombre_postes)
  return schema
}

function mapContractType(type: string | null): string {
  if (!type) return 'OTHER'
  const t = type.toUpperCase()
  if (t.includes('CDI') || t.includes('INDETERMINT') || t.includes('INDÉTERMIN')) return 'FULL_TIME'
  if (t.includes('CDD') || t.includes('DÉTERMIN') || t.includes('DETERMIN')) return 'TEMPORARY'
  if (t.includes('PARTIEL') || t.includes('MI-TEMPS')) return 'PART_TIME'
  if (t.includes('INTERIM') || t.includes('INTÉRIM')) return 'TEMPORARY'
  if (t.includes('FREELANCE') || t.includes('INDÉPENDANT')) return 'CONTRACTOR'
  if (t.includes('APPRENTI') || t.includes('ALTERNANCE')) return 'INTERN'
  return 'OTHER'
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getLogoUrl(job: Awaited<ReturnType<typeof getJobById>>) {
  if (!job) return ''
  if (job.logo_url) return job.logo_url
  const domain = job.employeur?.replace(/\s+.*/g, '').toLowerCase() || 'company'
  return `https://logo.clearbit.com/${domain}.com`
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) notFound()

  const jobSchema = buildJobPostingSchema(job)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Offres d\'emploi', item: `${SITE_URL}/jobs` },
      { '@type': 'ListItem', position: 3, name: job.titre, item: `${SITE_URL}/jobs/${id}` },
    ],
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {jobSchema && <JsonLd data={jobSchema} />}
      <JsonLd data={breadcrumbSchema} />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/jobs" className="text-sm text-gray-400 hover:text-white mb-8 inline-flex items-center gap-1">
          ← Toutes les offres
        </Link>

        {/* Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-5 mb-6">
            <img
              src={getLogoUrl(job)}
              alt={job.employeur}
              className="w-16 h-16 rounded-xl object-contain bg-white p-1.5 flex-shrink-0"
              onError={(e) => {
                const img = e.currentTarget
                img.style.display = 'none'
              }}
            />
            <div>
              <h1 className="text-2xl font-bold mb-1">{job.titre}</h1>
              <p className="text-brand font-medium">{job.employeur}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            {job.localisation && (
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.localisation}
              </div>
            )}
            {job.type_contrat && (
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.type_contrat}
              </div>
            )}
            {job.regime_travail && (
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.regime_travail}
              </div>
            )}
            {job.secteur && (
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.secteur}
              </div>
            )}
            {job.etudes && (
              <div className="flex items-center gap-2 text-gray-300">
                <GraduationCap className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.etudes}
              </div>
            )}
            {job.langues && (
              <div className="flex items-center gap-2 text-gray-300">
                <Languages className="w-4 h-4 text-gray-500 flex-shrink-0" />
                {job.langues}
              </div>
            )}
            {job.permis && (
              <div className="flex items-center gap-2 text-gray-300">
                <Car className="w-4 h-4 text-gray-500 flex-shrink-0" />
                Permis {job.permis}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <span className="text-xs text-gray-500">
              Publié le {formatDate(job.date_publication)}
              {job.date_limite && ` · Expire le ${formatDate(job.date_limite)}`}
            </span>
            <div className="flex items-center gap-2">
              <JobApplicationButton job={job} />
              <a
                href={job.lien_candidature}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Via Le Forem
              </a>
            </div>
          </div>
        </div>

        {/* Missions */}
        {job.missions && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4">Description du poste</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {job.missions}
            </div>
          </section>
        )}

        {/* Avantages */}
        {job.avantages && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4">Avantages</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {job.avantages}
            </div>
          </section>
        )}

        {/* Culture entreprise */}
        {job.culture_entreprise && (
          <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
            <h2 className="text-lg font-semibold mb-4">À propos de {job.employeur}</h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {job.culture_entreprise}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
