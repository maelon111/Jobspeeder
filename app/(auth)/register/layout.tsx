import type { Metadata } from 'next'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'Créer un compte — JobSpeeder | Automatisez vos candidatures',
  description: 'Rejoignez JobSpeeder gratuitement. Automatisez vos candidatures avec l\'IA GPT-4o, optimisez votre CV pour les filtres ATS et trouvez votre emploi plus vite.',
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: 'Créer un compte JobSpeeder — Postulez à 100 offres pendant que vous dormez',
    description: 'Inscription gratuite. L\'IA postule pour vous, personnalise chaque lettre, relance automatiquement.',
    url: `${SITE_URL}/register`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Créer un compte JobSpeeder',
    description: 'Automatisez vos candidatures avec l\'IA. Gratuit pour commencer.',
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
