'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'es'

const LanguageContext = createContext<{
  lang: Language
  setLang: (l: Language) => void
}>({ lang: 'fr', setLang: () => {} })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('js_lang') as Language | null
    if (stored && ['fr', 'en', 'es'].includes(stored)) setLangState(stored)
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
