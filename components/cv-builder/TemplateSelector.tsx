'use client'
import { useRef } from 'react'
import { Wand2, Circle, Square, ImagePlus, X, AlignCenter } from 'lucide-react'
import { TemplateType, PRESET_COLORS } from '@/types/resume'

interface TemplateSelectorProps {
  template: TemplateType
  primaryColor: string
  photoUrl?: string
  roundedPhoto: boolean
  photoPosition: number
  onTemplateChange: (t: TemplateType) => void
  onColorChange: (c: string) => void
  onPhotoChange: (photo: string | undefined) => void
  onRoundedPhotoChange: (rounded: boolean) => void
  onPhotoPositionChange: (pos: number) => void
}

const TEMPLATES: { id: TemplateType; label: string; preview: React.ReactNode }[] = [
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
  onTemplateChange,
  onColorChange,
  onPhotoChange,
  onRoundedPhotoChange,
  onPhotoPositionChange,
}: TemplateSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

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

      {/* Colors + Magic */}
      <div className="flex items-center gap-1.5">
        {PRESET_COLORS.map(c => (
          <button
            key={c.value}
            onClick={() => onColorChange(c.value)}
            title={c.label}
            className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
              primaryColor === c.value ? 'border-white scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: c.value }}
          />
        ))}
        <button
          onClick={handleMagic}
          title="Combinaison aléatoire"
          className="ml-1 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow shadow-violet-900/40"
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

            {/* Vertical position slider */}
            <div className="flex items-center gap-1.5" title="Cadrer la photo">
              <AlignCenter className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min={0}
                max={100}
                value={photoPosition}
                onChange={e => onPhotoPositionChange(Number(e.target.value))}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
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
