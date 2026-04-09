'use client'
import { motion } from 'framer-motion'
import { TemplateType } from '@/types/resume'

interface TemplatePickerScreenProps {
  onSelect: (template: TemplateType) => void
  onBack: () => void
}

const TEMPLATES: {
  id: TemplateType
  label: string
  description: string
  preview: React.ReactNode
}[] = [
  {
    id: 'modern',
    label: 'Moderne',
    description: 'En-tête colorée, deux colonnes, style classique professionnel.',
    preview: (
      <div className="w-full h-full flex flex-col bg-white rounded-sm overflow-hidden">
        <div className="h-8 bg-violet-600 flex items-center px-2 gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20" />
          <div className="flex-1 space-y-0.5">
            <div className="h-1.5 bg-white/80 rounded w-16" />
            <div className="h-1 bg-white/50 rounded w-10" />
          </div>
        </div>
        <div className="flex flex-1 gap-0">
          <div className="w-14 border-r border-gray-200 p-1.5 space-y-1.5">
            <div className="h-1 bg-violet-300 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
            <div className="h-1 bg-gray-200 rounded w-3/5" />
            <div className="h-1 bg-violet-300 rounded w-full mt-2" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="flex-1 p-1.5 space-y-1.5">
            <div className="h-1 bg-violet-300 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
            <div className="h-1 bg-gray-200 rounded w-3/5" />
            <div className="h-1 bg-gray-100 rounded w-4/5 mt-1" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    label: 'Minimaliste',
    description: 'Design épuré, typographie forte, idéal pour les profils créatifs.',
    preview: (
      <div className="w-full h-full flex flex-col bg-white rounded-sm p-2 gap-1.5">
        <div className="h-3 bg-black rounded w-2/3" />
        <div className="h-1.5 bg-gray-400 rounded w-1/2" />
        <div className="border-t-2 border-black my-1" />
        <div className="space-y-1">
          <div className="h-1 bg-gray-300 rounded w-full" />
          <div className="h-1 bg-gray-200 rounded w-4/5" />
          <div className="h-1 bg-gray-200 rounded w-3/5" />
        </div>
        <div className="flex gap-1 mt-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded w-3/4" />
            <div className="h-1 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="w-8 space-y-0.5">
            <div className="h-1 bg-gray-300 rounded" />
            <div className="h-1 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'creative',
    label: 'Créatif',
    description: 'Sidebar colorée, mise en page dynamique, impact visuel fort.',
    preview: (
      <div className="w-full h-full flex bg-white rounded-sm overflow-hidden">
        <div className="w-10 bg-violet-600 p-1 space-y-1.5 flex flex-col items-center pt-2">
          <div className="w-6 h-6 rounded-full bg-white/20" />
          <div className="h-1 bg-white/50 rounded w-full" />
          <div className="h-1 bg-white/50 rounded w-3/4" />
          <div className="h-1 bg-white/30 rounded w-full" />
          <div className="h-1 bg-white/30 rounded w-3/4" />
        </div>
        <div className="flex-1 p-1.5 space-y-1.5">
          <div className="h-2 bg-gray-300 rounded w-3/4" />
          <div className="h-1 bg-violet-300 rounded w-1/2" />
          <div className="space-y-0.5 mt-1">
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-4/5" />
            <div className="h-1 bg-gray-100 rounded w-3/5" />
          </div>
          <div className="space-y-0.5 mt-1">
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-3/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Fond sombre, accents orange vif, look moderne et percutant.',
    preview: (
      <div className="w-full h-full flex flex-col bg-[#070707] rounded-sm p-2 gap-2 overflow-hidden">
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 rounded-full bg-gray-700 flex-shrink-0" />
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-600 rounded w-8" />
            <div className="h-2.5 rounded w-14" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-600 rounded w-10 mt-0.5" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <div className="h-0.5 rounded w-full" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-4/5" />
            <div className="h-1 bg-gray-700 rounded w-3/5" />
            <div className="h-1 bg-gray-700 rounded w-4/5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-0.5 rounded w-full" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-4/5" />
            <div className="h-1 bg-gray-700 rounded w-3/5" />
            <div className="h-1 bg-gray-700 rounded w-full" />
          </div>
        </div>
        <div className="border-t border-gray-800 mt-auto pt-1 flex gap-3 justify-center">
          <div className="space-y-0.5">
            <div className="h-0.5 w-8 rounded" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-8" />
            <div className="h-1 bg-gray-700 rounded w-6" />
          </div>
          <div className="space-y-0.5">
            <div className="h-0.5 w-8 rounded" style={{ background: '#ff7613' }} />
            <div className="h-1 bg-gray-700 rounded w-8" />
          </div>
        </div>
      </div>
    ),
  },
]

export function TemplatePickerScreen({ onSelect, onBack }: TemplatePickerScreenProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-white text-sm transition-colors mb-6 inline-block"
        >
          ← Retour
        </button>
        <h1 className="text-4xl font-bold text-white mb-3">
          Choisissez votre <span className="text-violet-500">template</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Vous pourrez changer le template et les couleurs à tout moment dans le builder.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-4xl">
        {TEMPLATES.map((t, i) => (
          <motion.button
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => onSelect(t.id)}
            className="group flex flex-col gap-3 text-left"
          >
            <div className="relative w-full aspect-[3/4] rounded-xl border-2 border-[#2a2a2a] group-hover:border-violet-500 transition-all duration-300 overflow-hidden shadow-lg group-hover:shadow-violet-500/20 group-hover:shadow-xl">
              {t.preview}
              <div className="absolute inset-0 ring-2 ring-violet-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm group-hover:text-violet-400 transition-colors">{t.label}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{t.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
