'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Zap, Trophy, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Coachee = {
  user_id: string
  full_name: string
  referred_at: string
  plan: string
  subscription_status: string | null
  current_period_end: string | null
  total_applications: number
  total_interviews: number
  last_application_at: string | null
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratuit',
  gold: 'Gold',
  platinum: 'Platinum',
  elite: 'Elite',
}

const PLAN_COLORS: Record<string, string> = {
  free: 'text-white/40 bg-white/[0.06] border-white/10',
  gold: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  platinum: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  elite: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days}j`
  if (days < 30) return `Il y a ${Math.floor(days / 7)}sem`
  return `Il y a ${Math.floor(days / 30)}mois`
}

function isInactive(last: string | null) {
  if (!last) return true
  return Date.now() - new Date(last).getTime() > 14 * 86400000 // 14 jours
}

export default function CoacheesPage() {
  const [coachees, setCoachees] = useState<Coachee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/coach/coachees')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setCoachees(data); setLoading(false) })
  }, [])

  const activeCount = coachees.filter(c => c.plan !== 'free').length
  const inactiveCount = coachees.filter(c => isInactive(c.last_application_at)).length

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Users size={18} className="text-blue-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Mes coachés</h1>
        </div>
        <p className="text-white/40 text-sm mt-1">
          {coachees.length} inscrit{coachees.length > 1 ? 's' : ''} via votre lien
          {activeCount > 0 && (
            <span className="ml-2 text-emerald-400">{activeCount} abonné{activeCount > 1 ? 's' : ''}</span>
          )}
          {inactiveCount > 0 && (
            <span className="ml-2 text-orange-400">{inactiveCount} inactif{inactiveCount > 1 ? 's' : ''}</span>
          )}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <span className="ml-3 text-white/45 text-sm">Chargement...</span>
        </div>
      ) : coachees.length === 0 ? (
        <div className="text-center py-20">
          <Users size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/45 text-sm">Aucun coaché pour l&apos;instant</p>
          <p className="text-white/30 text-xs mt-1">Partagez votre lien de parrainage depuis le dashboard</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coachees.map((c, i) => (
            <motion.div
              key={c.user_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand text-sm font-bold">
                    {c.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{c.full_name}</span>
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                      PLAN_COLORS[c.plan] || PLAN_COLORS.free
                    )}>
                      {PLAN_LABELS[c.plan] || c.plan}
                    </span>
                    {isInactive(c.last_application_at) && c.total_applications > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-orange-400/80">
                        <AlertCircle size={10} />
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">
                    Inscrit {timeAgo(c.referred_at)}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center hidden sm:block">
                    <div className="flex items-center gap-1 text-brand/80">
                      <Zap size={12} />
                      <span className="text-sm font-bold text-white">{c.total_applications}</span>
                    </div>
                    <div className="text-white/30 text-[10px]">candidatures</div>
                  </div>
                  <div className="text-center hidden sm:block">
                    <div className="flex items-center gap-1 text-yellow-400/80">
                      <Trophy size={12} />
                      <span className="text-sm font-bold text-white">{c.total_interviews}</span>
                    </div>
                    <div className="text-white/30 text-[10px]">entretiens</div>
                  </div>
                  {c.last_application_at && (
                    <div className="text-center hidden md:block">
                      <div className="flex items-center gap-1 text-white/40">
                        <Clock size={11} />
                        <span className="text-xs text-white/50">{timeAgo(c.last_application_at)}</span>
                      </div>
                      <div className="text-white/20 text-[10px]">dernière activité</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile stats */}
              <div className="flex gap-4 mt-3 sm:hidden">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Zap size={11} className="text-brand/60" />
                  {c.total_applications} candidatures
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Trophy size={11} className="text-yellow-400/60" />
                  {c.total_interviews} entretiens
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
