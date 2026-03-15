'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    title: 'Politique de confidentialité',
    updated: '1 mars 2025',
    sections: [
      {
        title: '1. Données collectées',
        body: `JobSpeeder collecte les données suivantes lors de votre inscription et utilisation du service :\n\n• **Données d'identité** : nom complet, adresse email\n• **Données de profil** : numéro de téléphone, localisation, URL LinkedIn, portfolio\n• **Données de CV** : expériences professionnelles, formations, compétences, langues\n• **Données de candidature** : entreprises ciblées, postes postulés, statuts des candidatures\n• **Préférences de recherche** : type de contrat, salaire, mode de travail\n• **Données techniques** : adresse IP, navigateur, cookies de session`,
      },
      {
        title: '2. Utilisation des données',
        body: `Vos données sont utilisées exclusivement pour :\n\n• Automatiser vos candidatures selon vos critères\n• Personnaliser et optimiser votre CV via l'IA\n• Vous envoyer des notifications liées à votre activité\n• Améliorer la qualité du service`,
      },
      {
        title: '3. Partage des données',
        body: `Nous ne vendons jamais vos données personnelles. Elles peuvent être partagées avec :\n\n• **Supabase** (hébergement base de données, UE)\n• **OpenAI** (optimisation CV, données anonymisées)\n• **n8n** (automatisation des candidatures, via votre webhook)\n\nAucun transfert hors UE sans garanties adéquates.`,
      },
      {
        title: '4. Conservation',
        body: `Vos données sont conservées tant que votre compte est actif. Après suppression du compte, vos données sont effacées sous 30 jours.`,
      },
      {
        title: '5. Vos droits',
        body: `Conformément au RGPD, vous disposez des droits suivants :\n\n• **Accès** : obtenir une copie de vos données\n• **Rectification** : corriger des données inexactes\n• **Effacement** : supprimer votre compte et vos données\n• **Portabilité** : recevoir vos données dans un format structuré\n• **Opposition** : vous opposer au traitement à des fins de marketing\n\nPour exercer ces droits : **info@jobspeeder.online**`,
      },
      {
        title: '6. Sécurité',
        body: `Vos données sont chiffrées en transit (TLS) et au repos. L'accès est limité aux services strictement nécessaires au fonctionnement de la plateforme.`,
      },
      {
        title: '7. Contact',
        body: `Pour toute question relative à la protection de vos données : **info@jobspeeder.online**`,
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'March 1, 2025',
    sections: [
      {
        title: '1. Data Collected',
        body: `JobSpeeder collects the following data during registration and use of the service:\n\n• **Identity data**: full name, email address\n• **Profile data**: phone number, location, LinkedIn URL, portfolio\n• **CV data**: work experience, education, skills, languages\n• **Application data**: target companies, applied positions, application statuses\n• **Search preferences**: contract type, salary, work mode\n• **Technical data**: IP address, browser, session cookies`,
      },
      {
        title: '2. Use of Data',
        body: `Your data is used exclusively to:\n\n• Automate your job applications based on your criteria\n• Personalize and optimize your CV using AI\n• Send notifications related to your activity\n• Improve service quality`,
      },
      {
        title: '3. Data Sharing',
        body: `We never sell your personal data. It may be shared with:\n\n• **Supabase** (database hosting, EU)\n• **OpenAI** (CV optimization, anonymized data)\n• **n8n** (application automation, via your webhook)\n\nNo transfer outside the EU without adequate safeguards.`,
      },
      {
        title: '4. Retention',
        body: `Your data is kept as long as your account is active. After account deletion, your data is erased within 30 days.`,
      },
      {
        title: '5. Your Rights',
        body: `Under GDPR, you have the following rights:\n\n• **Access**: obtain a copy of your data\n• **Rectification**: correct inaccurate data\n• **Erasure**: delete your account and data\n• **Portability**: receive your data in a structured format\n• **Objection**: object to processing for marketing purposes\n\nTo exercise these rights: **info@jobspeeder.online**`,
      },
      {
        title: '6. Security',
        body: `Your data is encrypted in transit (TLS) and at rest. Access is limited to services strictly necessary for platform operation.`,
      },
      {
        title: '7. Contact',
        body: `For any questions regarding the protection of your data: **info@jobspeeder.online**`,
      },
    ],
  },
  es: {
    title: 'Política de privacidad',
    updated: '1 de marzo de 2025',
    sections: [
      {
        title: '1. Datos recopilados',
        body: `JobSpeeder recopila los siguientes datos durante el registro y uso del servicio:\n\n• **Datos de identidad**: nombre completo, dirección de email\n• **Datos de perfil**: número de teléfono, ubicación, URL de LinkedIn, portfolio\n• **Datos de CV**: experiencia laboral, formación, habilidades, idiomas\n• **Datos de candidatura**: empresas objetivo, puestos solicitados, estados de solicitudes\n• **Preferencias de búsqueda**: tipo de contrato, salario, modo de trabajo\n• **Datos técnicos**: dirección IP, navegador, cookies de sesión`,
      },
      {
        title: '2. Uso de los datos',
        body: `Sus datos se utilizan exclusivamente para:\n\n• Automatizar sus candidaturas según sus criterios\n• Personalizar y optimizar su CV mediante IA\n• Enviar notificaciones relacionadas con su actividad\n• Mejorar la calidad del servicio`,
      },
      {
        title: '3. Compartición de datos',
        body: `Nunca vendemos sus datos personales. Pueden compartirse con:\n\n• **Supabase** (alojamiento de base de datos, UE)\n• **OpenAI** (optimización de CV, datos anonimizados)\n• **n8n** (automatización de candidaturas, mediante su webhook)\n\nNinguna transferencia fuera de la UE sin garantías adecuadas.`,
      },
      {
        title: '4. Conservación',
        body: `Sus datos se conservan mientras su cuenta esté activa. Tras la eliminación de la cuenta, sus datos se borran en 30 días.`,
      },
      {
        title: '5. Sus derechos',
        body: `De acuerdo con el RGPD, usted tiene los siguientes derechos:\n\n• **Acceso**: obtener una copia de sus datos\n• **Rectificación**: corregir datos inexactos\n• **Supresión**: eliminar su cuenta y datos\n• **Portabilidad**: recibir sus datos en un formato estructurado\n• **Oposición**: oponerse al tratamiento con fines de marketing\n\nPara ejercer estos derechos: **info@jobspeeder.online**`,
      },
      {
        title: '6. Seguridad',
        body: `Sus datos están cifrados en tránsito (TLS) y en reposo. El acceso se limita a los servicios estrictamente necesarios para el funcionamiento de la plataforma.`,
      },
      {
        title: '7. Contacto',
        body: `Para cualquier pregunta sobre la protección de sus datos: **info@jobspeeder.online**`,
      },
    ],
  },
}

function renderBody(text: string) {
  return text.split('\n').map((line, i) => {
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (line.startsWith('•')) {
      return <li key={i} className="text-white/60 text-sm leading-relaxed ml-4" dangerouslySetInnerHTML={{ __html: formatted.replace('• ', '') }} />
    }
    if (!line.trim()) return <br key={i} />
    return <p key={i} className="text-white/60 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}

export default function PrivacyPage() {
  const { lang } = useLanguage()
  const c = content[lang]

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
        ← {lang === 'fr' ? 'Retour' : lang === 'en' ? 'Back' : 'Volver'}
      </Link>

      <h1 className="text-3xl font-bold text-white mb-2">{c.title}</h1>
      <p className="text-white/30 text-sm mb-10">
        {lang === 'fr' ? 'Dernière mise à jour' : lang === 'en' ? 'Last updated' : 'Última actualización'} : {c.updated}
      </p>

      <div className="space-y-8">
        {c.sections.map((section) => (
          <div key={section.title} className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold text-white mb-4">{section.title}</h2>
            <div className="space-y-1.5">{renderBody(section.body)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
