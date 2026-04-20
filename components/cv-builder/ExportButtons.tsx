'use client'
import { useState } from 'react'
import { Download, Save, Loader2, Package, Link2, Check } from 'lucide-react'
import { ResumeData, TemplateType } from '@/types/resume'

function buildFilename(data: ResumeData, ext: string): string {
  const slugify = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
  const date = new Date().toISOString().slice(0, 10)
  const parts = [
    'CV',
    data.personal.name && slugify(data.personal.name),
    data.personal.title && slugify(data.personal.title),
    date,
  ].filter(Boolean)
  return `${parts.join('_')}.${ext}`
}

interface ExportButtonsProps {
  data: ResumeData
  template: TemplateType
  primaryColor: string
  photoSize: number
  photoPositionX: number
  photoContainerSize: number
  isLoggedIn: boolean
  resumeId: string | null
  onSave: () => Promise<void>
  onLoginRequired: () => void
}

export function ExportButtons({ data, template, primaryColor, photoSize, photoPositionX, photoContainerSize, isLoggedIn, resumeId, onSave, onLoginRequired }: ExportButtonsProps) {
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingPack, setLoadingPack] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [copied, setCopied] = useState(false)

  const validate = () => {
    if (!data.personal.name || !data.personal.email) {
      alert('Veuillez remplir au minimum votre nom et votre email avant d\'exporter.')
      return false
    }
    return true
  }

  const downloadPdf = async () => {
    if (!validate()) return
    setLoadingPdf(true)
    try {
      const res = await fetch('/api/cv/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, template, primaryColor, photoSize, photoPositionX, photoContainerSize }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = buildFilename(data, 'pdf')
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de la génération du PDF.')
    } finally {
      setLoadingPdf(false)
    }
  }

  const downloadPack = async () => {
    if (!validate()) return
    setLoadingPack(true)
    try {
      const res = await fetch('/api/cv/export-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, photoSize, photoPositionX }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const nameSlug = data.personal.name
        ? data.personal.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_')
        : 'CV'
      a.download = `Pack_CV_${nameSlug}_${new Date().toISOString().slice(0, 10)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de la génération du pack.')
    } finally {
      setLoadingPack(false)
    }
  }

  const handleSave = async () => {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }
    setLoadingSave(true)
    try {
      await onSave()
    } finally {
      setLoadingSave(false)
    }
  }

  const handleCopyLink = async () => {
    if (!resumeId) {
      alert('Sauvegardez d\'abord votre CV pour obtenir un lien partageable.')
      return
    }
    const link = `${window.location.origin}/cv/${resumeId}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      prompt('Copiez ce lien :', link)
    }
  }

  const btnBase = 'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={downloadPdf}
        disabled={loadingPdf}
        className={`${btnBase} bg-violet-600 hover:bg-violet-500 text-white`}
      >
        {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span className="hidden sm:inline">Télécharger CV</span>
      </button>

      <button
        onClick={downloadPack}
        disabled={loadingPack}
        title="5 CVs : 2 templates Moderne (violet, bleu) + Minimaliste (vert) + Créatif (orange) + Dark (orange)"
        className={`${btnBase} bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white`}
      >
        {loadingPack ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
        <span className="hidden sm:inline">{loadingPack ? 'Génération…' : 'Pack 5 CV'}</span>
      </button>

      <button
        onClick={handleSave}
        disabled={loadingSave}
        className={`${btnBase} bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white`}
      >
        {loadingSave ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        <span className="hidden sm:inline">Sauvegarder</span>
      </button>

      <button
        onClick={handleCopyLink}
        title={resumeId ? 'Copier le lien de partage' : 'Sauvegardez d\'abord votre CV'}
        className={`${btnBase} border transition-colors ${
          copied
            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
            : resumeId
              ? 'bg-[#1a1a1a] hover:bg-[#222] border-[#333] text-gray-300 hover:text-white'
              : 'bg-[#111] border-[#222] text-gray-600 cursor-not-allowed'
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? 'Copié !' : 'Partager'}</span>
      </button>
    </div>
  )
}
