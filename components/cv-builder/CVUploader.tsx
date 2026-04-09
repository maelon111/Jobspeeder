'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { ResumeData, EMPTY_RESUME } from '@/types/resume'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

// Normalise la réponse n8n → ResumeData valide
// n8n peut retourner un tableau, des champs snake_case, ou des items sans id
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function normalizeResumeData(raw: unknown): ResumeData {
  // n8n wraps responses in an array
  const obj = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown>
  if (!obj || typeof obj !== 'object') return EMPTY_RESUME

  const personal = (obj.personal ?? {}) as Record<string, unknown>
  const experiences = ((obj.experiences ?? obj.work_experience ?? []) as Record<string, unknown>[])
    .map(e => ({
      id: (e.id as string) || uid(),
      position: (e.position ?? e.title ?? e.poste ?? '') as string,
      company: (e.company ?? e.entreprise ?? '') as string,
      startDate: (e.startDate ?? e.start_date ?? e.date_debut ?? '') as string,
      endDate: (e.endDate ?? e.end_date ?? e.date_fin ?? '') as string,
      current: Boolean(e.current ?? e.en_cours ?? false),
      description: (e.description ?? e.missions ?? '') as string,
    }))

  const education = ((obj.education ?? obj.formations ?? []) as Record<string, unknown>[])
    .map(e => ({
      id: (e.id as string) || uid(),
      degree: (e.degree ?? e.diplome ?? e.titre ?? '') as string,
      institution: (e.institution ?? e.ecole ?? e.school ?? '') as string,
      year: (e.year ?? e.annee ?? e.date ?? '') as string,
      mention: (e.mention ?? '') as string,
    }))

  const SKILL_LEVELS = ['débutant', 'intermédiaire', 'expert'] as const
  const skills = ((obj.skills ?? obj.competences ?? []) as (Record<string, unknown> | string)[])
    .map(s => {
      if (typeof s === 'string') return { id: uid(), name: s, level: 'intermédiaire' as const }
      const level = (s.level ?? s.niveau ?? 'intermédiaire') as string
      return {
        id: (s.id as string) || uid(),
        name: (s.name ?? s.nom ?? '') as string,
        level: (SKILL_LEVELS.includes(level as typeof SKILL_LEVELS[number]) ? level : 'intermédiaire') as typeof SKILL_LEVELS[number],
      }
    })

  const LANG_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Natif'] as const
  const languages = ((obj.languages ?? obj.langues ?? []) as (Record<string, unknown> | string)[])
    .map(l => {
      if (typeof l === 'string') return { id: uid(), name: l, level: 'B2' as const }
      const level = (l.level ?? l.niveau ?? 'B2') as string
      return {
        id: (l.id as string) || uid(),
        name: (l.name ?? l.nom ?? '') as string,
        level: (LANG_LEVELS.includes(level as typeof LANG_LEVELS[number]) ? level : 'B2') as typeof LANG_LEVELS[number],
      }
    })

  const certifications = ((obj.certifications ?? []) as Record<string, unknown>[])
    .map(c => ({
      id: (c.id as string) || uid(),
      title: (c.title ?? c.titre ?? '') as string,
      organization: (c.organization ?? c.organisme ?? '') as string,
      date: (c.date ?? '') as string,
    }))

  return {
    personal: {
      name: (personal.name ?? personal.nom ?? '') as string,
      title: (personal.title ?? personal.titre ?? personal.poste ?? '') as string,
      email: (personal.email ?? '') as string,
      phone: (personal.phone ?? personal.telephone ?? '') as string,
      city: (personal.city ?? personal.ville ?? personal.location ?? '') as string,
      linkedin: (personal.linkedin ?? '') as string,
      github: (personal.github ?? '') as string,
      photo: (personal.photo ?? undefined) as string | undefined,
    },
    summary: (obj.summary ?? obj.resume ?? obj.profil ?? '') as string,
    experiences,
    education,
    skills,
    languages,
    certifications,
  }
}

const STEPS = [
  'Lecture du document...',
  'Extraction des informations...',
  'Structuration des données...',
]

interface CVUploaderProps {
  userId?: string
  onComplete: (data: ResumeData) => void
  onBack: () => void
}

export function CVUploader({ userId, onComplete, onBack }: CVUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Veuillez uploader un fichier PDF ou DOCX.')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentStep(0)

    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length - 1) return prev + 1
        clearInterval(stepInterval)
        return prev
      })
    }, 1800)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('user_id', userId ?? 'anonymous')

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 60000)

      const res = await fetch('/api/cv/import', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeout)
      clearInterval(stepInterval)

      if (!res.ok) throw new Error('Erreur serveur')

      const raw = await res.json()
      console.log('[CVUploader] RAW n8n response:', JSON.stringify(raw, null, 2))
      const data: ResumeData = normalizeResumeData(raw)
      console.log('[CVUploader] Normalized ResumeData:', JSON.stringify(data, null, 2))
      setCurrentStep(STEPS.length - 1)

      await new Promise(r => setTimeout(r, 600))
      onComplete(data)
    } catch (err: unknown) {
      clearInterval(stepInterval)
      setLoading(false)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Le service n\'a pas répondu en 60 secondes.')
      } else {
        setError('Impossible d\'analyser le fichier. Veuillez remplir le formulaire manuellement.')
      }
    }
  }, [userId, onComplete])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">Importer votre CV</h1>
        <p className="text-gray-400 mb-8">Formats acceptés : PDF, DOCX</p>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-10 text-center"
            >
              <div className="w-16 h-16 rounded-full border-4 border-violet-600/30 border-t-violet-600 animate-spin mx-auto mb-6" />
              <p className="text-white font-medium mb-6 text-lg">Analyse de votre CV en cours...</p>
              <div className="space-y-3">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= currentStep ? 1 : 0.3 }}
                    className="flex items-center gap-3 justify-center"
                  >
                    {i < currentStep ? (
                      <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                    ) : i === currentStep ? (
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-gray-600 shrink-0" />
                    )}
                    <span className={`text-sm ${i <= currentStep ? 'text-white' : 'text-gray-600'}`}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  dragging
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-[#333] hover:border-violet-500/60 hover:bg-[#1a1a1a]'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={onFileChange}
                />
                <Upload className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <p className="text-white font-medium text-lg mb-1">
                  Déposez votre CV ici
                </p>
                <p className="text-gray-500 text-sm">ou cliquez pour sélectionner un fichier</p>
                <div className="flex items-center gap-3 justify-center mt-6">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 text-xs">PDF · DOCX</span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-start gap-3 bg-red-900/20 border border-red-700/40 rounded-xl p-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm">{error}</p>
                    <button
                      onClick={onBack}
                      className="text-violet-400 hover:text-violet-300 text-sm mt-2 underline"
                    >
                      Remplir manuellement
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
