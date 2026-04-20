'use client'
import { useEffect, useState } from 'react'
import { Briefcase, Search, Clock, CheckCircle, Eye, UserCheck, XCircle, type LucideIcon } from 'lucide-react'

type Application = {
  id: string
  user_id: string
  user_email: string
  company: string
  job_title: string
  status: string
  applied_via: string
  applied_at: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: LucideIcon }> = {
  pending: { label: 'En attente', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', icon: Clock },
  sent: { label: 'Envoyée', badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: CheckCircle },
  viewed: { label: 'Vue', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20', icon: Eye },
  interview: { label: 'Entretien', badge: 'bg-brand/15 text-brand border-brand/20', icon: UserCheck },
  rejected: { label: 'Refusée', badge: 'bg-red-500/15 text-red-400 border-red-500/20', icon: XCircle },
}

const VIA_BADGE: Record<string, string> = {
  email: 'bg-blue-500/10 text-blue-400/70',
  skyvern: 'bg-purple-500/10 text-purple-400/70',
  manual: 'bg-white/5 text-white/30',
}

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetch('/api/admin/applications?limit=200')
      .then(r => r.json())
      .then(d => { setApps(d.applications || []); setLoading(false) })
  }, [])

  const filtered = apps.filter(a => {
    const q = search.toLowerCase()
    const matchQ = !q || a.company.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q) || a.user_email.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    return matchQ && matchStatus
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Briefcase size={22} className="text-purple-400" />
          Candidatures
        </h1>
        <p className="text-white/35 mt-1 text-sm">{apps.length} candidatures · 200 dernières</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Entreprise, poste, utilisateur…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#0d1825] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-brand/40"
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Utilisateur', 'Entreprise', 'Poste', 'Méthode', 'Date', 'Statut'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wide font-semibold text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(a => {
                  const sc = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending
                  const StatusIcon = sc.icon
                  return (
                    <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-xs text-white/40 max-w-[160px] truncate">
                        {a.user_email}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white/70">{a.company}</td>
                      <td className="px-4 py-3 text-xs text-white/50 max-w-[180px] truncate">{a.job_title}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${VIA_BADGE[a.applied_via] || VIA_BADGE.manual}`}>
                          {a.applied_via}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/35 whitespace-nowrap">
                        {new Date(a.applied_at || a.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${sc.badge}`}>
                          <StatusIcon size={10} />
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/25 text-sm">Aucune candidature trouvée</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
