import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Stats } from '@/components/landing/Stats'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'
import { JsonLd } from '@/components/JsonLd'
import Link from 'next/link'
import { Zap, Mail } from 'lucide-react'

const SITE_URL = 'https://jobspeeder.online'

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JobSpeeder',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    "Automatisez vos candidatures d'emploi grâce à l'IA. Notre bot postule à 100 offres pendant votre sommeil, avec un CV optimisé pour les filtres ATS.",
  offers: [
    {
      '@type': 'Offer',
      name: 'FREE',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Pour tester JobSpeeder – 20 candidatures/mois',
      url: `${SITE_URL}/pricing`,
    },
    {
      '@type': 'Offer',
      name: 'GOLD',
      price: '29',
      priceCurrency: 'EUR',
      description: 'Pour une recherche active – 150 candidatures/mois',
      url: `${SITE_URL}/pricing`,
    },
    {
      '@type': 'Offer',
      name: 'PLATINUM',
      price: '59',
      priceCurrency: 'EUR',
      description: 'Pour maximiser vos chances – 500 candidatures/mois',
      url: `${SITE_URL}/pricing`,
    },
    {
      '@type': 'Offer',
      name: 'ELITE',
      price: '149',
      priceCurrency: 'EUR',
      description: 'Pour les profils exigeants – 1500 candidatures/mois',
      url: `${SITE_URL}/pricing`,
    },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment automatiser vos candidatures avec JobSpeeder',
  description: "De zéro à 100 candidatures envoyées en moins de 5 minutes.",
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Uploadez votre CV',
      text: "Importez votre CV existant ou construisez-en un depuis zéro avec notre éditeur intégré. Formats supportés : PDF, DOCX.",
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Optimisation IA',
      text: "GPT-4o analyse et réécrit votre CV pour maximiser votre score ATS et attirer les recruteurs.",
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Candidatures automatiques',
      text: "Notre bot postule aux offres correspondant à vos critères — emails, LinkedIn, sites carrière — 24h/24.",
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Accueil',
      item: SITE_URL,
    },
  ],
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060c16]">
      <JsonLd data={softwareAppSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <Link href="/" className="flex items-center gap-2 text-sm font-bold mb-1.5">
                <div className="p-1 bg-brand rounded-lg">
                  <Zap size={12} className="text-black fill-current" />
                </div>
                <span className="text-white">JobSpeeder</span>
              </Link>
              <p className="text-xs text-white/25 max-w-[200px]">
                L&apos;automatisation intelligente de vos candidatures.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Légal</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/confidentialite" className="text-xs text-white/35 hover:text-white/70 transition-colors">Confidentialité</Link>
                  <Link href="/cgu" className="text-xs text-white/35 hover:text-white/70 transition-colors">CGU</Link>
                  <Link href="/cookies" className="text-xs text-white/35 hover:text-white/70 transition-colors">Cookies</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Compte</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/login" className="text-xs text-white/35 hover:text-white/70 transition-colors">Connexion</Link>
                  <Link href="/register" className="text-xs text-white/35 hover:text-white/70 transition-colors">S&apos;inscrire</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Produit</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/pricing" className="text-xs text-white/35 hover:text-white/70 transition-colors">Tarifs</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-white/20">© 2025 JobSpeeder. Tous droits réservés.</p>
            <div className="flex items-center gap-1.5">
              <Mail size={11} className="text-white/20" />
              <a href="mailto:info@jobspeeder.online" className="text-xs text-white/25 hover:text-brand/70 transition-colors">
                info@jobspeeder.online
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
