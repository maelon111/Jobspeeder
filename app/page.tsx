import { LandingContent } from '@/components/landing/LandingContent'
import { JsonLd } from '@/components/JsonLd'

const SITE_URL = 'https://jobspeeder.online'

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JobSpeeder',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    "Automatisez vos candidatures d'emploi grâce à l'IA. Nos algorithmes intelligents postulent à 100 offres pendant votre sommeil, avec un CV optimisé pour les filtres ATS.",
  offers: [
    { '@type': 'Offer', name: 'FREE',     price: '0',   priceCurrency: 'EUR', description: 'Pour tester JobSpeeder – 20 candidatures/mois',       url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'GOLD',     price: '29',  priceCurrency: 'EUR', description: 'Pour une recherche active – 150 candidatures/mois',   url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'PLATINUM', price: '59',  priceCurrency: 'EUR', description: 'Pour maximiser vos chances – 500 candidatures/mois',  url: `${SITE_URL}/pricing` },
    { '@type': 'Offer', name: 'ELITE',    price: '149', priceCurrency: 'EUR', description: 'Pour les profils exigeants – 1500 candidatures/mois', url: `${SITE_URL}/pricing` },
  ],
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Comment automatiser vos candidatures avec JobSpeeder',
  description: "De zéro à 100 candidatures envoyées en moins de 5 minutes.",
  totalTime: 'PT5M',
  step: [
    { '@type': 'HowToStep', position: 1, name: 'Uploadez votre CV',          text: "Importez votre CV existant ou construisez-en un depuis zéro avec notre éditeur intégré. Formats supportés : PDF, DOCX." },
    { '@type': 'HowToStep', position: 2, name: 'Optimisation IA',            text: "Nos modèles IA analysent et réécrivent votre CV pour maximiser votre score ATS et attirer les recruteurs." },
    { '@type': 'HowToStep', position: 3, name: 'Candidatures automatiques',  text: "Nos algorithmes intelligents postulent aux offres correspondant à vos critères — emails, LinkedIn, sites carrière — 24h/24." },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
  ],
}

export default function LandingPage() {
  return (
    <>
      <JsonLd data={softwareAppSchema} />
      <JsonLd data={howToSchema} />
      <JsonLd data={breadcrumbSchema} />
      <LandingContent />
    </>
  )
}
