'use client'
import { useState } from 'react'
import { Download, FileText, Save, Loader2 } from 'lucide-react'
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
  isLoggedIn: boolean
  onSave: () => Promise<void>
  onLoginRequired: () => void
}

export function ExportButtons({ data, template, primaryColor, isLoggedIn, onSave, onLoginRequired }: ExportButtonsProps) {
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingDocx, setLoadingDocx] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

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
        body: JSON.stringify({ data, template, primaryColor }),
      })
      if (!res.ok) throw new Error('Erreur génération PDF')
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

  const downloadDocx = async () => {
    if (!validate()) return
    setLoadingDocx(true)
    try {
      const res = await fetch('/api/cv/export-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, primaryColor, template }),
      })
      if (!res.ok) throw new Error('Erreur génération Word')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = buildFilename(data, 'docx')
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de la génération du fichier Word.')
    } finally {
      setLoadingDocx(false)
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

  const btnBase = 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={downloadPdf}
        disabled={loadingPdf}
        className={`${btnBase} bg-violet-600 hover:bg-violet-500 text-white`}
      >
        {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        PDF
      </button>
      <button
        onClick={downloadDocx}
        disabled={loadingDocx}
        className={`${btnBase} bg-[#1e4db0] hover:bg-[#1a44a3] text-white`}
      >
        {loadingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        Word
      </button>
      <button
        onClick={handleSave}
        disabled={loadingSave}
        className={`${btnBase} bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white`}
      >
        {loadingSave ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Sauvegarder
      </button>
    </div>
  )
}
