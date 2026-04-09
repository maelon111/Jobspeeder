'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Briefcase, GraduationCap, Star, Languages, BadgeCheck,
  Plus, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react'
import {
  ResumeData, WorkExperience, Education, Skill, Language, Certification,
} from '@/types/resume'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1a1a1a] hover:bg-[#222] transition-colors"
      >
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="text-violet-400">{icon}</span>
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-[#111]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors'
const labelClass = 'block text-xs text-gray-400 mb-1'

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const set = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    onChange({ ...data, [key]: value })

  const setPersonal = (field: keyof ResumeData['personal'], value: string) =>
    set('personal', { ...data.personal, [field]: value })

  // Experiences
  const addExp = () =>
    set('experiences', [...data.experiences, {
      id: uid(), position: '', company: '', startDate: '', endDate: '', current: false, description: '',
    }])

  const updateExp = (id: string, field: keyof WorkExperience, value: string | boolean) =>
    set('experiences', data.experiences.map(e => e.id === id ? { ...e, [field]: value } : e))

  const removeExp = (id: string) =>
    set('experiences', data.experiences.filter(e => e.id !== id))

  // Education
  const addEdu = () =>
    set('education', [...data.education, { id: uid(), degree: '', institution: '', year: '', mention: '' }])

  const updateEdu = (id: string, field: keyof Education, value: string) =>
    set('education', data.education.map(e => e.id === id ? { ...e, [field]: value } : e))

  const removeEdu = (id: string) =>
    set('education', data.education.filter(e => e.id !== id))

  // Skills
  const addSkill = () =>
    set('skills', [...data.skills, { id: uid(), name: '', level: 'intermédiaire' }])

  const updateSkill = (id: string, field: keyof Skill, value: string) =>
    set('skills', data.skills.map(s => s.id === id ? { ...s, [field]: value } : s))

  const removeSkill = (id: string) =>
    set('skills', data.skills.filter(s => s.id !== id))

  // Languages
  const addLang = () =>
    set('languages', [...data.languages, { id: uid(), name: '', level: 'B2' }])

  const updateLang = (id: string, field: keyof Language, value: string) =>
    set('languages', data.languages.map(l => l.id === id ? { ...l, [field]: value } : l))

  const removeLang = (id: string) =>
    set('languages', data.languages.filter(l => l.id !== id))

  // Certifications
  const addCert = () =>
    set('certifications', [...data.certifications, { id: uid(), title: '', organization: '', date: '' }])

  const updateCert = (id: string, field: keyof Certification, value: string) =>
    set('certifications', data.certifications.map(c => c.id === id ? { ...c, [field]: value } : c))

  const removeCert = (id: string) =>
    set('certifications', data.certifications.filter(c => c.id !== id))

  return (
    <div className="space-y-3 pb-24">
      {/* Infos personnelles */}
      <Section title="Informations personnelles" icon={<User className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelClass}>Nom complet *</label>
            <input className={inputClass} placeholder="Jean Dupont" value={data.personal.name} onChange={e => setPersonal('name', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Titre / Poste *</label>
            <input className={inputClass} placeholder="Développeur Full Stack" value={data.personal.title} onChange={e => setPersonal('title', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input className={inputClass} type="email" placeholder="jean@email.com" value={data.personal.email} onChange={e => setPersonal('email', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input className={inputClass} placeholder="+33 6 12 34 56 78" value={data.personal.phone} onChange={e => setPersonal('phone', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Ville</label>
            <input className={inputClass} placeholder="Paris" value={data.personal.city} onChange={e => setPersonal('city', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input className={inputClass} placeholder="linkedin.com/in/jean" value={data.personal.linkedin} onChange={e => setPersonal('linkedin', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>GitHub</label>
            <input className={inputClass} placeholder="github.com/jean" value={data.personal.github} onChange={e => setPersonal('github', e.target.value)} />
          </div>
        </div>
      </Section>

      {/* Résumé */}
      <Section title="Résumé professionnel" icon={<User className="w-4 h-4" />} defaultOpen={false}>
        <textarea
          className={`${inputClass} resize-none`}
          rows={5}
          placeholder="Développeur passionné avec 5 ans d'expérience en React et Node.js..."
          value={data.summary}
          onChange={e => set('summary', e.target.value)}
        />
      </Section>

      {/* Expériences */}
      <Section title={`Expériences (${data.experiences.length})`} icon={<Briefcase className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-4">
          {data.experiences.map((exp, i) => (
            <div key={exp.id} className="border border-[#2a2a2a] rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Expérience {i + 1}</span>
                <button onClick={() => removeExp(exp.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={labelClass}>Poste *</label>
                  <input className={inputClass} placeholder="Développeur Frontend" value={exp.position} onChange={e => updateExp(exp.id, 'position', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Entreprise *</label>
                  <input className={inputClass} placeholder="Google" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Date début</label>
                  <input className={inputClass} placeholder="Jan 2022" value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Date fin</label>
                  <input
                    className={inputClass}
                    placeholder={exp.current ? 'Présent' : 'Jan 2024'}
                    value={exp.current ? 'Présent' : exp.endDate}
                    disabled={exp.current}
                    onChange={e => updateExp(exp.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => updateExp(exp.id, 'current', e.target.checked)}
                  className="w-3.5 h-3.5 accent-violet-500"
                />
                <span className="text-gray-400 text-xs">Poste actuel</span>
              </label>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="• Développement de nouvelles fonctionnalités&#10;• Optimisation des performances"
                  value={exp.description}
                  onChange={e => updateExp(exp.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button
            onClick={addExp}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#333] rounded-lg text-gray-500 hover:text-violet-400 hover:border-violet-500 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter une expérience
          </button>
        </div>
      </Section>

      {/* Formations */}
      <Section title={`Formations (${data.education.length})`} icon={<GraduationCap className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-3">
          {data.education.map((edu, i) => (
            <div key={edu.id} className="border border-[#2a2a2a] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Formation {i + 1}</span>
                <button onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input className={inputClass} placeholder="Master Informatique" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
              <input className={inputClass} placeholder="Université Paris-Saclay" value={edu.institution} onChange={e => updateEdu(edu.id, 'institution', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} placeholder="2022" value={edu.year} onChange={e => updateEdu(edu.id, 'year', e.target.value)} />
                <input className={inputClass} placeholder="Mention TB" value={edu.mention} onChange={e => updateEdu(edu.id, 'mention', e.target.value)} />
              </div>
            </div>
          ))}
          <button
            onClick={addEdu}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#333] rounded-lg text-gray-500 hover:text-violet-400 hover:border-violet-500 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter une formation
          </button>
        </div>
      </Section>

      {/* Compétences */}
      <Section title={`Compétences (${data.skills.length})`} icon={<Star className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-2">
          {data.skills.map(skill => (
            <div key={skill.id} className="flex items-center gap-2">
              <input
                className={`${inputClass} flex-1`}
                placeholder="React, Node.js..."
                value={skill.name}
                onChange={e => updateSkill(skill.id, 'name', e.target.value)}
              />
              <select
                className={`${inputClass} w-36`}
                value={skill.level}
                onChange={e => updateSkill(skill.id, 'level', e.target.value)}
              >
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="expert">Expert</option>
              </select>
              <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-300 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addSkill}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#333] rounded-lg text-gray-500 hover:text-violet-400 hover:border-violet-500 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter une compétence
          </button>
        </div>
      </Section>

      {/* Langues */}
      <Section title={`Langues (${data.languages.length})`} icon={<Languages className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-2">
          {data.languages.map(lang => (
            <div key={lang.id} className="flex items-center gap-2">
              <input
                className={`${inputClass} flex-1`}
                placeholder="Français, Anglais..."
                value={lang.name}
                onChange={e => updateLang(lang.id, 'name', e.target.value)}
              />
              <select
                className={`${inputClass} w-24`}
                value={lang.level}
                onChange={e => updateLang(lang.id, 'level', e.target.value)}
              >
                {['A1','A2','B1','B2','C1','C2','Natif'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button onClick={() => removeLang(lang.id)} className="text-red-400 hover:text-red-300 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addLang}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#333] rounded-lg text-gray-500 hover:text-violet-400 hover:border-violet-500 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter une langue
          </button>
        </div>
      </Section>

      {/* Certifications */}
      <Section title={`Certifications (${data.certifications.length})`} icon={<BadgeCheck className="w-4 h-4" />} defaultOpen={false}>
        <div className="space-y-3">
          {data.certifications.map((cert, i) => (
            <div key={cert.id} className="border border-[#2a2a2a] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">Certification {i + 1}</span>
                <button onClick={() => removeCert(cert.id)} className="text-red-400 hover:text-red-300 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input className={inputClass} placeholder="AWS Solutions Architect" value={cert.title} onChange={e => updateCert(cert.id, 'title', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputClass} placeholder="Amazon Web Services" value={cert.organization} onChange={e => updateCert(cert.id, 'organization', e.target.value)} />
                <input className={inputClass} placeholder="2023" value={cert.date} onChange={e => updateCert(cert.id, 'date', e.target.value)} />
              </div>
            </div>
          ))}
          <button
            onClick={addCert}
            className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-[#333] rounded-lg text-gray-500 hover:text-violet-400 hover:border-violet-500 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Ajouter une certification
          </button>
        </div>
      </Section>
    </div>
  )
}
