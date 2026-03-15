'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Zap, Briefcase, TrendingUp, Clock, Star, ArrowRight, FileText, Settings } from 'lucide-react'
import Link from 'next/link'
import type { Profile, JobPreferences } from '@/types/supabase'

type JobOffer = {
  titre: string
  entreprise_nom: string
  logo_entreprise: string | null
  date: string | null
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [total, setTotal] = useState(0)
  const [recent, setRecent] = useState<JobOffer[]>([])
  const [prefs, setPrefs] = useState<JobPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, prefsRes, jobsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('job_preferences').select('*').eq('user_id', user.id).single(),
        fetch('/api/job-offers?limit=5'),
      ])

      if (profileRes.data) setProfile(profileRes.data as Profile)
      if (prefsRes.data) setPrefs(prefsRes.data as JobPreferences)

      if (jobsRes.ok) {
        const data = await jobsRes.json()
        setRecent(data.jobs || [])
        setTotal(data.total || 0)
      }

      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    {
      label: 'Candidatures',
      value: total,
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/15',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]',
    },
    {
      label: 'Envoyées',
      value: total,
      icon: Star,
      color: 'text-brand',
      bg: 'bg-brand/10',
      border: 'border-brand/15',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.08)]',
    },
    {
      label: 'En traitement',
      value: total,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/15',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.08)]',
    },
    {
      label: 'Taux succès',
      value: '—',
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/15',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
          <span className="text-white/30 text-sm">Chargement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-brand/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              Bonjour{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-white/35 mt-1 text-sm">
              {prefs?.job_title
                ? `Automatisation active · "${prefs.job_title}"`
                : 'Configurez vos préférences pour démarrer'}
            </p>
          </div>
          {prefs?.is_active && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand/8 border border-brand/20 rounded-full text-xs text-brand font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Actif
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass rounded-2xl p-5 border ${stat.border} card-hover ${stat.glow}`}
            >
              <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3`}>
                <Icon size={17} className={stat.color} />
              </div>
              <div className={`text-3xl font-black ${stat.color} mb-0.5 leading-none`}>{stat.value}</div>
              <div className="text-xs text-white/35 font-medium">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent applications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="lg:col-span-2 glass rounded-2xl overflow-hidden border border-white/[0.06]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold text-sm text-white">Candidatures récentes</h2>
            <Link href="/applications">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-white/[0.04] rounded-2xl inline-flex mb-4">
                <Briefcase size={28} className="text-white/15" />
              </div>
              <p className="text-white/30 text-sm font-medium">Aucune candidature pour le moment</p>
              <p className="text-white/18 text-xs mt-1.5">L&apos;automatisation enverra des candidatures dès que configurée</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recent.map((job, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  {job.logo_entreprise && (
                    <img
                      src={job.logo_entreprise}
                      alt=""
                      className="w-8 h-8 rounded object-contain bg-white/5 flex-shrink-0"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm text-white/90 truncate block">{job.titre}</span>
                    <div className="text-xs text-white/35 mt-0.5">
                      {job.entreprise_nom || '—'}
                      {job.date && ` · ${new Date(job.date).toLocaleDateString('fr-FR')}`}
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20 flex-shrink-0">
                    Envoyée
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="space-y-4"
        >
          {/* Automation status */}
          <div className="glass rounded-2xl p-5 border border-white/[0.06]">
            <h2 className="font-semibold text-sm text-white mb-3">Automatisation</h2>
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl mb-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${prefs?.is_active ? 'bg-brand animate-pulse' : 'bg-white/15'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white/80">{prefs?.is_active ? 'Active' : 'Inactive'}</div>
                <div className="text-xs text-white/35">
                  {prefs?.n8n_webhook_url ? 'Webhook configuré' : 'Webhook non configuré'}
                </div>
              </div>
            </div>
            {prefs?.job_title && (
              <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl mb-3">
                <div className="text-[10px] text-white/35 uppercase tracking-wide font-semibold mb-1">Poste recherché</div>
                <div className="text-sm font-medium text-white/80">{prefs.job_title}</div>
                {prefs.location && <div className="text-xs text-white/35 mt-0.5">{prefs.location}</div>}
              </div>
            )}
            <Link href="/settings" className="block">
              <Button variant="secondary" size="sm" className="w-full">
                <Settings size={13} />
                Configurer
              </Button>
            </Link>
          </div>

          {/* Quick links */}
          <div className="glass rounded-2xl p-5 border border-white/[0.06]">
            <h2 className="font-semibold text-sm text-white mb-3">Actions rapides</h2>
            <div className="space-y-1.5">
              <Link href="/cv">
                <button className="flex items-center gap-3 w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-150 text-sm text-left">
                  <FileText size={15} className="text-blue-400 flex-shrink-0" />
                  <span className="text-white/70 font-medium">Gérer mes CVs</span>
                  <ArrowRight size={13} className="ml-auto text-white/25" />
                </button>
              </Link>
              <Link href="/applications">
                <button className="flex items-center gap-3 w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-150 text-sm text-left">
                  <Briefcase size={15} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-white/70 font-medium">Toutes les candidatures</span>
                  <ArrowRight size={13} className="ml-auto text-white/25" />
                </button>
              </Link>
            </div>
          </div>

          {/* Tip */}
          <div className="rounded-2xl p-4 bg-brand/[0.04] border border-brand/[0.12]">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} className="text-brand fill-current" />
              <span className="text-[11px] font-bold text-brand uppercase tracking-wide">Conseil</span>
            </div>
            <p className="text-xs text-white/45 leading-relaxed">
              Activez votre webhook n8n dans les paramètres pour déclencher l&apos;automatisation des candidatures.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
