import type { Metadata } from 'next'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'Tarifs JobSpeeder — Gold, Platinum, Elite | Automatisation de candidatures',
  description: 'Choisissez votre forfait JobSpeeder. De 0€ à 149€/mois — candidatures automatiques par IA, CV optimisé ATS, relances automatiques. Essai gratuit sans CB.',
  keywords: ['tarifs jobspeeder', 'forfait candidature automatique', 'prix automatisation emploi', 'abonnement ia emploi'],
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Tarifs JobSpeeder — Postulez à 100 offres pendant que vous dormez',
    description: 'De gratuit à 149€/mois. Candidatures automatiques, CV ATS optimisé, relances. Changez ou annulez à tout moment.',
    url: `${SITE_URL}/pricing`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: 'JobSpeeder Tarifs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarifs JobSpeeder — Automatisation IA de candidatures',
    description: 'De gratuit à 149€/mois. Essai sans engagement.',
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
