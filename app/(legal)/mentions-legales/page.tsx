'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    title: 'Mentions Légales',
    updated: '1 mars 2025',
    sections: [
      {
        title: '1. Éditeur du site',
        body: `**JobSpeeder**\nSite web : https://jobspeeder.online\nEmail : info@jobspeeder.online\n\nDirecteur de la publication : JobSpeeder`,
      },
      {
        title: '2. Hébergement',
        body: `Le site JobSpeeder est hébergé par :\n\n**Vercel Inc.**\n340 Pine Street, Suite 700\nSan Francisco, CA 94104, États-Unis\nSite : https://vercel.com`,
      },
      {
        title: '3. Propriété intellectuelle',
        body: `L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, sons, logiciels, etc.) est la propriété exclusive de JobSpeeder, sauf mention contraire.\n\nToute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit de JobSpeeder.`,
      },
      {
        title: '4. Données personnelles',
        body: `Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.\n\nPour exercer ces droits, contactez-nous à : **info@jobspeeder.online**\n\nPour plus d'informations, consultez notre Politique de Confidentialité.`,
      },
      {
        title: '5. Cookies',
        body: `Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques d'audience.\n\nPour en savoir plus, consultez notre Politique de Cookies.`,
      },
      {
        title: '6. Liens hypertextes',
        body: `Le site JobSpeeder peut contenir des liens vers d'autres sites internet. JobSpeeder n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de confidentialité.`,
      },
      {
        title: '7. Limitation de responsabilité',
        body: `JobSpeeder s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, JobSpeeder ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.\n\nEn conséquence, JobSpeeder décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.`,
      },
      {
        title: '8. Droit applicable',
        body: `Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.\n\nContact : **info@jobspeeder.online**`,
      },
    ],
  },
  en: {
    title: 'Legal Notice',
    updated: 'March 1, 2025',
    sections: [
      {
        title: '1. Website Publisher',
        body: `**JobSpeeder**\nWebsite: https://jobspeeder.online\nEmail: info@jobspeeder.online\n\nPublication Director: JobSpeeder`,
      },
      {
        title: '2. Hosting',
        body: `The JobSpeeder website is hosted by:\n\n**Vercel Inc.**\n340 Pine Street, Suite 700\nSan Francisco, CA 94104, United States\nWebsite: https://vercel.com`,
      },
      {
        title: '3. Intellectual Property',
        body: `All content on this site (texts, images, videos, logos, icons, sounds, software, etc.) is the exclusive property of JobSpeeder, unless otherwise stated.\n\nAny reproduction, distribution, modification, adaptation, retransmission or publication of these elements is strictly prohibited without the express written consent of JobSpeeder.`,
      },
      {
        title: '4. Personal Data',
        body: `In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, delete and port your data.\n\nTo exercise these rights, contact us at: **info@jobspeeder.online**\n\nFor more information, please see our Privacy Policy.`,
      },
      {
        title: '5. Cookies',
        body: `This site uses cookies to improve user experience and compile audience statistics.\n\nFor more information, see our Cookie Policy.`,
      },
      {
        title: '6. Hyperlinks',
        body: `The JobSpeeder website may contain links to other websites. JobSpeeder has no control over these sites and accepts no responsibility for their content or privacy practices.`,
      },
      {
        title: '7. Limitation of Liability',
        body: `JobSpeeder strives to ensure the accuracy and currency of the information published on this site. However, JobSpeeder cannot guarantee the accuracy, precision or completeness of the information made available.\n\nAccordingly, JobSpeeder disclaims all liability for any inaccuracy or omission relating to information available on this site.`,
      },
      {
        title: '8. Governing Law',
        body: `These legal notices are governed by French law. In the event of a dispute, French courts shall have sole jurisdiction.\n\nContact: **info@jobspeeder.online**`,
      },
    ],
  },
  es: {
    title: 'Aviso Legal',
    updated: '1 de marzo de 2025',
    sections: [
      {
        title: '1. Editor del sitio',
        body: `**JobSpeeder**\nSitio web: https://jobspeeder.online\nEmail: info@jobspeeder.online\n\nDirector de publicación: JobSpeeder`,
      },
      {
        title: '2. Alojamiento',
        body: `El sitio web de JobSpeeder está alojado por:\n\n**Vercel Inc.**\n340 Pine Street, Suite 700\nSan Francisco, CA 94104, Estados Unidos\nSitio web: https://vercel.com`,
      },
      {
        title: '3. Propiedad intelectual',
        body: `Todo el contenido de este sitio (textos, imágenes, vídeos, logotipos, iconos, sonidos, software, etc.) es propiedad exclusiva de JobSpeeder, salvo indicación contraria.\n\nQueda estrictamente prohibida cualquier reproducción, distribución, modificación, adaptación, retransmisión o publicación de estos elementos sin el consentimiento expreso por escrito de JobSpeeder.`,
      },
      {
        title: '4. Datos personales',
        body: `De conformidad con el Reglamento General de Protección de Datos (RGPD), usted tiene derecho a acceder, rectificar, suprimir y portar sus datos.\n\nPara ejercer estos derechos, contáctenos en: **info@jobspeeder.online**\n\nPara más información, consulte nuestra Política de Privacidad.`,
      },
      {
        title: '5. Cookies',
        body: `Este sitio utiliza cookies para mejorar la experiencia del usuario y elaborar estadísticas de audiencia.\n\nPara más información, consulte nuestra Política de Cookies.`,
      },
      {
        title: '6. Hipervínculos',
        body: `El sitio web de JobSpeeder puede contener enlaces a otros sitios web. JobSpeeder no tiene ningún control sobre estos sitios y no acepta ninguna responsabilidad por su contenido o prácticas de privacidad.`,
      },
      {
        title: '7. Limitación de responsabilidad',
        body: `JobSpeeder se esfuerza por garantizar la exactitud y actualización de la información publicada en este sitio. Sin embargo, JobSpeeder no puede garantizar la exactitud, precisión o integridad de la información disponible.\n\nEn consecuencia, JobSpeeder declina toda responsabilidad por cualquier inexactitud u omisión relativa a la información disponible en este sitio.`,
      },
      {
        title: '8. Ley aplicable',
        body: `Este aviso legal se rige por la legislación francesa. En caso de litigio, los tribunales franceses tendrán jurisdicción exclusiva.\n\nContacto: **info@jobspeeder.online**`,
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

export default function MentionsLegalesPage() {
  const { lang } = useLanguage()
  const c = content[lang as keyof typeof content] ?? content.fr

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
