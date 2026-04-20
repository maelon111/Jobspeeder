import type { Metadata } from 'next'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'JobSpeeder pour les coachs — Trouvez des clients, gardez-les',
  description:
    'JobSpeeder trouve des entretiens pour vos candidats, vous les préparez à les réussir. Devenez partenaire coach et développez votre activité.',
  openGraph: {
    title: 'JobSpeeder trouve des entretiens, vous préparez à les réussir',
    description:
      'Devenez coach partenaire JobSpeeder. Vos candidats postulent en automatique, vous intervenez au moment clé : la préparation aux entretiens.',
    type: 'website',
    url: `${SITE_URL}/welcome-coachs`,
    siteName: 'JobSpeeder',
    images: [
      {
        url: `${SITE_URL}/welcome-coachs/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'JobSpeeder — Partenariat Coachs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSpeeder trouve des entretiens, vous préparez à les réussir',
    description:
      'Devenez coach partenaire JobSpeeder. Vos candidats postulent en automatique, vous intervenez au moment clé.',
    images: [`${SITE_URL}/welcome-coachs/opengraph-image`],
  },
}

export default function WelcomeCoachsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
