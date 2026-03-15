'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap,
  Star, ChevronDown, ChevronUp, RefreshCw, ExternalLink,
  FileText, Languages, Clock, BadgeCheck, Trash2
} from 'lucide-react'

const HIDDEN_KEY = 'jobspeeder_hidden_profiles'

function getHidden(): string[] {
  try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]') } catch { return [] }
}
function addHidden(id: string) {
  const list = getHidden()
  if (!list.includes(id)) localStorage.setItem(HIDDEN_KEY, JSON.stringify([...list, id]))
}

type WorkExperience = {
  title?: string
  company?: string
  location?: string
  start_date?: string
  end_date?: string
  current?: boolean
  duration_months?: number
  description?: string
}

type UserProfile = {
  profil_id: string | null
  job_titles_cibles: string | null
  date_mise_a_jour: string | null
  cv_url: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  cv_city: string | null
  cv_country: string | null
  nationality: string | null
  driving_license: string | null
  linkedin: string | null
  years_experience: string | number | null
  experience_summary: string | null
  key_skills: string[] | string | null
  languages: Record<string, string> | null
  work_experience_1: WorkExperience | null
  work_experience_2: WorkExperience | null
  work_experience_3: WorkExperience | null
  work_experience_4: WorkExperience | null
  highest_degree: string | null
  education_field: string | null
  school: string | null
  graduation_year: string | number | null
  education_history_1: unknown
  education_history_2: unknown
  poste: string | null
  localisation: string | null
  contrat: string | null
  salary_expectation: string | null
  availability: string | null
  work_authorization: string | null
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className="text-brand" />
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2.5 py-1 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand">
      {children}
    </span>
  )
}

