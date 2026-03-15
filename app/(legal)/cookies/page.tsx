'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

const content = {
  fr: {
    title: 'Politique de cookies',
    updated: '1 mars 2025',
    sections: [
      {
        title: "1. Qu'est-ce qu'un cookie ?",
        body: `Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur JobSpeeder. Il permet de mémoriser des informations pour améliorer votre expérience.`,
      },
      {
        title: '2. Cookies utilisés',
        body: `**Cookies essentiels (obligatoires)**\nCes cookies sont indispensables au fonctionnement du service :\n\n• **sb-session** : session d'authentification Supabase\n• **sb-auth-token** : token d'accès sécurisé\n\nCes cookies ne peuvent pas être désactivés.\n\n**Cookies de préférence**\n\n• **js_lang** : votre langue préférée (FR/EN/ES), stocké dans localStorage\n\n**Cookies analytiques**\nJobSpeeder n'utilise pas de cookies analytiques tiers (Google Analytics, etc.) à ce jour.`,
      },
      {
        title: '3. Durée de conservation',
        body: `• **Cookies de session** : supprimés à la fermeture du navigateur\n• **Token d'accès** : 1 heure (renouvelé automatiquement)\n• **Préférence de langue** : jusqu'à suppression manuelle`,
      },
      {
        title: '4. Gestion des cookies',
        body: `Vous pouvez contrôler les cookies via les paramètres de votre navigateur :\n\n• **Chrome** : Paramètres > Confidentialité > Cookies\n• **Firefox** : Paramètres > Vie privée > Cookies\n• **Safari** : Préférences > Confidentialité\n\nAttention : désactiver les cookies essentiels empêchera la connexion au service.`,
      },
      {
        title: '5. Contact',
        body: `Pour toute question sur les cookies : **info@jobspeeder.online**`,
      },
    ],
  },
  en: {
    title: 'Cookie Policy',
    updated: 'March 1, 2025',
    sections: [
      {
        title: '1. What is a cookie?',
        body: `A cookie is a small text file placed on your device when you visit JobSpeeder. It allows information to be stored to improve your experience.`,
      },
      {
        title: '2. Cookies Used',
        body: `**Essential cookies (required)**\nThese cookies are essential for the service to function:\n\n• **sb-session**: Supabase authentication session\n• **sb-auth-token**: secure access token\n\nThese cookies cannot be disabled.\n\n**Preference cookies**\n\n• **js_lang**: your preferred language (FR/EN/ES), stored in localStorage\n\n**Analytics cookies**\nJobSpeeder does not currently use third-party analytics cookies (Google Analytics, etc.).`,
      },
      {
        title: '3. Retention Period',
        body: `• **Session cookies**: deleted when the browser is closed\n• **Access token**: 1 hour (automatically renewed)\n• **Language preference**: until manually deleted`,
      },
      {
        title: '4. Cookie Management',
        body: `You can control cookies through your browser settings:\n\n• **Chrome**: Settings > Privacy > Cookies\n• **Firefox**: Settings > Privacy > Cookies\n• **Safari**: Preferences > Privacy\n\nNote: disabling essential cookies will prevent you from logging into the service.`,
      },
      {
        title: '5. Contact',
        body: `For any questions about cookies: **info@jobspeeder.online**`,
      },
    ],
  },
  es: {
    title: 'Política de cookies',
    updated: '1 de marzo de 2025',
    sections: [
      {
        title: '1. ¿Qué es una cookie?',
        body: `Una cookie es un pequeño archivo de texto que se deposita en su dispositivo cuando visita JobSpeeder. Permite almacenar información para mejorar su experiencia.`,
      },
      {
        title: '2. Cookies utilizadas',
        body: `**Cookies esenciales (obligatorias)**\nEstas cookies son imprescindibles para el funcionamiento del servicio:\n\n• **sb-session**: sesión de autenticación de Supabase\n• **sb-auth-token**: token de acceso seguro\n\nEstas cookies no pueden desactivarse.\n\n**Cookies de preferencia**\n\n• **js_lang**: su idioma preferido (FR/EN/ES), almacenado en localStorage\n\n**Cookies analíticas**\nJobSpeeder no utiliza actualmente cookies analíticas de terceros (Google Analytics, etc.).`,
      },
      {
        title: '3. Período de conservación',
        body: `• **Cookies de sesión**: eliminadas al cerrar el navegador\n• **Token de acceso**: 1 hora (renovado automáticamente)\n• **Preferencia de idioma**: hasta su eliminación manual`,
      },
      {
        title: '4. Gestión de cookies',
        body: `Puede controlar las cookies a través de la configuración de su navegador:\n\n• **Chrome**: Configuración > Privacidad > Cookies\n• **Firefox**: Configuración > Privacidad > Cookies\n• **Safari**: Preferencias > Privacidad\n\nAtención: deshabilitar las cookies esenciales impedirá el inicio de sesión en el servicio.`,
      },
      {
        title: '5. Contacto',
        body: `Para cualquier pregunta sobre cookies: **info@jobspeeder.online**`,
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

export default function CookiesPage() {
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
