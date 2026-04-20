'use client'
import { useState, useRef, useEffect } from 'react'
import { ResumePreview } from '@/components/cv-builder/ResumePreview'
import { TEMPLATES } from '@/components/cv-builder/TemplateSelector'
import { ResumeData, TemplateType, PRESET_COLORS } from '@/types/resume'
import Image from 'next/image'
import { Download, Loader2, ChevronDown, Palette, LayoutTemplate } from 'lucide-react'

interface ResumeRow {
  id: string
  title: string
  template: string
  primary_color: string
  content: ResumeData & { _settings?: { roundedPhoto?: boolean; photoSize?: number; photoPositionX?: number; photoContainerSize?: number } }
  updated_at: string
}

export function CVShareView({ resume }: { resume: ResumeRow }) {
  const settings = resume.content?._settings ?? {}
  const data: ResumeData = (() => {
    const { _settings, ...rest } = resume.content as ResumeRow['content']
    void _settings
    return rest as ResumeData
  })()

  const [primaryColor, setPrimaryColor] = useState(resume.primary_color)
  const [template, setTemplate] = useState<TemplateType>(resume.template as TemplateType)
  const [colorOpen, setColorOpen] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)

  const colorRef = useRef<HTMLDivElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false)
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) setTemplateOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const downloadPdf = async () => {
    setLoadingPdf(true)
    try {
      const res = await fetch('/api/cv/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          template,
          primaryColor,
          photoSize: settings.photoSize ?? 100,
          photoPositionX: settings.photoPositionX ?? 50,
          photoContainerSize: settings.photoContainerSize ?? 100,
        }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const slugify = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
      const date = new Date().toISOString().slice(0, 10)
      a.download = `CV_${data.personal.name ? slugify(data.personal.name) : 'CV'}_${date}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Erreur lors de la génération du PDF.')
    } finally {
      setLoadingPdf(false)
    }
  }

  const currentColorLabel = PRESET_COLORS.find(c => c.value === primaryColor)?.label ?? 'Couleur'
  const currentTemplate = TEMPLATES.find(t => t.id === template)

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1e1e1e] bg-[#111] shrink-0 flex-wrap">
        <a href="https://jobspeeder.online" className="flex items-center gap-2 mr-1">
          <Image src="/logo-v2.png" alt="JobSpeeder" width={22} height={22} className="rounded" />
          <span className="text-white text-sm font-semibold hidden sm:inline">JobSpeeder</span>
        </a>

        <div className="w-px h-5 bg-[#333] hidden sm:block" />

        {/* Template picker */}
        <div className="relative" ref={templateRef}>
          <button
            onClick={() => { setTemplateOpen(v => !v); setColorOpen(false) }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#333] hover:border-[#555] text-gray-300 hover:text-white text-xs transition-colors"
          >
            <LayoutTemplate className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{currentTemplate?.label ?? 'Template'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${templateOpen ? 'rotate-180' : ''}`} />
          </button>
          {templateOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-xl z-50 shadow-xl p-2">
              <div className="flex flex-wrap gap-2 w-[340px]">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTemplate(t.id); setTemplateOpen(false) }}
                    title={t.label}
                    className={`flex flex-col items-center gap-1 p-1 rounded-lg transition-all ${
                      template === t.id
                        ? 'ring-2 ring-violet-500 bg-violet-500/10'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-16 h-12 rounded border-2 overflow-hidden bg-white ${
                      template === t.id ? 'border-violet-500' : 'border-[#333]'
                    }`}>
                      {t.preview}
                    </div>
                    <span className="text-[10px] text-gray-400 leading-none">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color picker */}
        <div className="relative" ref={colorRef}>
          <button
            onClick={() => { setColorOpen(v => !v); setTemplateOpen(false) }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#333] hover:border-[#555] text-gray-300 hover:text-white text-xs transition-colors"
          >
            <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: primaryColor }} />
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentColorLabel}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${colorOpen ? 'rotate-180' : ''}`} />
          </button>
          {colorOpen && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-[#1a1a1a] border border-[#333] rounded-xl z-50 shadow-xl">
              <div className="grid grid-cols-4 gap-1.5 w-[120px]">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { setPrimaryColor(c.value); setColorOpen(false) }}
                    title={c.label}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      primaryColor === c.value ? 'border-white scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Download PDF */}
        <button
          onClick={downloadPdf}
          disabled={loadingPdf}
          className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
        >
          {loadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          <span>{loadingPdf ? 'Génération…' : 'Télécharger PDF'}</span>
        </button>

        <div className="ml-auto">
          <a
            href="/cv-builder"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
          >
            Créer mon CV
          </a>
        </div>
      </div>

      {/* CV preview */}
      <div className="flex-1 overflow-hidden">
        <ResumePreview
          data={data}
          template={template}
          primaryColor={primaryColor}
          roundedPhoto={settings.roundedPhoto ?? true}
          photoPosition={50}
          photoSize={settings.photoSize ?? 100}
          photoPositionX={settings.photoPositionX ?? 50}
          photoContainerSize={settings.photoContainerSize ?? 100}
        />
      </div>
    </div>
  )
}