export default function CVPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string>('')

  useEffect(() => {
    fetch('/api/user-profile')
      .then(r => r.json())
      .then(data => {
        const hidden = getHidden()
        const withKeys = (data.profiles || []).map((p: UserProfile, i: number) => ({
          ...p,
          _key: p.profil_id ?? p.email ?? String(i),
        }))
        const visible = withKeys.filter((p: UserProfile & { _key: string }) => !hidden.includes(p._key))
        setProfiles(visible)
        if (visible.length > 0) setExpandedId(visible[0]._key)
      })
      .finally(() => setLoading(false))
  }, [])

  function handleDelete(key: string) {
    if (!key) return
    setDeletingId(key)
    setTimeout(() => {
      addHidden(key)
      setProfiles(prev => prev.filter(p => (p as UserProfile & { _key: string })._key !== key))
      if (expandedId === key) setExpandedId(null)
      setDeletingId('')
    }, 300)
  }

  function getSkills(p: UserProfile): string[] {
    if (!p.key_skills) return []
    if (Array.isArray(p.key_skills)) return p.key_skills
    return []
  }

  function getExperiences(p: UserProfile): WorkExperience[] {
    return [p.work_experience_1, p.work_experience_2, p.work_experience_3, p.work_experience_4]
      .filter((e): e is WorkExperience => !!e && typeof e === 'object' && !!e.title)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mon profil CV</h1>
        <p className="text-white/40 mt-1">{profiles.length} profil{profiles.length !== 1 ? 's' : ''} enregistré{profiles.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/30">
          <RefreshCw size={20} className="animate-spin mr-2" />
          Chargement...
        </div>
      ) : profiles.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="p-5 bg-white/5 rounded-2xl inline-flex mb-4">
            <FileText size={36} className="text-white/20" />
          </div>
          <p className="text-white/30">Aucun profil trouvé dans le sheet USER_PROFILES</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {profiles.map((p, i) => {
              const key = (p as UserProfile & { _key: string })._key ?? String(i)
              const isExpanded = expandedId === key
              const skills = getSkills(p)
              const experiences = getExperiences(p)
              const fullName = [p.first_name, p.last_name].filter(Boolean).join(' ')

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  {/* Card header */}
                  <div className="p-5 flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-brand/10">
                      <User size={20} className="text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{fullName || p.profil_id || '—'}</div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {p.job_titles_cibles && <span>{p.job_titles_cibles}</span>}
                        {p.date_mise_a_jour && <span> · Mis à jour le {p.date_mise_a_jour}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {p.cv_url && (
                        <a
                          href={p.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors"
                        >
                          <FileText size={12} />
                          CV
                          <ExternalLink size={10} />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(key)}
                        disabled={!!deletingId && deletingId === key}
                        className="p-2 text-white/20 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
                        title="Supprimer ce profil"
                      >
                        {deletingId && deletingId === key
                          ? <RefreshCw size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : key)}
                        className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/8 overflow-hidden"
                      >
                        <div className="p-5 space-y-6">

                          {/* Infos personnelles */}
                          <Section title="Informations personnelles" icon={User}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {p.email && (
                                <div className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
                                  <Mail size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-white/70 truncate">{p.email}</span>
                                </div>
                              )}
                              {p.phone && (
                                <div className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
                                  <Phone size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-white/70">{p.phone}</span>
                                </div>
                              )}
                              {(p.cv_city || p.cv_country) && (
                                <div className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
                                  <MapPin size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-white/70">{[p.cv_city, p.cv_country].filter(Boolean).join(', ')}</span>
                                </div>
                              )}
                              {p.nationality && (
                                <div className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
                                  <Globe size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-white/70">{p.nationality}</span>
                                </div>
                              )}
                              {p.linkedin && (
                                <a
                                  href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                                >
                                  <ExternalLink size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-brand truncate">LinkedIn</span>
                                </a>
                              )}
                              {p.years_experience && (
                                <div className="flex items-center gap-2 p-3 bg-white/3 border border-white/5 rounded-xl">
                                  <Briefcase size={13} className="text-white/30 flex-shrink-0" />
                                  <span className="text-sm text-white/70">{p.years_experience} ans d&apos;exp.</span>
                                </div>
                              )}
                            </div>
                          </Section>

                          {/* Résumé */}
                          {p.experience_summary && (
                            <Section title="Résumé professionnel" icon={Star}>
                              <p className="text-sm text-white/70 leading-relaxed">{p.experience_summary}</p>
                            </Section>
                          )}

                          {/* Compétences */}
                          {skills.length > 0 && (
                            <Section title="Compétences clés" icon={BadgeCheck}>
                              <div className="flex flex-wrap gap-2">
                                {skills.map((s, j) => <Chip key={j}>{s}</Chip>)}
                              </div>
                            </Section>
                          )}

                          {/* Langues */}
                          {p.languages && typeof p.languages === 'object' && (
                            <Section title="Langues" icon={Languages}>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(p.languages).map(([lang, level]) => (
                                  <div key={lang} className="px-3 py-1.5 bg-white/5 border border-white/8 rounded-xl text-sm">
                                    <span className="font-medium text-white/80">{lang.toUpperCase()}</span>
                                    <span className="text-white/40 ml-2">{level}</span>
                                  </div>
                                ))}
                              </div>
                            </Section>
                          )}

                          {/* Expériences */}
                          {experiences.length > 0 && (
                            <Section title="Expériences professionnelles" icon={Briefcase}>
                              <div className="space-y-3">
                                {experiences.map((exp, j) => (
                                  <div key={j} className="p-4 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <div className="font-medium text-sm">{exp.title}</div>
                                        <div className="text-xs text-white/40 mt-0.5">
                                          {exp.company}
                                          {exp.location && ` · ${exp.location}`}
                                        </div>
                                      </div>
                                      <div className="text-xs text-white/30 flex-shrink-0">
                                        {exp.start_date} – {exp.current ? 'Présent' : (exp.end_date || '—')}
                                        {exp.duration_months && <div className="text-right">{exp.duration_months} mois</div>}
                                      </div>
                                    </div>
                                    {exp.description && (
                                      <p className="text-xs text-white/50 mt-2 leading-relaxed">{exp.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Section>
                          )}

                          {/* Formation */}
                          {(p.highest_degree || p.school) && (
                            <Section title="Formation" icon={GraduationCap}>
                              <div className="p-4 bg-white/3 border border-white/5 rounded-xl">
                                <div className="font-medium text-sm">{p.highest_degree} {p.education_field && `— ${p.education_field}`}</div>
                                <div className="text-xs text-white/40 mt-0.5">
                                  {p.school}
                                  {p.graduation_year && ` · ${p.graduation_year}`}
                                </div>
                              </div>
                            </Section>
                          )}

                          {/* Préférences de candidature */}
                          {(p.poste || p.localisation || p.contrat || p.salary_expectation || p.availability || p.work_authorization) && (
                            <Section title="Préférences de candidature" icon={Clock}>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {p.poste && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Poste</div>
                                    <div className="text-sm text-white/70">{p.poste}</div>
                                  </div>
                                )}
                                {p.localisation && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Localisation</div>
                                    <div className="text-sm text-white/70">{p.localisation}</div>
                                  </div>
                                )}
                                {p.contrat && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Contrat</div>
                                    <div className="text-sm text-white/70">{p.contrat}</div>
                                  </div>
                                )}
                                {p.salary_expectation && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Salaire</div>
                                    <div className="text-sm text-white/70">{p.salary_expectation}</div>
                                  </div>
                                )}
                                {p.availability && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Disponibilité</div>
                                    <div className="text-sm text-white/70">{p.availability}</div>
                                  </div>
                                )}
                                {p.work_authorization && (
                                  <div className="p-3 bg-white/3 border border-white/5 rounded-xl">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Autorisation travail</div>
                                    <div className="text-sm text-white/70">{p.work_authorization}</div>
                                  </div>
                                )}
                              </div>
                            </Section>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
