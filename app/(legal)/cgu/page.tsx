'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    title: "Conditions Générales d'Utilisation",
    updated: '1 mars 2025',
    sections: [
      {
        title: '1. Objet',
        body: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme JobSpeeder (jobspeeder.vercel.app), service d'automatisation de candidatures propulsé par l'IA.\n\nEn créant un compte, vous acceptez pleinement et sans réserve ces CGU.`,
      },
      {
        title: '2. Description du service',
        body: `JobSpeeder est une plateforme qui permet à ses utilisateurs de :\n\n• Créer et optimiser leur CV grâce à l'intelligence artificielle\n• Définir leurs critères de recherche d'emploi\n• Automatiser l'envoi de candidatures via des outils tiers (n8n, Skyvern)\n• Suivre leurs candidatures et gérer leur pipeline de recherche`,
      },
      {
        title: '3. Inscription et compte',
        body: `L'accès au service requiert la création d'un compte. Vous vous engagez à :\n\n• Fournir des informations exactes et à jour\n• Maintenir la confidentialité de vos identifiants\n• Être responsable de toute activité effectuée sous votre compte\n• Avoir au moins 18 ans ou l'âge légal dans votre pays`,
      },
      {
        title: '4. Utilisation acceptable',
        body: `Vous vous interdisez de :\n\n• Utiliser le service à des fins illégales ou frauduleuses\n• Envoyer des candidatures mensongères ou trompeuses\n• Tenter de contourner les mesures de sécurité\n• Revendre ou exploiter commercialement le service sans autorisation\n• Spammer des recruteurs ou des entreprises`,
      },
      {
        title: '5. Propriété intellectuelle',
        body: `Le code source, le design, les algorithmes et le contenu de JobSpeeder sont la propriété exclusive de JobSpeeder. Toute reproduction sans autorisation est interdite.\n\nVos données (CV, profil, préférences) vous appartiennent. Vous accordez à JobSpeeder une licence limitée pour les traiter dans le cadre du service.`,
      },
      {
        title: '6. Responsabilité',
        body: `JobSpeeder est un outil d'assistance. Nous ne garantissons pas :\n\n• L'obtention d'un emploi\n• La réponse des recruteurs\n• La disponibilité continue du service (force majeure, maintenance)\n\nLa responsabilité de JobSpeeder est limitée au montant des sommes payées au cours des 3 derniers mois.`,
      },
      {
        title: '7. Résiliation',
        body: `Vous pouvez supprimer votre compte à tout moment depuis les paramètres. JobSpeeder se réserve le droit de suspendre ou résilier un compte en cas de violation des présentes CGU, sans préavis.`,
      },
      {
        title: '8. Modifications',
        body: `JobSpeeder peut modifier ces CGU à tout moment. Les utilisateurs seront informés par email. L'utilisation continue du service après notification vaut acceptation des nouvelles conditions.`,
      },
      {
        title: '9. Droit applicable',
        body: `Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux de Paris.\n\nContact : **info@jobspeeder.online**`,
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'March 1, 2025',
    sections: [
      {
        title: '1. Purpose',
        body: `These Terms of Service govern access to and use of the JobSpeeder platform (jobspeeder.vercel.app), an AI-powered job application automation service.\n\nBy creating an account, you fully and unconditionally accept these Terms.`,
      },
      {
        title: '2. Service Description',
        body: `JobSpeeder is a platform that allows users to:\n\n• Create and optimize their CV using artificial intelligence\n• Define their job search criteria\n• Automate job application submission via third-party tools (n8n, Skyvern)\n• Track their applications and manage their job search pipeline`,
      },
      {
        title: '3. Registration and Account',
        body: `Access to the service requires creating an account. You agree to:\n\n• Provide accurate and up-to-date information\n• Maintain the confidentiality of your credentials\n• Be responsible for all activities under your account\n• Be at least 18 years old or the legal age in your country`,
      },
      {
        title: '4. Acceptable Use',
        body: `You agree not to:\n\n• Use the service for illegal or fraudulent purposes\n• Submit false or misleading job applications\n• Attempt to bypass security measures\n• Resell or commercially exploit the service without authorization\n• Spam recruiters or companies`,
      },
      {
        title: '5. Intellectual Property',
        body: `The source code, design, algorithms and content of JobSpeeder are the exclusive property of JobSpeeder. Any reproduction without permission is prohibited.\n\nYour data (CV, profile, preferences) belongs to you. You grant JobSpeeder a limited license to process it as part of the service.`,
      },
      {
        title: '6. Liability',
        body: `JobSpeeder is an assistance tool. We do not guarantee:\n\n• Getting a job offer\n• Responses from recruiters\n• Continuous service availability (force majeure, maintenance)\n\nJobSpeeder's liability is limited to amounts paid in the last 3 months.`,
      },
      {
        title: '7. Termination',
        body: `You may delete your account at any time from settings. JobSpeeder reserves the right to suspend or terminate an account in case of violation of these Terms, without notice.`,
      },
      {
        title: '8. Changes',
        body: `JobSpeeder may modify these Terms at any time. Users will be notified by email. Continued use of the service after notification constitutes acceptance of the new terms.`,
      },
      {
        title: '9. Governing Law',
        body: `These Terms are governed by French law. Any dispute falls under the exclusive jurisdiction of the Paris courts.\n\nContact: **info@jobspeeder.online**`,
      },
    ],
  },
  es: {
    title: 'Términos de Servicio',
    updated: '1 de marzo de 2025',
    sections: [
      {
        title: '1. Objeto',
        body: `Los presentes Términos de Servicio regulan el acceso y uso de la plataforma JobSpeeder (jobspeeder.vercel.app), un servicio de automatización de candidaturas potenciado por IA.\n\nAl crear una cuenta, usted acepta plena e incondicionalmente estos Términos.`,
      },
      {
        title: '2. Descripción del servicio',
        body: `JobSpeeder es una plataforma que permite a sus usuarios:\n\n• Crear y optimizar su CV mediante inteligencia artificial\n• Definir sus criterios de búsqueda de empleo\n• Automatizar el envío de candidaturas mediante herramientas de terceros (n8n, Skyvern)\n• Realizar un seguimiento de sus candidaturas y gestionar su pipeline de búsqueda`,
      },
      {
        title: '3. Registro y cuenta',
        body: `El acceso al servicio requiere la creación de una cuenta. Usted se compromete a:\n\n• Proporcionar información exacta y actualizada\n• Mantener la confidencialidad de sus credenciales\n• Ser responsable de toda actividad realizada bajo su cuenta\n• Tener al menos 18 años o la edad legal en su país`,
      },
      {
        title: '4. Uso aceptable',
        body: `Usted se compromete a no:\n\n• Utilizar el servicio con fines ilegales o fraudulentos\n• Enviar candidaturas falsas o engañosas\n• Intentar eludir las medidas de seguridad\n• Revender o explotar comercialmente el servicio sin autorización\n• Enviar spam a reclutadores o empresas`,
      },
      {
        title: '5. Propiedad intelectual',
        body: `El código fuente, diseño, algoritmos y contenido de JobSpeeder son propiedad exclusiva de JobSpeeder. Cualquier reproducción sin autorización está prohibida.\n\nSus datos (CV, perfil, preferencias) le pertenecen. Usted otorga a JobSpeeder una licencia limitada para procesarlos en el marco del servicio.`,
      },
      {
        title: '6. Responsabilidad',
        body: `JobSpeeder es una herramienta de asistencia. No garantizamos:\n\n• La obtención de un empleo\n• La respuesta de los reclutadores\n• La disponibilidad continua del servicio (fuerza mayor, mantenimiento)\n\nLa responsabilidad de JobSpeeder se limita a los importes pagados en los últimos 3 meses.`,
      },
      {
        title: '7. Resolución',
        body: `Puede eliminar su cuenta en cualquier momento desde los ajustes. JobSpeeder se reserva el derecho de suspender o cancelar una cuenta en caso de incumplimiento de estos Términos, sin previo aviso.`,
      },
      {
        title: '8. Modificaciones',
        body: `JobSpeeder puede modificar estos Términos en cualquier momento. Los usuarios serán notificados por email. El uso continuado del servicio tras la notificación implica la aceptación de las nuevas condiciones.`,
      },
      {
        title: '9. Ley aplicable',
        body: `Estos Términos se rigen por la ley francesa. Cualquier disputa es competencia exclusiva de los tribunales de París.\n\nContacto: **info@jobspeeder.online**`,
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

export default function CGUPage() {
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
