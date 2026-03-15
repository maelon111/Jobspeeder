'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import {
  User, Target, Zap, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-react'
import type { Profile, JobPreferences } from '@/types/supabase'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profileSave, setProfileSave] = useState<SaveState>('idle')
  const [prefsSave, setPrefsSave] = useState<SaveState>('idle')

  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: '', phone: '', location: '', linkedin_url: '', portfolio_url: '',
  })

  const [prefs, setPrefs] = useState<Partial<JobPreferences>>({
    job_title: '', location: '', work_mode: 'hybrid', work_time: 'full_time',
    contract_types: ['CDI'], salary_min: null, salary_max: null,
    n8n_webhook_url: '', is_active: true,
  })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, prefsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('job_preferences').select('*').eq('user_id', user.id).single(),
      ])

      if (profileRes.data) {
        const p = profileRes.data as Profile
        setProfile({
          full_name: p.full_name || '',
          phone: p.phone || '',
          location: p.location || '',
          linkedin_url: p.linkedin_url || '',
          portfolio_url: p.portfolio_url || '',
        })
      }
      if (prefsRes.data) {
        const pr = prefsRes.data as JobPreferences
        setPrefs({
          job_title: pr.job_title || '',
          location: pr.location || '',
          work_mode: pr.work_mode || 'hybrid',
          work_time: pr.work_time || 'full_time',
          contract_types: pr.contract_types || ['CDI'],
          salary_min: pr.salary_min,
          salary_max: pr.salary_max,
          n8n_webhook_url: pr.n8n_webhook_url || '',
          is_active: pr.is_active,
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    setProfileSave('saving')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error()
      await supabase.from('profiles').upsert({ user_id: user.id, ...profile })
      setProfileSave('saved')
      setTimeout(() => setProfileSave('idle'), 2000)
    } catch {
      setProfileSave('error')
      setTimeout(() => setProfileSave('idle'), 3000)
    }
  }

  async function savePrefs() {
    setPrefsSave('saving')
    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      setPrefsSave('saved')
      setTimeout(() => setPrefsSave('idle'), 2000)
    } catch {
      setPrefsSave('error')
      setTimeout(() => setPrefsSave('idle'), 3000)
    }
  }

  function toggleContract(type: string) {
    setPrefs(p => ({
      ...p,
      contract_types: p.contract_types?.includes(type)
        ? p.contract_types.filter(t => t !== type)
        : [...(p.contract_types || []), type],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="flex items-center gap-3 text-white/40">
          <RefreshCw size={20} className="animate-spin" />
          Chargement...
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-white/40 mt-1">Gérez votre profil et vos préférences de recherche</p>
      </div>

      {/* Profile section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-xl">
            <User size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold">Profil personnel</h2>
            <p className="text-xs text-white/40">Ces informations apparaissent dans vos candidatures</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nom complet"
            placeholder="Jean Dupont"
            value={profile.full_name || ''}
            onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
          />
          <Input
            label="Téléphone"
            placeholder="+33 6 00 00 00 00"
            value={profile.phone || ''}
            onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
          />
          <Input
            label="Localisation"
            placeholder="Paris, France"
            value={profile.location || ''}
            onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
          />
          <Input
            label="LinkedIn"
            placeholder="linkedin.com/in/prenom-nom"
            value={profile.linkedin_url || ''}
            onChange={e => setProfile(p => ({ ...p, linkedin_url: e.target.value }))}
          />
          <div className="sm:col-span-2">
            <Input
              label="Portfolio / Site web"
              placeholder="https://monportfolio.com"
              value={profile.portfolio_url || ''}
              onChange={e => setProfile(p => ({ ...p, portfolio_url: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          {profileSave === 'saved' && (
            <span className="text-xs text-brand flex items-center gap-1">
              <CheckCircle size={12} /> Sauvegardé
            </span>
          )}
          {profileSave === 'error' && (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> Erreur
            </span>
          )}
          <Button onClick={saveProfile} loading={profileSave === 'saving'} size="sm">
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      {/* Job preferences */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand/10 rounded-xl">
              <Target size={20} className="text-brand" />
            </div>
            <div>
              <h2 className="font-semibold">Critères de recherche</h2>
              <p className="text-xs text-white/40">L&apos;automatisation se basera sur ces critères</p>
            </div>
          </div>
          <Toggle
            checked={prefs.is_active ?? true}
            onChange={val => setPrefs(p => ({ ...p, is_active: val }))}
            label={prefs.is_active ? 'Actif' : 'Inactif'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Poste recherché *"
              placeholder="Développeur Full Stack, Product Manager..."
              value={prefs.job_title || ''}
              onChange={e => setPrefs(p => ({ ...p, job_title: e.target.value }))}
            />
          </div>
          <Input
            label="Localisation"
            placeholder="Paris, Remote..."
            value={prefs.location || ''}
            onChange={e => setPrefs(p => ({ ...p, location: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Mode de travail</label>
            <select
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/50 text-sm"
              value={prefs.work_mode || 'hybrid'}
              onChange={e => setPrefs(p => ({ ...p, work_mode: e.target.value }))}
            >
              <option value="remote">Télétravail complet</option>
              <option value="hybrid">Hybride</option>
              <option value="onsite">Présentiel</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Type de contrat</label>
            <div className="flex flex-wrap gap-2">
              {['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleContract(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    prefs.contract_types?.includes(type)
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
            label="Salaire min (€/an)"
            type="number"
            placeholder="40000"
            value={prefs.salary_min?.toString() || ''}
            onChange={e => setPrefs(p => ({ ...p, salary_min: e.target.value ? parseInt(e.target.value) : null }))}
          />
          <Input
            label="Salaire max (€/an)"
            type="number"
            placeholder="70000"
            value={prefs.salary_max?.toString() || ''}
            onChange={e => setPrefs(p => ({ ...p, salary_max: e.target.value ? parseInt(e.target.value) : null }))}
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          {prefsSave === 'saved' && (
            <span className="text-xs text-brand flex items-center gap-1">
              <CheckCircle size={12} /> Sauvegardé
            </span>
          )}
          {prefsSave === 'error' && (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> Erreur
            </span>
          )}
          <Button onClick={savePrefs} loading={prefsSave === 'saving'} size="sm">
            Sauvegarder
          </Button>
        </div>
      </motion.div>

      {/* Automation / n8n */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 rounded-xl">
            <Zap size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold">Intégration n8n</h2>
            <p className="text-xs text-white/40">Connectez votre workflow d&apos;automatisation n8n</p>
          </div>
        </div>

        <Input
          label="URL du webhook n8n"
          placeholder="https://votre-n8n.com/webhook/xxxx"
          value={prefs.n8n_webhook_url || ''}
          onChange={e => setPrefs(p => ({ ...p, n8n_webhook_url: e.target.value }))}
        />
        <p className="text-xs text-white/30 mt-2 mb-4">
          Ce webhook sera appelé avec vos préférences de recherche pour déclencher l&apos;automatisation. Laissez vide pour utiliser le webhook global configuré sur le serveur.
        </p>

        <div className="p-4 bg-brand/5 border border-brand/15 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-brand" />
            <span className="text-xs font-semibold text-brand">Comment ça marche ?</span>
          </div>
          <ol className="text-xs text-white/50 space-y-1 list-decimal list-inside">
            <li>Créez un workflow n8n avec un trigger webhook</li>
            <li>Ajoutez vos nœuds de scraping (LinkedIn, Indeed, etc.)</li>
            <li>Renvoyez les candidatures vers <code className="text-brand/70">/api/webhook/n8n</code></li>
            <li>JobSpeeder enregistre et suit vos candidatures automatiquement</li>
          </ol>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          {prefsSave === 'saved' && (
            <span className="text-xs text-brand flex items-center gap-1">
              <CheckCircle size={12} /> Sauvegardé
            </span>
          )}
          <Button onClick={savePrefs} loading={prefsSave === 'saving'} size="sm">
            Sauvegarder le webhook
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
