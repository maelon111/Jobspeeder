'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit3, CheckCircle2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

import { EntryChoice, SavedResume } from '@/components/cv-builder/EntryChoice'
import { CVUploader } from '@/components/cv-builder/CVUploader'
import { ResumeForm } from '@/components/cv-builder/ResumeForm'
import { ResumePreview } from '@/components/cv-builder/ResumePreview'
import { TemplateSelector } from '@/components/cv-builder/TemplateSelector'
import { TemplatePickerScreen } from '@/components/cv-builder/TemplatePickerScreen'
import { ExportButtons } from '@/components/cv-builder/ExportButtons'
import { ResumeData, TemplateType, EMPTY_RESUME } from '@/types/resume'

type Step = 'entry' | 'import' | 'template-select' | 'builder'
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
  const [roundedPhoto, setRoundedPhoto] = useState<boolean>(() => {
    const draft = readDraft()
    return draft?.roundedPhoto ?? true
  })
  const [photoSize, setPhotoSize] = useState<number>(() => {
    const draft = readDraft()
    return draft?.photoSize ?? 100
  })
  const [photoPositionX, setPhotoPositionX] = useState<number>(() => {
    const draft = readDraft()
    return draft?.photoPositionX ?? 50
  })
  const [photoContainerSize, setPhotoContainerSize] = useState<number>(() => {
    const draft = readDraft()
    return draft?.photoContainerSize ?? 100
  })
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit')
  const [resumeId, setResumeId] = useState<string | null>(() => {
    const draft = readDraft()
    return draft?.resumeId ?? null
  })
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
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

  // Load saved resumes when on entry step
  useEffect(() => {
    if (step !== 'entry') return
    fetch('/api/cv/list')
      .then(r => r.ok ? r.json() : { resumes: [] })
      .then(d => setSavedResumes(d.resumes ?? []))
      .catch(() => {})
  }, [step])

  // Clear fromAts flag after first load
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
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify({ data, template, primaryColor, resumeId, roundedPhoto, photoSize, photoPositionX, photoContainerSize }))
    }
  }, [data, template, primaryColor, resumeId, step, roundedPhoto, photoSize, photoPositionX, photoContainerSize])

  // Auto-save every 30s if logged in
  useEffect(() => {
    if (!isLoggedIn || step !== 'builder') return
    if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    autoSaveRef.current = setInterval(() => {
      handleSave(true)
    }, 30000)
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current) }
  }, [isLoggedIn, step, data, template, primaryColor, resumeId, roundedPhoto, photoSize, photoPositionX, photoContainerSize])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const TEMPLATE_PHOTO_DEFAULTS: Record<string, { containerSize: number; photoSize: number; positionX: number }> = {
    modern:   { containerSize: 180, photoSize: 100, positionX: 40 },
    minimal:  { containerSize: 180, photoSize: 100, positionX: 60 },
    dark:     { containerSize: 100, photoSize: 100, positionX: 30 },
    creative: { containerSize: 160, photoSize: 100, positionX: 60 },
    classic:  { containerSize: 140, photoSize: 100, positionX: 50 },
    'model-25': { containerSize: 100, photoSize: 100, positionX: 50 },
    'standard': { containerSize: 110, photoSize: 100, positionX: 50 },
    'standard-premium': { containerSize: 110, photoSize: 100, positionX: 50 },
  }

  const applyTemplateDefaults = useCallback((t: TemplateType) => {
    setTemplate(t)
    const d = TEMPLATE_PHOTO_DEFAULTS[t]
    if (d) {
      setPhotoContainerSize(d.containerSize)
      setPhotoSize(d.photoSize)
      setPhotoPositionX(d.positionX)
    }
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
          settings: { roundedPhoto, photoSize, photoPositionX, photoContainerSize },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      if (json.id && !resumeId) setResumeId(json.id)
      if (!silent) showToast('CV sauvegardé avec succès')
    } catch {
      if (!silent) showToast('Erreur lors de la sauvegarde', 'error')
    }
  }, [data, template, primaryColor, resumeId, roundedPhoto, photoSize, photoPositionX, photoContainerSize, showToast])

  const handleImportComplete = useCallback((imported: ResumeData) => {
    setData(imported)
    setStep('template-select')
    showToast('CV importé avec succès — choisissez maintenant votre template')
  }, [showToast])

  const handleLoginRequired = useCallback(() => {
    showToast('Connectez-vous pour sauvegarder votre CV', 'error')
  }, [showToast])

  const handleResumeEdit = useCallback(async (resume: SavedResume) => {
    try {
      const r = await fetch(`/api/cv/get?id=${resume.id}`)
      if (!r.ok) throw new Error()
      const json = await r.json()
      const { _settings, ...resumeData } = json.content
      setData(resumeData)
      setTemplate(resume.template)
      setPrimaryColor(resume.primary_color)
      setResumeId(resume.id)
      if (_settings) {
        if (_settings.roundedPhoto !== undefined) setRoundedPhoto(_settings.roundedPhoto)
        if (_settings.photoSize !== undefined) setPhotoSize(_settings.photoSize)
        if (_settings.photoPositionX !== undefined) setPhotoPositionX(_settings.photoPositionX)
        if (_settings.photoContainerSize !== undefined) setPhotoContainerSize(_settings.photoContainerSize)
      }
      setStep('builder')
    } catch {
      showToast('Erreur lors du chargement', 'error')
    }
  }, [showToast])

  const handleResumeDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/cv/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setSavedResumes(prev => prev.filter(r => r.id !== id))
      showToast('CV supprimé')
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    }
  }, [showToast])

  if (step === 'entry') {
    return (
      <>
        <EntryChoice
          onCreateFromScratch={() => { setData(EMPTY_RESUME); setResumeId(null); setStep('template-select') }}
          onImport={() => setStep('import')}
          savedResumes={savedResumes}
          onResumeEdit={handleResumeEdit}
          onResumeDelete={handleResumeDelete}
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

  if (step === 'template-select') {
    return (
      <>
        <TemplatePickerScreen
          onSelect={(selectedTemplate) => {
            applyTemplateDefaults(selectedTemplate)
            if (selectedTemplate === 'dark' || selectedTemplate === 'model-25') setPrimaryColor('#ff7613')
            setStep('builder')
          }}
          onBack={() => setStep('entry')}
        />
        <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
      </>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#1e1e1e] bg-[#111] shrink-0">
        <button
          onClick={() => setStep('entry')}
          className="text-gray-500 hover:text-white text-sm transition-colors shrink-0"
        >
          ← Retour
        </button>
        <span className="text-white font-semibold text-sm shrink-0 hidden sm:inline">CV Builder</span>
        <div className="w-px h-5 bg-[#333] shrink-0 hidden sm:block" />
        <ExportButtons
          data={data}
          template={template}
          primaryColor={primaryColor}
          photoSize={photoSize}
          photoPositionX={photoPositionX}
          photoContainerSize={photoContainerSize}
          isLoggedIn={isLoggedIn}
          resumeId={resumeId}
          onSave={() => handleSave(false)}
          onLoginRequired={handleLoginRequired}
        />
      </div>

      {/* Template selector */}
      <TemplateSelector
        template={template}
        primaryColor={primaryColor}
        photoUrl={data.personal.photo}
        roundedPhoto={roundedPhoto}
        photoPosition={50}
        onTemplateChange={applyTemplateDefaults}
        onColorChange={setPrimaryColor}
        onPhotoChange={(photo) => setData(d => ({ ...d, personal: { ...d.personal, photo: photo ?? undefined } }))}
        onRoundedPhotoChange={setRoundedPhoto}
        photoSize={photoSize}
        photoPositionX={photoPositionX}
        onPhotoSizeChange={setPhotoSize}
        onPhotoPositionXChange={setPhotoPositionX}
        photoContainerSize={photoContainerSize}
        onPhotoContainerSizeChange={setPhotoContainerSize}
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
        <div className={`
          flex-shrink-0 overflow-y-auto p-4
          md:w-[360px] md:border-r md:border-[#1e1e1e] md:block
          ${mobileTab === 'edit' ? 'block w-full' : 'hidden'}
        `}>
          <ResumeForm data={data} onChange={setData} />
        </div>

        <div className={`
          flex-1 overflow-hidden
          md:block
          ${mobileTab === 'preview' ? 'block' : 'hidden md:block'}
        `}>
          <ResumePreview data={data} template={template} primaryColor={primaryColor} roundedPhoto={roundedPhoto} photoPosition={50} photoSize={photoSize} photoPositionX={photoPositionX} photoContainerSize={photoContainerSize} />
        </div>
      </div>

      <AnimatePresence>{toast && <Toast message={toast.message} type={toast.type} />}</AnimatePresence>
    </div>
  )
}
