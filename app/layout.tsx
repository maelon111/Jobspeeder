import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { LanguageProvider } from '@/lib/i18n'
import { JsonLd } from '@/components/JsonLd'
import './globals.css'

const SITE_URL = 'https://jobspeeder.online'

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'JobSpeeder',
  url: SITE_URL,
  description: "Plateforme d'automatisation de candidatures d'emploi propulsée par l'IA GPT-4o.",
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/register`,
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JobSpeeder',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-v2.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@jobspeeder.online',
    contactType: 'customer support',
  },
}

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'JobSpeeder — Automated AI Job Applications',
  description: 'Apply to 100 jobs while you sleep. AI-powered job application automation.',
  keywords: ['job search', 'AI', 'automation', 'applications', 'career'],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JobSpeeder',
  },
  openGraph: {
    title: 'JobSpeeder — Postulez à 100 offres pendant que vous dormez',
    description: "Candidatures automatiques par IA. CV optimisé, lettre personnalisée, envoi automatique.",
    type: 'website',
    url: SITE_URL,
    siteName: 'JobSpeeder',
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'JobSpeeder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSpeeder — Postulez à 100 offres pendant que vous dormez',
    description: "Candidatures automatiques par IA.",
    images: [`${SITE_URL}/opengraph-image`],
  },
}

export const viewport: Viewport = {
  themeColor: '#00ff88',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#060c16] text-white min-h-screen`}>
        <LanguageProvider>
        {children}
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
