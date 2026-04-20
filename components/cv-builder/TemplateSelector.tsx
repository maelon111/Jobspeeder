'use client'
import { useRef, useState } from 'react'
import { Wand2, Circle, Square, ImagePlus, X, ZoomIn, ArrowLeftRight, Maximize2, ChevronDown, Palette } from 'lucide-react'
import { TemplateType, PRESET_COLORS } from '@/types/resume'

interface TemplateSelectorProps {
  template: TemplateType
  primaryColor: string
  photoUrl?: string
  roundedPhoto: boolean
  photoPosition: number
  photoSize: number
  photoPositionX: number
  onTemplateChange: (t: TemplateType) => void
  onColorChange: (c: string) => void
  onPhotoChange: (photo: string | undefined) => void
  onRoundedPhotoChange: (rounded: boolean) => void
  onPhotoSizeChange: (size: number) => void
  onPhotoPositionXChange: (pos: number) => void
  photoContainerSize: number
  onPhotoContainerSizeChange: (size: number) => void
}

export const TEMPLATES: { id: TemplateType; label: string; preview: React.ReactNode }[] = [
  {
    id: 'modern',
    label: 'Moderne',
    preview: (
      <div className="w-full h-full flex flex-col">
        <div className="h-5 bg-violet-600 rounded-t-sm" />
        <div className="flex flex-1 gap-1 p-1">
          <div className="flex-1 space-y-1">
            <div className="h-1.5 bg-gray-300 rounded w-3/4" />
            <div className="h-1 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="w-8 space-y-1">
            <div className="h-1 bg-gray-200 rounded" />
            <div className="h-1 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimaliste',
    preview: (
      <div className="w-full h-full flex flex-col p-1.5 gap-1">
        <div className="h-2 bg-black rounded w-2/3" />
        <div className="h-1 bg-gray-400 rounded w-1/2" />
        <div className="border-t border-gray-300 my-1" />
        <div className="space-y-0.5">
          <div className="h-1 bg-gray-300 rounded" />
          <div className="h-1 bg-gray-200 rounded w-4/5" />
          <div className="h-1 bg-gray-200 rounded w-3/5" />
        </div>
      </div>
    ),
  },
  {
    id: 'creative',
    label: 'Créatif',
    preview: (
      <div className="w-full h-full flex">
        <div className="w-8 bg-violet-600 rounded-l-sm" />
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-1.5 bg-gray-300 rounded w-3/4" />
          <div className="h-1 bg-gray-200 rounded w-1/2" />
          <div className="mt-1 space-y-0.5">
            <div className="h-1 bg-gray-200 rounded" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    label: 'Classique',
    preview: (
      <div className="w-full h-full bg-white" style={{ display: 'grid', gridTemplateColumns: '35% 60%', gap: '2px 5%', padding: '3px' }}>
        <div className="flex justify-end items-center">
          <div className="w-4 h-4 rounded-full bg-gray-300" />
        </div>
        <div className="border-l border-gray-800 pl-1 space-y-0.5">
          <div className="h-1.5 bg-gray-700 rounded w-10" />
          <div className="h-1 bg-gray-400 rounded w-6" />
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
            <div className="h-0.5 bg-gray-300 rounded flex-1" />
          </div>
          <div className="flex items-center gap-0.5">
            <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
            <div className="h-0.5 bg-gray-300 rounded flex-1" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-300 rounded" />
          <div className="h-0.5 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="border-l border-gray-800 pl-1 space-y-0.5">
          <div className="h-0.5 bg-gray-300 rounded w-full" />
          <div className="h-0.5 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    ),
  },
  {
    id: 'model-25',
    label: 'M25',
    preview: (
      <div className="w-full h-full flex flex-col bg-[#070707] rounded-sm p-1 gap-1">
        <div className="flex gap-1 items-start">
          <div className="w-4 h-4 rounded-full border flex-shrink-0" style={{ borderColor: '#ff7613' }} />
          <div className="space-y-0.5 flex-1">
            <div className="h-0.5 bg-gray-700 rounded w-1/2" />
            <div className="h-2 rounded w-3/4" style={{ background: '#ff7613' }} />
          </div>
        </div>
        <div className="border-t border-gray-800 my-0.5" />
        <div className="flex gap-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 rounded w-4" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-full" />
            <div className="h-1 bg-gray-700 rounded w-3/4" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 rounded w-4" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-full" />
            <div className="h-1 bg-gray-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'standard',
    label: 'Standard',
    preview: (
      <div className="w-full h-full flex rounded-sm overflow-hidden bg-white">
        {/* Left blue column */}
        <div className="w-6 flex-shrink-0 flex flex-col items-center pt-1.5 gap-1" style={{ background: '#4472C4' }}>
          <div className="w-4 h-4 rounded-full border border-white/60 bg-white/20" />
          <div className="h-0.5 bg-white/40 rounded w-5 mt-0.5" />
          <div className="h-0.5 bg-white/30 rounded w-4" />
          <div className="h-0.5 bg-white/30 rounded w-5 mt-1" />
          <div className="h-0.5 bg-white/30 rounded w-4" />
        </div>
        {/* Right content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-4 px-1 flex flex-col justify-center" style={{ background: '#bdc3cd' }}>
            <div className="h-1.5 bg-gray-700 rounded w-2/3" />
            <div className="h-0.5 mt-0.5 rounded w-1/2" style={{ background: '#4472C4' }} />
          </div>
          {/* Body */}
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-0.5 bg-gray-400 rounded w-full" />
            <div className="h-0.5 bg-gray-200 rounded w-4/5" />
            <div className="h-0.5 bg-gray-200 rounded w-3/5" />
            <div className="h-0.5 bg-gray-300 rounded w-full mt-1" />
            <div className="h-0.5 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'standard-premium',
    label: 'Standard Premium',
    preview: (
      <div className="w-full h-full flex rounded-sm overflow-hidden bg-white">
        {/* Left gradient column */}
        <div className="w-6 flex-shrink-0 flex flex-col items-center pt-2 gap-1.5" style={{ background: 'linear-gradient(175deg, #4472C4 0%, #2b4a8a 100%)' }}>
          {/* Photo with glow ring */}
          <div className="w-4 h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', padding: 1, boxShadow: '0 0 0 1.5px rgba(255,255,255,0.4)' }}>
            <div className="w-full h-full rounded-full bg-white/30" />
          </div>
          {/* SVG icon rows */}
          <div className="h-0.5 bg-white/55 rounded w-5" />
          <div className="h-0.5 bg-white/40 rounded w-4" />
          {/* Lang bars */}
          <div className="mt-1 w-4 space-y-1">
            <div className="h-1 rounded" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded" style={{ background: 'rgba(255,255,255,0.75)', width: '90%' }} />
            </div>
            <div className="h-1 rounded" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded" style={{ background: 'rgba(255,255,255,0.75)', width: '55%' }} />
            </div>
          </div>
          {/* Skill pills */}
          <div className="mt-0.5 w-full px-0.5 flex flex-wrap gap-0.5 justify-center">
            <div className="h-1 rounded-full" style={{ width: 14, background: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.35)' }} />
            <div className="h-1 rounded-full" style={{ width: 10, background: 'rgba(255,255,255,0.18)', border: '0.5px solid rgba(255,255,255,0.35)' }} />
          </div>
        </div>
        {/* Right content */}
        <div className="flex-1 flex flex-col">
          {/* Top accent stripe */}
          <div className="h-0.5" style={{ background: 'linear-gradient(to right, #4472C4, #2b4a8a)' }} />
          {/* Header gradient */}
          <div className="px-1.5 pt-1.5 pb-1" style={{ background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)' }}>
            <div className="h-2 bg-gray-900 rounded w-2/3" />
            {/* Colored accent bar under name */}
            <div className="mt-0.5 h-0.5 rounded w-6" style={{ background: '#4472C4' }} />
            <div className="h-1 mt-0.5 rounded w-1/2" style={{ background: '#4472C4', opacity: 0.85 }} />
            <div className="h-0.5 mt-1 bg-gray-300 rounded w-4/5" />
          </div>
          {/* Body with timeline */}
          <div className="flex-1 p-1 space-y-1">
            <div className="flex items-start gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#4472C4' }} />
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <div className="h-0.5 bg-gray-400 rounded w-3/5" />
                  <div className="h-1 rounded-full px-1 text-[4px]" style={{ background: 'rgba(68,114,196,0.1)', border: '0.5px solid rgba(68,114,196,0.3)', width: 12 }} />
                </div>
                <div className="h-0.5 bg-gray-200 rounded w-3/5" />
              </div>
            </div>
            <div className="flex items-start gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#4472C4' }} />
              <div className="flex-1 space-y-0.5">
                <div className="h-0.5 bg-gray-400 rounded w-3/4" />
                <div className="h-0.5 bg-gray-200 rounded w-2/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'standard-pro',
    label: 'Standard Pro',
    preview: (
      <div className="w-full h-full flex rounded-sm overflow-hidden bg-white">
        {/* Left gradient column */}
        <div className="w-6 flex-shrink-0 flex flex-col items-center pt-2 gap-1.5" style={{ background: 'linear-gradient(160deg, #4472C4 0%, #2b4a8a 100%)' }}>
          <div className="w-4 h-4 rounded-full border-2 border-white/40 bg-white/20" />
          {/* contact icon rows */}
          <div className="h-0.5 bg-white/50 rounded w-4" />
          <div className="h-0.5 bg-white/35 rounded w-5" />
          <div className="h-0.5 bg-white/35 rounded w-4" />
          {/* lang bars */}
          <div className="mt-1 w-4 space-y-0.5">
            <div className="h-0.5 rounded" style={{ background: 'rgba(255,255,255,0.7)', width: '90%' }} />
            <div className="h-0.5 rounded" style={{ background: 'rgba(255,255,255,0.7)', width: '55%' }} />
          </div>
          {/* skill pills */}
          <div className="mt-0.5 w-full px-0.5 flex flex-wrap gap-0.5 justify-center">
            <div className="h-1 rounded-full bg-white/20 border border-white/30" style={{ width: 14 }} />
            <div className="h-1 rounded-full bg-white/20 border border-white/30" style={{ width: 12 }} />
          </div>
        </div>
        {/* Right content */}
        <div className="flex-1 flex flex-col">
          {/* Top accent bar */}
          <div className="h-0.5" style={{ background: 'linear-gradient(to right, #4472C4, transparent)' }} />
          {/* Header gradient */}
          <div className="px-1.5 pt-1.5 pb-1" style={{ background: 'linear-gradient(145deg, #f8fafc 0%, #edf2f7 100%)' }}>
            <div className="h-2 bg-gray-800 rounded w-2/3 font-bold" />
            <div className="h-1 mt-0.5 rounded w-1/2" style={{ background: '#4472C4' }} />
            <div className="h-0.5 mt-0.5 bg-gray-300 rounded w-4/5" />
          </div>
          {/* Body with timeline dots */}
          <div className="flex-1 p-1 space-y-1">
            <div className="flex items-start gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#4472C4' }} />
              <div className="flex-1 space-y-0.5">
                <div className="h-0.5 bg-gray-400 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
            <div className="flex items-start gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: '#4472C4' }} />
              <div className="flex-1 space-y-0.5">
                <div className="h-0.5 bg-gray-400 rounded w-3/4" />
                <div className="h-0.5 bg-gray-200 rounded w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'dark',
    label: 'Dark',
    preview: (
      <div className="w-full h-full flex flex-col bg-[#070707] rounded-sm p-1.5 gap-1">
        <div className="flex gap-1 items-start">
          <div className="w-5 h-5 rounded-full bg-gray-700 flex-shrink-0" />
          <div className="space-y-0.5 flex-1">
            <div className="h-1 bg-gray-600 rounded w-1/2" />
            <div className="h-2 rounded w-3/4" style={{ background: '#ff7613' }} />
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 rounded w-full" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-4/5" />
            <div className="h-1 bg-gray-700 rounded w-3/5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-0.5 rounded w-full" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-4/5" />
            <div className="h-1 bg-gray-700 rounded w-3/5" />
          </div>
        </div>
      </div>
    ),
  },
]

export function TemplateSelector({
  template,
  primaryColor,
  photoUrl,
  roundedPhoto,
  photoPosition,
  photoSize,
  photoPositionX,
  onTemplateChange,
  onColorChange,
  onPhotoChange,
  onRoundedPhotoChange,
  onPhotoSizeChange,
  onPhotoPositionXChange,
  photoContainerSize,
  onPhotoContainerSizeChange,
}: TemplateSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [colorOpen, setColorOpen] = useState(false)

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => onPhotoChange(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function handleMagic() {
    const others = PRESET_COLORS.filter(c => c.value !== primaryColor)
    const pick = others[Math.floor(Math.random() * others.length)]
    onColorChange(pick.value)
    const templates: TemplateType[] = ['modern', 'minimal', 'creative']
    const otherTemplates = templates.filter(t => t !== template)
    onTemplateChange(otherTemplates[Math.floor(Math.random() * otherTemplates.length)])
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-2.5 px-4 bg-[#111] border-b border-[#222]">
      {/* Templates */}
      <div className="flex items-center gap-2">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onTemplateChange(t.id)}
            title={t.label}
            className={`relative w-16 h-12 rounded border-2 overflow-hidden transition-all bg-white ${
              template === t.id ? 'border-violet-500 shadow-lg shadow-violet-500/20' : 'border-[#333] hover:border-[#555]'
            }`}
          >
            {t.preview}
            {template === t.id && (
              <div className="absolute inset-0 ring-2 ring-violet-500 rounded pointer-events-none" />
            )}
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-[#333]" />

      {/* Colors dropdown + Magic */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setColorOpen(v => !v)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#333] hover:border-[#555] text-gray-300 hover:text-white text-xs transition-colors"
          >
            <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: primaryColor }} />
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{PRESET_COLORS.find(c => c.value === primaryColor)?.label ?? 'Couleur'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${colorOpen ? 'rotate-180' : ''}`} />
          </button>
          {colorOpen && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-[#1a1a1a] border border-[#333] rounded-xl z-50 shadow-xl">
              <div className="grid grid-cols-4 gap-1.5 w-[120px]">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { onColorChange(c.value); setColorOpen(false) }}
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
        <button
          onClick={handleMagic}
          title="Combinaison aléatoire"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow shadow-violet-900/40"
        >
          <Wand2 className="w-3 h-3" />
          Magic
        </button>
      </div>

      <div className="w-px h-8 bg-[#333]" />

      {/* Photo */}
      <div className="flex items-center gap-2">
        {photoUrl ? (
          <div className="relative group">
            <img
              src={photoUrl}
              alt="Photo"
              className="w-9 h-9 object-cover border-2 border-[#444]"
              style={{
                borderRadius: roundedPhoto ? '50%' : 4,
                objectPosition: `center ${photoPosition}%`,
                transform: `translateX(${(photoPositionX - 50) * 0.2}px) scale(${photoSize / 100})`,
                transformOrigin: 'center center',
              }}
            />
            <button
              onClick={() => onPhotoChange(undefined)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Ajouter une photo"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#333] hover:border-[#555] text-gray-400 hover:text-white text-xs transition-colors"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            Photo
          </button>
        )}

        {photoUrl && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Changer la photo"
              className="p-1.5 rounded-lg border border-[#333] hover:border-[#555] text-gray-400 hover:text-white transition-colors"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>

            {/* Rounded toggle */}
            <button
              onClick={() => onRoundedPhotoChange(!roundedPhoto)}
              title={roundedPhoto ? 'Passer en carré' : 'Passer en cercle'}
              className={`p-1.5 rounded-lg border transition-colors ${
                roundedPhoto
                  ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                  : 'border-[#333] text-gray-400 hover:border-[#555] hover:text-white'
              }`}
            >
              {roundedPhoto ? <Circle className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            </button>

            {/* Container size slider */}
            <div className="flex items-center gap-1.5" title="Taille de la photo et de son cadre">
              <Maximize2 className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min={50}
                max={200}
                value={photoContainerSize}
                onChange={e => onPhotoContainerSizeChange(Number(e.target.value))}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 w-7 text-right">{photoContainerSize}%</span>
            </div>

            {/* Zoom slider */}
            <div className="flex items-center gap-1.5" title="Zoom photo dans le cadre (sans changer la taille du cadre)">
              <ZoomIn className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min={100}
                max={200}
                value={photoSize}
                onChange={e => onPhotoSizeChange(Number(e.target.value))}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 w-7 text-right">{photoSize}%</span>
            </div>

            {/* Horizontal position slider */}
            <div className="flex items-center gap-1.5" title="Déplacer horizontalement">
              <ArrowLeftRight className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min={0}
                max={100}
                value={photoPositionX}
                onChange={e => onPhotoPositionXChange(Number(e.target.value))}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 w-7 text-right">{photoPositionX}%</span>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>
    </div>
  )
}
