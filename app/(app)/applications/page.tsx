'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  Briefcase, Search, ExternalLink, RefreshCw,
  ChevronLeft, ChevronRight, Plus, Trash2, StickyNote,
  Zap, Upload, FileText, CheckCircle2
} from 'lucide-react'
import type { Application, ApplicationStatus } from '@/types/supabase'
import { formatRelativeDate } from '@/lib/utils'

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

const STATUS_OPTIONS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'sent', label: 'Envoyée' },
  { value: 'viewed', label: 'Vue' },
  { value: 'interview', label: 'Entretien' },
  { value: 'rejected', label: 'Refusée' },
]

const PER_PAGE = 20

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // New application form
  const [newApp, setNewApp] = useState({ company: '', job_title: '', job_url: '', notes: '' })
  const [saving, setSaving] = useState(false)

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
    setCampaignForm({ cv: null, poste: '', ville: '', pays: '', contrat: [], mode: '' })
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

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('applied_at', { ascending: false })
      .range(page * PER_PAGE, (page + 1) * PER_PAGE - 1)

    if (statusFilter !== 'all') query = query.eq('status', statusFilter)
    if (search.trim()) {
      query = query.or(`company.ilike.%${search}%,job_title.ilike.%${search}%`)
    }

    const { data, count } = await query
    setApplications((data || []) as Application[])
    setTotal(count || 0)
    setLoading(false)
  }, [page, statusFilter, search])

  useEffect(() => {
    const t = setTimeout(load, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [load, search])

  async function handleAdd() {
    if (!newApp.company || !newApp.job_title) return
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('applications').insert({
      user_id: user.id,
      company: newApp.company,
      job_title: newApp.job_title,
      job_url: newApp.job_url || null,
      notes: newApp.notes || null,
      applied_via: 'manual',
      status: 'pending',
      applied_at: new Date().toISOString(),
    })

    setNewApp({ company: '', job_title: '', job_url: '', notes: '' })
    setShowAddModal(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('applications').delete().eq('id', id)
    setDeletingId(null)
    if (selectedApp?.id === id) setSelectedApp(null)
    load()
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    const supabase = createClient()
    await supabase.from('applications').update({ status }).eq('id', id)
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null)
  }

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
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Ajouter manuellement
          </Button>
          <Button onClick={() => { setCampaignSuccess(false); setShowCampaignModal(true) }}>
            <Zap size={16} />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher entreprise, poste..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setStatusFilter(opt.value); setPage(0) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                statusFilter === opt.value
                  ? 'bg-brand/20 border-brand/30 text-brand'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/30">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : applications.length === 0 ? (
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
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Via</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{app.job_title}</span>
                          {app.job_url && (
                            <a
                              href={app.job_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink size={12} className="text-white/30 hover:text-white/60" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{app.company}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-xs text-white/30 capitalize">{app.applied_via}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30 hidden sm:table-cell">
                        {formatRelativeDate(app.applied_at)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(app.id) }}
                          className="text-white/20 hover:text-red-400 transition-colors"
                          disabled={deletingId === app.id}
                        >
                          {deletingId === app.id
                            ? <RefreshCw size={14} className="animate-spin" />
                            : <Trash2 size={14} />
                          }
                        </button>
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

      {/* Detail modal */}
      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title={selectedApp?.job_title || ''}>
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-xs text-white/40 mb-1">Entreprise</div>
                <div className="text-sm font-medium">{selectedApp.company}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-xs text-white/40 mb-1">Via</div>
                <div className="text-sm font-medium capitalize">{selectedApp.applied_via}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="text-xs text-white/40 mb-1">Date</div>
                <div className="text-sm font-medium">{new Date(selectedApp.applied_at).toLocaleDateString('fr-FR')}</div>
              </div>
              {selectedApp.job_url && (
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="text-xs text-white/40 mb-1">Offre</div>
                  <a href={selectedApp.job_url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline flex items-center gap-1">
                    Voir <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-white/40 mb-2">Statut</div>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'sent', 'viewed', 'interview', 'rejected'] as ApplicationStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedApp.id, s)}
                    className={`transition-all ${selectedApp.status === s ? 'ring-2 ring-white/30 scale-105' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <StatusBadge status={s} />
                  </button>
                ))}
              </div>
            </div>

            {selectedApp.notes && (
              <div className="p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                  <StickyNote size={12} />
                  Notes
                </div>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{selectedApp.notes}</p>
              </div>
            )}

            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(selectedApp.id)}
              loading={deletingId === selectedApp.id}
              className="w-full"
            >
              <Trash2 size={14} />
              Supprimer cette candidature
            </Button>
          </div>
        )}
      </Modal>

      {/* Campaign modal */}
      <Modal
        open={showCampaignModal}
        onClose={resetCampaign}
        title="Nouvelle campagne de candidature automatique"
        className="max-w-lg"
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

            {/* Poste */}
            <Input
              label="Poste recherché *"
              placeholder="Développeur Full Stack, Chef de projet..."
              value={campaignForm.poste}
              onChange={e => setCampaignForm(prev => ({ ...prev, poste: e.target.value }))}
            />

            {/* Ville + Pays */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Ville *"
                placeholder="Paris, Lyon..."
                value={campaignForm.ville}
                onChange={e => setCampaignForm(prev => ({ ...prev, ville: e.target.value }))}
              />
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

            {/* Mode de travail */}
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

      {/* Add modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter une candidature">
        <div className="space-y-4">
          <Input
            label="Poste *"
            placeholder="Développeur Full Stack"
            value={newApp.job_title}
            onChange={e => setNewApp(p => ({ ...p, job_title: e.target.value }))}
          />
          <Input
            label="Entreprise *"
            placeholder="Acme Corp"
            value={newApp.company}
            onChange={e => setNewApp(p => ({ ...p, company: e.target.value }))}
          />
          <Input
            label="URL de l'offre"
            placeholder="https://..."
            value={newApp.job_url}
            onChange={e => setNewApp(p => ({ ...p, job_url: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Notes</label>
            <textarea
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              placeholder="Informations supplémentaires..."
              rows={3}
              value={newApp.notes}
              onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">
              Annuler
            </Button>
            <Button
              onClick={handleAdd}
              loading={saving}
              disabled={!newApp.company || !newApp.job_title}
              className="flex-1"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
