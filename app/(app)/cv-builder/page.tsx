'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit3, CheckCircle2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

import { EntryChoice } from '@/components/cv-builder/EntryChoice'
import { CVUploader } from '@/components/cv-builder/CVUploader'
import { ResumeForm } from '@/components/cv-builder/ResumeForm'
import { ResumePreview } from '@/components/cv-builder/ResumePreview'
import { TemplateSelector } from '@/components/cv-builder/TemplateSelector'
import { ExportButtons } from '@/components/cv-builder/ExportButtons'
import { ResumeData, TemplateType, EMPTY_RESUME } from '@/types/resume'

type Step = 'entry' | 'import' | 'builder'
type MobileTab = 'edit' | 'preview'

const LOCALSTORAGE_KEY = 'jobspeeder_cv_draft'

function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl z-50 text-sm font-medium ${
        type === 'success'
          ? 'bg-violet-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {message}
    </motion.div>
  )
}

// Read draft synchronously to avoid render/effect race conditions
function readDraft() {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export default function CVBuilderPage() {
  const [step, setStep] = useState<Step>(() => {
    const draft = readDraft()
    return draft?.fromAts ? 'builder' : 'entry'
  })
  const [data, setData] = useState<ResumeData>(() => {
    const draft = readDraft()
    return draft?.data ?? EMPTY_RESUME
  })
  const [template, setTemplate] = useState<TemplateType>(() => {
    const draft = readDraft()
    return draft?.template ?? 'modern'
  })
  const [primaryColor, setPrimaryColor] = useState<string>(() => {
    const draft = readDraft()
    return draft?.primaryColor ?? '#7c3aed'
  })
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit')
  const [resumeId, setResumeId] = useState<string | null>(() => {
    const draft = readDraft()
    return draft?.resumeId ?? null
  })
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
        setIsLoggedIn(true)
      }
    })
  }, [])

  // Clear fromAts flag after first load so next visit starts normally
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.fromAts) {
          localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ ...parsed, fromAts: false }))
        }
      }
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (step === 'builder') {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ data, template, primaryColor, resumeId }))
    }
  }, [data, template, primaryColor, resumeId, step])

  // Auto-save every 30s if logged in
  useEffect(() => {
    if (!isLoggedIn || step !== 'builder') return
    if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    autoSaveRef.current = setInterval(() => {
      handleSave(true)
    }, 30000)
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current) }
  }, [isLoggedIn, step, data, template, primaryColor, resumeId])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const handleSave = useCallback(async (silent = false) => {
    try {
      const res = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resumeId,
          title: `CV de ${data.personal.name || 'Nouveau'}`,
          template,
          primaryColor,
          content: data,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      if (json.id && !resumeId) setResumeId(json.id)
      if (!silent) showToast('CV sauvegardé avec succès')
    } catch {
      if (!silent) showToast('Erreur lors de la sauvegarde', 'error')
    }
  }, [data, template, primaryColor, resumeId, showToast])

  const handleImportComplete = useCallback((imported: ResumeData) => {
    setData(imported)
    setStep('builder')
    showToast('CV importé avec succès — vérifiez et complétez les informations')
  }, [showToast])

  const handleLoginRequired = useCallback(() => {
    showToast('Connectez-vous pour sauvegarder votre CV', 'error')
  }, [showToast])

  if (step === 'entry') {
    return (
      <>
        <EntryChoice
          onCreateFromScratch={() => { setData(EMPTY_RESUME); setStep('builder') }}
          onImport={() => setStep('import')}
        />
        <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
      </>
    )
  }

  if (step === 'import') {
    return (
      <>
        <CVUploader
          userId={userId}
          onComplete={handleImportComplete}
          onBack={() => setStep('entry')}
        />
        <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e] bg-[#111] shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep('entry')}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            ← Retour
          </button>
          <span className="text-white font-semibold text-sm">CV Builder</span>
        </div>
        <ExportButtons
          data={data}
          template={template}
          primaryColor={primaryColor}
          isLoggedIn={isLoggedIn}
          onSave={() => handleSave(false)}
          onLoginRequired={handleLoginRequired}
        />
      </div>

      {/* Template selector */}
      <TemplateSelector
        template={template}
        primaryColor={primaryColor}
        onTemplateChange={setTemplate}
        onColorChange={setPrimaryColor}
      />

      {/* Mobile tab switcher */}
      <div className="flex md:hidden border-b border-[#1e1e1e] bg-[#111] shrink-0">
        {(['edit', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
              mobileTab === tab
                ? 'text-violet-400 border-b-2 border-violet-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab === 'edit' ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {tab === 'edit' ? 'Édition' : 'Aperçu'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form panel (desktop: always visible, mobile: tab-controlled) */}
        <div className={`
          flex-shrink-0 overflow-y-auto p-4
          md:w-[40%] md:border-r md:border-[#1e1e1e] md:block
          ${mobileTab === 'edit' ? 'block w-full' : 'hidden'}
        `}>
          <ResumeForm data={data} onChange={setData} />
        </div>

        {/* Preview panel (desktop: always visible, mobile: tab-controlled) */}
        <div className={`
          flex-1 overflow-hidden
          md:block
          ${mobileTab === 'preview' ? 'block' : 'hidden md:block'}
        `}>
          <ResumePreview data={data} template={template} primaryColor={primaryColor} />
        </div>
      </div>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
    </div>
  )
}
