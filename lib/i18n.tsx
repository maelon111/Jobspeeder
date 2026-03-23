'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'es' | 'it' | 'de' | 'nl'

const SUPPORTED: Language[] = ['fr', 'en', 'es', 'it', 'de', 'nl']

function detectBrowserLang(): Language {
  if (typeof navigator === 'undefined') return 'fr'
  const raw = navigator.language.split('-')[0].toLowerCase()
  if (SUPPORTED.includes(raw as Language)) return raw as Language
  return 'fr'
}

const LanguageContext = createContext<{
  lang: Language
  setLang: (l: Language) => void
}>({ lang: 'fr', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('js_lang') as Language | null
    if (stored && SUPPORTED.includes(stored)) {
      setLangState(stored)
      document.documentElement.lang = stored
    } else {
      const detected = detectBrowserLang()
      setLangState(detected)
      document.documentElement.lang = detected
    }
  }, [])

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem('js_lang', l)
    document.documentElement.lang = l
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
