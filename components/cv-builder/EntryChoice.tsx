'use client'
import { motion } from 'framer-motion'
import { FileText, Upload, Plus, Pencil, Trash2, Clock } from 'lucide-react'
import { TemplateType } from '@/types/resume'

export interface SavedResume {
  id: string
  title: string
  template: TemplateType
  primary_color: string
  updated_at: string
}

interface EntryChoiceProps {
  onCreateFromScratch: () => void
  onImport: () => void
  savedResumes: SavedResume[]
  onResumeEdit: (resume: SavedResume) => void
  onResumeDelete: (id: string) => void
}

const TEMPLATE_LABELS: Record<TemplateType, string> = {
  modern: 'Moderne',
  minimal: 'Minimaliste',
  dark: 'Dark',
  classic: 'Classique',
  creative: 'Créatif',
  'model-25': 'Model 25',
  standard: 'Standard',
  'standard-pro': 'Standard Pro',
  'standard-premium': 'Standard Premium',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `il y a ${mins || 1} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  const days = Math.floor(hours / 24)
  return `il y a ${days}j`
}

export function EntryChoice({ onCreateFromScratch, onImport, savedResumes, onResumeEdit, onResumeDelete }: EntryChoiceProps) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-white mb-3">
          Créer votre <span className="text-violet-500">CV</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Comment souhaitez-vous commencer ?
        </p>
      </motion.div>

      {/* Saved resumes */}
      {savedResumes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl mb-8"
        >
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Reprendre un CV existant
          </h2>
          <div className="space-y-2">
            {savedResumes.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                className="flex items-center gap-3 p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors group"
              >
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: r.primary_color }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">{TEMPLATE_LABELS[r.template]}</span>
                    <span className="text-gray-700">·</span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {timeAgo(r.updated_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onResumeEdit(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => onResumeDelete(r.id)}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: savedResumes.length > 0 ? 0.25 : 0.15 }}
          onClick={onCreateFromScratch}
          className="group relative flex flex-col items-center gap-5 p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl hover:border-violet-500 hover:bg-[#1e1a2e] transition-all duration-300 text-left"
        >
          <div className="w-16 h-16 rounded-xl bg-violet-600/20 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
            {savedResumes.length > 0
              ? <Plus className="w-8 h-8 text-violet-400" />
              : <FileText className="w-8 h-8 text-violet-400" />
            }
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {savedResumes.length > 0 ? 'Créer un nouveau CV' : 'Créer depuis zéro'}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Commencez avec un formulaire vide et construisez votre CV étape par étape.
            </p>
          </div>
          <div className="absolute inset-0 rounded-2xl ring-2 ring-violet-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: savedResumes.length > 0 ? 0.3 : 0.25 }}
          onClick={onImport}
          className="group relative flex flex-col items-center gap-5 p-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl hover:border-violet-500 hover:bg-[#1e1a2e] transition-all duration-300 text-left"
        >
          <div className="w-16 h-16 rounded-xl bg-violet-600/20 flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
            <Upload className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Importer mon CV existant</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Uploadez votre CV PDF ou Word. Notre IA extrait automatiquement vos informations.
            </p>
          </div>
          <div className="absolute inset-0 rounded-2xl ring-2 ring-violet-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>
      </div>
    </div>
  )
}
