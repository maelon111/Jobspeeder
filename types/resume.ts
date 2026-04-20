export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  city: string
  linkedin: string
  github: string
  photo?: string
}

export interface WorkExperience {
  id: string
  position: string
  company: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  year: string
  mention: string
}

export interface Skill {
  id: string
  name: string
  level: 'débutant' | 'intermédiaire' | 'expert'
}

export interface Language {
  id: string
  name: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif'
}

export interface Certification {
  id: string
  title: string
  organization: string
  date: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experiences: WorkExperience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
}

export type TemplateType = 'modern' | 'minimal' | 'dark' | 'classic' | 'creative' | 'model-25' | 'standard' | 'standard-pro' | 'standard-premium'

export const PRESET_COLORS = [
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Bleu', value: '#2563eb' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Émeraude', value: '#059669' },
  { label: 'Lime', value: '#65a30d' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Rouge', value: '#dc2626' },
  { label: 'Rose', value: '#db2777' },
  { label: 'Fuchsia', value: '#c026d3' },
  { label: 'Ardoise', value: '#475569' },
  { label: 'Nuit', value: '#1e3a5f' },
]

export const EMPTY_RESUME: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    city: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
}
