'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Zap, User, FileText, Sparkles, Target, Plus, Trash2, CheckCircle } from 'lucide-react'
import { BlobBackground } from '@/components/BlobBackground'
import type { CVContent } from '@/types/supabase'

const TOTAL_STEPS = 4

const defaultCV: CVContent = {
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [{ language: 'Français', level: 'Natif' }],
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Personal info
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    location: '',
    linkedin_url: '',
    portfolio_url: '',
  })

  // Step 2: CV
  const [cv, setCv] = useState<CVContent>(defaultCV)
  const [skillInput, setSkillInput] = useState('')
  const [cvOptimized, setCvOptimized] = useState(false)

  // Step 4: Job preferences
  const [prefs, setPrefs] = useState({
    job_title: '',
    location: '',
    work_mode: 'hybrid',
    work_time: 'full_time',
    contract_types: ['CDI'] as string[],
    salary_min: '',
    salary_max: '',
    n8n_webhook_url: '',
  })

  async function optimizeCV() {
    setOptimizing(true)
    setError('')
    try {
      const res = await fetch('/api/cv/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv_content: cv }),
      })
      const data = await res.json()
      if (data.optimized) {
        setCv(data.optimized)
        setCvOptimized(true)
      }
    } catch {
      setError('Erreur lors de l\'optimisation. Continuez sans optimisation.')
    } finally {
      setOptimizing(false)
    }
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Save profile
      await supabase.from('profiles').upsert({
        user_id: user.id,
        ...profile,
      })

      // Save CV
      const { data: cvDataRaw } = await supabase.from('cvs').insert({
        user_id: user.id,
        name: 'Mon CV principal',
        content_json: cv as unknown as import('@/types/supabase').Json,
        is_active: true,
      }).select().single()
      const cvData = cvDataRaw as import('@/types/supabase').CV | null

      // Save preferences & trigger n8n
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prefs,
          salary_min: prefs.salary_min ? parseInt(prefs.salary_min) : null,
          salary_max: prefs.salary_max ? parseInt(prefs.salary_max) : null,
          cv_content: cv,
          cv_id: cvData?.id,
        }),
      })

      router.push('/dashboard')
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addExperience = () => {
    setCv(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '', company: '', start_date: '', current: true, bullets: ['']
      }]
    }))
  }

  const addEducation = () => {
    setCv(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', graduation_year: '' }]
    }))
  }

  const addSkill = () => {
    if (skillInput.trim() && !cv.skills.includes(skillInput.trim())) {
      setCv(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex items-center justify-center px-4 py-8">
      <BlobBackground />
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-xl mb-6">
            <div className="p-2 bg-brand rounded-xl">
              <Zap size={18} className="text-black fill-current" />
            </div>
            JobSpeeder
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: i < step ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-white/40">Étape {step} sur {TOTAL_STEPS}</p>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-brand/10 rounded-xl">
                    <User size={20} className="text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Informations personnelles</h2>
                    <p className="text-white/40 text-sm">Ces infos apparaîtront dans vos candidatures</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nom complet *"
                    placeholder="Jean Dupont"
                    value={profile.full_name}
                    onChange={(e) => setProfile(p => ({ ...p, full_name: e.target.value }))}
                  />
                  <Input
                    label="Téléphone"
                    placeholder="+33 6 00 00 00 00"
                    value={profile.phone}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                  />
                  <Input
                    label="Localisation *"
                    placeholder="Paris, France"
                    value={profile.location}
                    onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                  />
                  <Input
                    label="URL LinkedIn"
                    placeholder="linkedin.com/in/prenom-nom"
                    value={profile.linkedin_url}
                    onChange={(e) => setProfile(p => ({ ...p, linkedin_url: e.target.value }))}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Portfolio / Site web"
                      placeholder="https://monportfolio.com"
                      value={profile.portfolio_url}
                      onChange={(e) => setProfile(p => ({ ...p, portfolio_url: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: CV Builder */}
            {step === 2 && (
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Construire votre CV</h2>
                    <p className="text-white/40 text-sm">Remplissez vos informations professionnelles</p>
                  </div>
                </div>

                {/* Summary */}
                <Textarea
                  label="Résumé professionnel"
                  placeholder="Développeur Full Stack avec 5 ans d'expérience..."
                  value={cv.summary || ''}
                  onChange={(e) => setCv(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                />

                {/* Experience */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Expériences</h3>
                    <button onClick={addExperience} className="text-xs text-brand flex items-center gap-1 hover:text-brand-light">
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  {cv.experience.map((exp, i) => (
                    <div key={i} className="p-4 bg-white/3 border border-white/5 rounded-xl mb-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Titre du poste"
                          value={exp.title}
                          onChange={(e) => {
                            const updated = [...cv.experience]
                            updated[i] = { ...updated[i], title: e.target.value }
                            setCv(p => ({ ...p, experience: updated }))
                          }}
                        />
                        <Input
                          placeholder="Entreprise"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...cv.experience]
                            updated[i] = { ...updated[i], company: e.target.value }
                            setCv(p => ({ ...p, experience: updated }))
                          }}
                        />
                        <Input
                          placeholder="Date début (MM/YYYY)"
                          value={exp.start_date}
                          onChange={(e) => {
                            const updated = [...cv.experience]
                            updated[i] = { ...updated[i], start_date: e.target.value }
                            setCv(p => ({ ...p, experience: updated }))
                          }}
                        />
                        <Input
                          placeholder="Date fin (ou 'Présent')"
                          value={exp.end_date || ''}
                          onChange={(e) => {
                            const updated = [...cv.experience]
                            updated[i] = { ...updated[i], end_date: e.target.value }
                            setCv(p => ({ ...p, experience: updated }))
                          }}
                        />
                      </div>
                      <Textarea
                        placeholder="Description (une ligne par point clé)"
                        value={exp.bullets.join('\n')}
                        onChange={(e) => {
                          const updated = [...cv.experience]
                          updated[i] = { ...updated[i], bullets: e.target.value.split('\n') }
                          setCv(p => ({ ...p, experience: updated }))
                        }}
                        rows={3}
                      />
                      <button
                        onClick={() => setCv(p => ({ ...p, experience: p.experience.filter((_, j) => j !== i) }))}
                        className="text-xs text-red-400 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  ))}
                  {cv.experience.length === 0 && (
                    <p className="text-white/30 text-sm text-center py-4">Aucune expérience ajoutée</p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Formation</h3>
                    <button onClick={addEducation} className="text-xs text-brand flex items-center gap-1 hover:text-brand-light">
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  {cv.education.map((edu, i) => (
                    <div key={i} className="p-4 bg-white/3 border border-white/5 rounded-xl mb-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Diplôme / Titre"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...cv.education]
                            updated[i] = { ...updated[i], degree: e.target.value }
                            setCv(p => ({ ...p, education: updated }))
                          }}
                        />
                        <Input
                          placeholder="École / Université"
                          value={edu.school}
                          onChange={(e) => {
                            const updated = [...cv.education]
                            updated[i] = { ...updated[i], school: e.target.value }
                            setCv(p => ({ ...p, education: updated }))
                          }}
                        />
                        <Input
                          placeholder="Année d'obtention"
                          value={edu.graduation_year}
                          onChange={(e) => {
                            const updated = [...cv.education]
                            updated[i] = { ...updated[i], graduation_year: e.target.value }
                            setCv(p => ({ ...p, education: updated }))
                          }}
                        />
                      </div>
                      <button
                        onClick={() => setCv(p => ({ ...p, education: p.education.filter((_, j) => j !== i) }))}
                        className="text-xs text-red-400 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Supprimer
                      </button>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">Compétences</h3>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Ajouter une compétence"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      className="flex-1"
                    />
                    <Button onClick={addSkill} variant="secondary" size="sm">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cv.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand"
                      >
                        {skill}
                        <button onClick={() => setCv(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))}>
                          <Trash2 size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: AI Optimization */}
            {step === 3 && (
              <div className="glass rounded-2xl p-8 text-center">
                <div className="p-4 bg-brand/10 rounded-2xl inline-flex mb-6">
                  {cvOptimized
                    ? <CheckCircle size={40} className="text-brand" />
                    : <Sparkles size={40} className="text-brand" />
                  }
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {cvOptimized ? 'CV optimisé !' : 'Optimisation IA'}
                </h2>
                <p className="text-white/50 mb-8 max-w-sm mx-auto">
                  {cvOptimized
                    ? 'Votre CV a été réécrit pour maximiser les scores ATS et attirer les recruteurs.'
                    : 'Nos modèles IA vont analyser et réécrire votre CV pour maximiser vos chances de passer les filtres ATS.'
                  }
                </p>

                {!cvOptimized && (
                  <div className="space-y-4 mb-6">
                    {['Analyse des mots-clés ATS', 'Reformulation des achievements', 'Optimisation des sections'].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-left p-3 bg-white/3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                        <span className="text-sm text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-4">
                    {error}
                  </div>
                )}

                {!cvOptimized ? (
                  <Button onClick={optimizeCV} loading={optimizing} size="lg">
                    <Sparkles size={18} />
                    Optimiser mon CV avec l&apos;IA
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle size={20} className="text-brand" />
                    <span className="text-brand font-semibold">Optimisation réussie</span>
                  </div>
                )}

                <button
                  onClick={() => setStep(4)}
                  className="block mx-auto mt-4 text-sm text-white/30 hover:text-white/50 transition-colors"
                >
                  {cvOptimized ? 'Passer à la suite →' : 'Passer cette étape →'}
                </button>
              </div>
            )}

            {/* Step 4: Job Preferences */}
            {step === 4 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl">
                    <Target size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Vos critères de recherche</h2>
                    <p className="text-white/40 text-sm">Notre bot cherchera uniquement les offres correspondantes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Titre de poste recherché *"
                      placeholder="Développeur Full Stack, Product Manager..."
                      value={prefs.job_title}
                      onChange={(e) => setPrefs(p => ({ ...p, job_title: e.target.value }))}
                    />
                  </div>
                  <Input
                    label="Localisation"
                    placeholder="Paris, Lyon, Remote..."
                    value={prefs.location}
                    onChange={(e) => setPrefs(p => ({ ...p, location: e.target.value }))}
                  />
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1.5">Mode de travail</label>
                    <select
                      className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                      value={prefs.work_mode}
                      onChange={(e) => setPrefs(p => ({ ...p, work_mode: e.target.value }))}
                    >
                      <option value="remote">Télétravail complet</option>
                      <option value="hybrid">Hybride</option>
                      <option value="onsite">Présentiel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1.5">Temps de travail</label>
                    <select
                      className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                      value={prefs.work_time}
                      onChange={(e) => setPrefs(p => ({ ...p, work_time: e.target.value }))}
                    >
                      <option value="full_time">Temps plein</option>
                      <option value="part_time">Temps partiel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 block mb-1.5">Type de contrat</label>
                    <div className="flex flex-wrap gap-2">
                      {['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setPrefs(p => ({
                              ...p,
                              contract_types: p.contract_types.includes(type)
                                ? p.contract_types.filter(t => t !== type)
                                : [...p.contract_types, type]
                            }))
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            prefs.contract_types.includes(type)
                              ? 'bg-brand/20 border-brand/30 text-brand'
                              : 'bg-white/5 border-white/10 text-white/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Salaire minimum (€/an)"
                    placeholder="40000"
                    type="number"
                    value={prefs.salary_min}
                    onChange={(e) => setPrefs(p => ({ ...p, salary_min: e.target.value }))}
                  />
                  <Input
                    label="Salaire maximum (€/an)"
                    placeholder="60000"
                    type="number"
                    value={prefs.salary_max}
                    onChange={(e) => setPrefs(p => ({ ...p, salary_max: e.target.value }))}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="URL Webhook n8n (optionnel)"
                      placeholder="https://votre-n8n.com/webhook/..."
                      value={prefs.n8n_webhook_url}
                      onChange={(e) => setPrefs(p => ({ ...p, n8n_webhook_url: e.target.value }))}
                    />
                    <p className="text-xs text-white/30 mt-1">
                      Si vide, utilise le webhook global configuré dans les variables d&apos;environnement.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)} className="flex-1">
              Précédent
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              onClick={() => {
                if (step === 3 && !cvOptimized) {
                  setStep(4)
                } else {
                  setStep(s => s + 1)
                }
              }}
              className="flex-1"
            >
              Suivant
            </Button>
          ) : (
            <Button onClick={handleFinish} loading={loading} className="flex-1">
              <Zap size={16} />
              Lancer l&apos;automatisation !
            </Button>
          )}
        </div>

        {error && step === 4 && (
          <p className="text-center text-sm text-red-400 mt-3">{error}</p>
        )}
      </div>
    </div>
  )
}
