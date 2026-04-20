'use client'
import { useEffect, useState } from 'react'
import { Users, Search, Briefcase, ExternalLink, GraduationCap, MapPin } from 'lucide-react'

type User = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  full_name: string | null
  location: string | null
  plan: string
  sub_status: string | null
  billing_period: string | null
  period_end: string | null
  applications_count: number
  last_application_at: string | null
  referred_by_coach_name: string | null
  referred_by_coach_slug: string | null
  referred_at: string | null
}

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-white/8 text-white/40 border-white/10',
  gold: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  platinum: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  elite: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState<string>('all')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false) })
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchQ = !q || u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q)
    const matchPlan = filterPlan === 'all' || u.plan === filterPlan
    return matchQ && matchPlan
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Users size={22} className="text-blue-400" />
          Utilisateurs
        </h1>
        <p className="text-white/35 mt-1 text-sm">{users.length} inscrits au total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par email ou nom…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40"
          />
        </div>
        <select
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value)}
          className="bg-[#0d1825] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-brand/40"
        >
          <option value="all">Tous les plans</option>
          <option value="free">Free</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
          <option value="elite">Elite</option>
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
                  {['Utilisateur', 'Inscription', 'Dernière connexion', 'Plan', 'Activité', 'Provenance'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wide font-semibold text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-white/80 truncate max-w-[200px]">{u.email}</div>
                      {u.full_name && <div className="text-xs text-white/35 mt-0.5">{u.full_name}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${PLAN_BADGE[u.plan] || PLAN_BADGE.free}`}>
                        {u.plan}
                      </span>
                      {u.billing_period && (
                        <div className="text-[10px] text-white/25 mt-0.5">{u.billing_period}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-white/25" />
                        <span className="text-sm font-semibold text-white/60">{u.applications_count}</span>
                      </div>
                      {u.last_application_at && (
                        <div className="text-[10px] text-white/25 mt-0.5">
                          dernière le {new Date(u.last_application_at).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.referred_by_coach_name ? (
                        <div>
                          <a
                            href={`https://appobooking.com/${u.referred_by_coach_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-yellow-400/80 hover:text-yellow-400 transition-colors group"
                          >
                            <GraduationCap size={11} className="flex-shrink-0" />
                            <span className="truncate max-w-[130px]">{u.referred_by_coach_name}</span>
                            <ExternalLink size={9} className="flex-shrink-0 text-yellow-400/40 group-hover:text-yellow-400/70 transition-colors" />
                          </a>
                          {u.referred_at && (
                            <div className="text-[10px] text-white/20 mt-0.5 ml-4">
                              réf. le {new Date(u.referred_at).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-white/25">
                          {u.location ? (
                            <span className="flex items-center gap-1">
                              <MapPin size={10} className="text-white/20" />
                              {u.location}
                            </span>
                          ) : (
                            <span>Organique</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/25 text-sm">Aucun utilisateur trouvé</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
