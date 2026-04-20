'use client'
import { useEffect, useState } from 'react'
import { Users, GraduationCap, Briefcase, CreditCard, Clock, CheckCircle, XCircle, Eye, UserCheck } from 'lucide-react'

type Stats = {
  totalUsers: number
  totalCoaches: number
  approvedCoaches: number
  pendingCoaches: number
  totalApplications: number
  activeSubscriptions: number
  planCount: Record<string, number>
  appStatusCount: Record<string, number>
  registrationsByDay: { date: string; count: number }[]
  applicationsByDay: { date: string; count: number }[]
}

const PLAN_COLORS: Record<string, string> = {
  free: 'text-white/40',
  gold: 'text-yellow-400',
  platinum: 'text-blue-400',
  elite: 'text-purple-400',
}

const PLAN_BG: Record<string, string> = {
  free: 'bg-white/5',
  gold: 'bg-yellow-500/10',
  platinum: 'bg-blue-500/10',
  elite: 'bg-purple-500/10',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  sent: 'text-blue-400',
  viewed: 'text-cyan-400',
  interview: 'text-brand',
  rejected: 'text-red-400',
}

function MiniBar({ values, color = '#00ff88' }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-px h-12">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${Math.max(4, (v / max) * 100)}%`,
            backgroundColor: color,
            opacity: 0.15 + (v / max) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
          <span className="text-white/30 text-sm">Chargement…</span>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const kpis = [
    {
      label: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/15',
    },
    {
      label: 'Abonnements actifs',
      value: stats.activeSubscriptions,
      icon: CreditCard,
      color: 'text-brand',
      bg: 'bg-brand/10',
      border: 'border-brand/15',
    },
    {
      label: 'Coachs approuvés',
      value: stats.approvedCoaches,
      sub: `${stats.pendingCoaches} en attente`,
      icon: GraduationCap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/15',
    },
    {
      label: 'Candidatures totales',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/15',
    },
  ]

  const regValues = stats.registrationsByDay.map(d => d.count)
  const appValues = stats.applicationsByDay.map(d => d.count)

  const totalPlanUsers = Object.values(stats.planCount).reduce((a, b) => a + b, 0)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-brand/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Vue d&apos;ensemble</h1>
        <p className="text-white/35 mt-1 text-sm">Tableau de bord administrateur &middot; {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className={`glass rounded-2xl p-5 border ${k.border}`}>
              <div className={`inline-flex p-2.5 rounded-xl ${k.bg} mb-3`}>
                <Icon size={17} className={k.color} />
              </div>
              <div className={`text-3xl font-black ${k.color} mb-0.5 leading-none`}>{k.value}</div>
              <div className="text-xs text-white/35 font-medium">{k.label}</div>
              {k.sub && <div className="text-[10px] text-white/25 mt-0.5">{k.sub}</div>}
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Registrations chart */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm text-white">Inscriptions</h2>
              <p className="text-xs text-white/30 mt-0.5">30 derniers jours</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-blue-400">
                {regValues.reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-[10px] text-white/25">nouveaux</div>
            </div>
          </div>
          <MiniBar values={regValues} color="#60a5fa" />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/20">{stats.registrationsByDay[0]?.date.slice(5)}</span>
            <span className="text-[10px] text-white/20">{stats.registrationsByDay[stats.registrationsByDay.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        {/* Applications chart */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-sm text-white">Candidatures</h2>
              <p className="text-xs text-white/30 mt-0.5">30 derniers jours</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-brand">
                {appValues.reduce((a, b) => a + b, 0)}
              </div>
              <div className="text-[10px] text-white/25">envoyées</div>
            </div>
          </div>
          <MiniBar values={appValues} color="#00ff88" />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-white/20">{stats.applicationsByDay[0]?.date.slice(5)}</span>
            <span className="text-[10px] text-white/20">{stats.applicationsByDay[stats.applicationsByDay.length - 1]?.date.slice(5)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Plans distribution */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5">
          <h2 className="font-semibold text-sm text-white mb-4">Répartition des plans</h2>
          <div className="space-y-2.5">
            {Object.entries(stats.planCount).map(([plan, count]) => {
              const pct = totalPlanUsers > 0 ? Math.round((count / totalPlanUsers) * 100) : 0
              return (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold capitalize ${PLAN_COLORS[plan]}`}>{plan}</span>
                    <span className="text-xs text-white/40">{count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${PLAN_BG[plan]}`}
                      style={{ width: `${pct}%`, backgroundColor: plan === 'free' ? 'rgba(255,255,255,0.12)' : plan === 'gold' ? '#facc15' : plan === 'platinum' ? '#60a5fa' : '#a855f7' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Application statuses */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5">
          <h2 className="font-semibold text-sm text-white mb-4">Statuts des candidatures</h2>
          <div className="space-y-2">
            {[
              { key: 'pending', label: 'En attente', icon: Clock },
              { key: 'sent', label: 'Envoyées', icon: CheckCircle },
              { key: 'viewed', label: 'Vues', icon: Eye },
              { key: 'interview', label: 'Entretiens', icon: UserCheck },
              { key: 'rejected', label: 'Refusées', icon: XCircle },
            ].map(({ key, label, icon: Icon }) => {
              const count = stats.appStatusCount[key] ?? 0
              const total = stats.totalApplications || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={key} className="flex items-center gap-3">
                  <Icon size={13} className={STATUS_COLORS[key]} />
                  <span className="text-xs text-white/50 w-24 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-white/20" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-white/40 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
