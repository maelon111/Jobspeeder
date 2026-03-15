'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  Briefcase, Search, RefreshCw,
  ChevronLeft, ChevronRight,
  Zap, Upload, FileText, CheckCircle2
} from 'lucide-react'

type JobOffer = {
  titre: string
  entreprise_nom: string
  logo_entreprise: string | null
  date: string | null
}

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance']
const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium', 'Bulgaria', 'Brazil',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Kuwait',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Morocco', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Saudi Arabia', 'Singapore',
  'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Venezuela', 'Vietnam',
]
const WORK_MODES = ['Présentiel', 'Distanciel', 'Hybride']

const PER_PAGE = 20

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  // Campaign form
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [campaignSuccess, setCampaignSuccess] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [campaignForm, setCampaignForm] = useState({
    cv: null as File | null,
    poste: '',
    ville: '',
    pays: '',
    contrat: [] as string[],
    mode: '',
    salary_expectation: '',
    availability: 'Immédiate',
    work_authorization: 'Oui, sans restriction',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleContrat(type: string) {
    setCampaignForm(prev => ({
      ...prev,
      contrat: prev.contrat.includes(type)
        ? prev.contrat.filter(c => c !== type)
        : [...prev.contrat, type],
    }))
  }

  function resetCampaign() {
    setCampaignForm({ cv: null, poste: '', ville: '', pays: '', contrat: [], mode: '', salary_expectation: '', availability: 'Immédiate', work_authorization: 'Oui, sans restriction' })
    setCampaignSuccess(false)
    setShowCampaignModal(false)
  }

  async function handleLaunchCampaign() {
    const { cv, poste, ville, pays, contrat, mode } = campaignForm
    if (!cv || !poste || !ville || !pays || contrat.length === 0 || !mode) return
    setLaunching(true)

    try {
      console.log('[campaign] step 1: getUser')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('[campaign] step 2: user =', user?.id)
      if (!user) return

      console.log('[campaign] step 3: uploading CV')
      const fileExt = cv.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('campaign-cvs')
        .upload(filePath, cv, { upsert: true })
      console.log('[campaign] step 4: upload done, error =', uploadError)

      let cvUrl = ''
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('campaign-cvs').getPublicUrl(filePath)
        cvUrl = publicUrl
      }

      console.log('[campaign] step 5: firing webhook')
      const webhookRes = await fetch('/api/campaign/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_email: user.email,
          cv_url: cvUrl,
          cv_filename: cv.name,
          poste,
          ville,
          pays,
          type_contrat: contrat,
          mode_travail: mode,
          salary_expectation: campaignForm.salary_expectation || null,
          availability: campaignForm.availability,
          work_authorization: campaignForm.work_authorization,
          launched_at: new Date().toISOString(),
        }),
      })
      console.log('[campaign] step 5b: webhook status =', webhookRes.status)

      console.log('[campaign] step 6: success')
      setCampaignSuccess(true)
    } catch (err) {
      console.error('[campaign] ERROR:', err)
    } finally {
      console.log('[campaign] finally: setLaunching(false)')
      setLaunching(false)
    }
  }

  const loadJobs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      limit: String(PER_PAGE),
      offset: String(page * PER_PAGE),
    })
    if (search.trim()) params.set('search', search.trim())
    const res = await fetch(`/api/job-offers?${params}`)
    const data = await res.json()
    setJobs(data.jobs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(loadJobs, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [loadJobs, search])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Candidature automatique</h1>
          <p className="text-white/40 mt-1">{total} candidature{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={() => { setCampaignSuccess(false); setShowCampaignModal(true) }}>
          <Zap size={16} />
          Nouvelle campagne
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher entreprise, poste..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/30">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-4 bg-white/5 rounded-2xl inline-flex mb-4">
              <Briefcase size={32} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">Aucune candidature trouvée</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Poste</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Entreprise</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{job.titre}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {job.logo_entreprise && (
                            <img
                              src={job.logo_entreprise}
                              alt=""
                              className="w-10 h-10 rounded object-contain bg-white/5"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                          <span className="text-sm text-white/60">{job.entreprise_nom || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                          Envoyée
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30 hidden sm:table-cell">
                        {job.date ? new Date(job.date).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
                <span className="text-xs text-white/30">
                  {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} sur {total}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Campaign modal */}
      <Modal
        open={showCampaignModal}
        onClose={resetCampaign}
        title="Nouvelle campagne de candidature automatique"
        className="max-w-2xl"
      >
        {campaignSuccess ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="p-4 bg-brand/15 rounded-2xl">
              <CheckCircle2 size={36} className="text-brand" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Campagne lancée !</p>
              <p className="text-white/40 text-sm mt-1">
                JobSpeeder traite vos critères et commence à postuler automatiquement.
              </p>
            </div>
            <Button onClick={resetCampaign} className="mt-2">Fermer</Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* CV Upload */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">CV (PDF ou DOCX) *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={e => setCampaignForm(prev => ({ ...prev, cv: e.target.files?.[0] ?? null }))}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-colors ${
                  campaignForm.cv
                    ? 'border-brand/40 bg-brand/5'
                    : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {campaignForm.cv ? (
                  <>
                    <FileText size={24} className="text-brand" />
                    <span className="text-sm font-medium text-white">{campaignForm.cv.name}</span>
                    <span className="text-xs text-white/40">Cliquer pour changer</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-white/30" />
                    <span className="text-sm text-white/50">Glisser votre CV ici ou cliquer pour parcourir</span>
                    <span className="text-xs text-white/30">PDF, DOCX</span>
                  </>
                )}
              </button>
            </div>

            {/* Poste + Ville */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Poste recherché *"
                placeholder="Développeur Full Stack..."
                value={campaignForm.poste}
                onChange={e => setCampaignForm(prev => ({ ...prev, poste: e.target.value }))}
              />
              <Input
                label="Ville *"
                placeholder="Paris, Lyon..."
                value={campaignForm.ville}
                onChange={e => setCampaignForm(prev => ({ ...prev, ville: e.target.value }))}
              />
            </div>

            {/* Pays + Salaire */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Pays *</label>
                <select
                  value={campaignForm.pays}
                  onChange={e => setCampaignForm(prev => ({ ...prev, pays: e.target.value }))}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none"
                >
                  <option value="" disabled className="bg-dark-200">Sélectionner un pays</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country} className="bg-dark-200">{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Prétentions salariales</label>
                <input
                  type="text"
                  placeholder="Ex: 45 000€ / an, Négociable..."
                  value={campaignForm.salary_expectation}
                  onChange={e => setCampaignForm(prev => ({ ...prev, salary_expectation: e.target.value }))}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
            </div>

            {/* Type de contrat */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">Type de contrat *</label>
              <div className="flex flex-wrap gap-2">
                {CONTRACT_TYPES.map(type => {
                  const selected = campaignForm.contrat.includes(type)
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleContrat(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        selected
                          ? 'bg-brand/20 border-brand/40 text-brand'
                          : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mode de travail + Disponibilité */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Mode de travail *</label>
                <div className="flex gap-2">
                  {WORK_MODES.map(mode => {
                    const selected = campaignForm.mode === mode
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, mode }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Disponibilité</label>
                <select
                  value={campaignForm.availability}
                  onChange={e => setCampaignForm(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none"
                >
                  <option value="Immédiate" className="bg-dark-200">Immédiate</option>
                  <option value="Entre 1 - 3 mois" className="bg-dark-200">Entre 1 - 3 mois</option>
                  <option value="Plus de 3 mois" className="bg-dark-200">Plus de 3 mois</option>
                </select>
              </div>
            </div>

            {/* Autorisation de travail */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">
                Êtes-vous autorisé(e) à travailler dans le pays où vous postulez ?
              </label>
              <select
                value={campaignForm.work_authorization}
                onChange={e => setCampaignForm(prev => ({ ...prev, work_authorization: e.target.value }))}
                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none"
              >
                <option value="Oui, sans restriction" className="bg-dark-200">Oui, sans restriction</option>
                <option value="Oui, avec visa de travail" className="bg-dark-200">Oui, avec visa de travail</option>
                <option value="Non, je nécessite un visa" className="bg-dark-200">Non, je nécessite un visa</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" onClick={resetCampaign} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleLaunchCampaign}
                loading={launching}
                disabled={
                  !campaignForm.cv || !campaignForm.poste || !campaignForm.ville ||
                  !campaignForm.pays || campaignForm.contrat.length === 0 || !campaignForm.mode
                }
                className="flex-1"
              >
                <Zap size={15} />
                Lancer la campagne
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
