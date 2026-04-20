import type { Metadata } from 'next'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'Connexion — JobSpeeder',
  description: 'Connectez-vous à votre compte JobSpeeder et reprenez vos candidatures automatiques là où vous les avez laissées.',
  alternates: { canonical: `${SITE_URL}/login` },
  openGraph: {
    title: 'Connexion — JobSpeeder',
    description: 'Accédez à votre espace JobSpeeder.',
    url: `${SITE_URL}/login`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
