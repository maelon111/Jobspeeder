'use client'
import { useEffect, useState } from 'react'
import { GraduationCap, CheckCircle, XCircle, Clock, Search, Star, ExternalLink } from 'lucide-react'

type Coach = {
  slug: string
  name: string
  email: string | null
  avatar_url: string | null
  category: string | null
  city: string | null
  country: string | null
  rating: number
  total_reviews: number
  is_verified: boolean
  bio: string | null
  status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  synced: boolean
  created_at: string
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  approved: 'bg-brand/15 text-brand border-brand/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  rejected: 'Rejeté',
}

export default function AdminCoachesPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/coaches')
      .then(r => r.json())
      .then(d => { setCoaches(d.coaches || []); setLoading(false) })
  }, [])

  async function updateCoach(coach: Coach, patch: { status?: string; is_active?: boolean }) {
    setUpdating(coach.slug)
    await fetch('/api/admin/coaches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: coach.slug,
        name: coach.name,
        email: coach.email ?? coach.slug + '@appo.coach',
        ...patch,
      }),
    })
    setCoaches(prev => prev.map(c => c.slug === coach.slug ? { ...c, ...patch } as Coach : c))
    setUpdating(null)
  }

  const filtered = coaches.filter(c => {
    const q = search.toLowerCase()
    const matchQ = !q || c.name.toLowerCase().includes(q) || (c.email?.toLowerCase() ?? '').includes(q)
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    return matchQ && matchStatus
  })

  const pending = coaches.filter(c => c.status === 'pending').length

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <GraduationCap size={22} className="text-yellow-400" />
          Coachs carrière
        </h1>
        <p className="text-white/35 mt-1 text-sm">
          {coaches.length} coachs depuis APPO
          {pending > 0 && <> · <span className="text-yellow-400 font-semibold">{pending} en attente de validation</span></>}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un coach…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-[#0d1825] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-brand/40"
        >
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvés</option>
          <option value="rejected">Rejetés</option>
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
                  {['Coach', 'Catégorie', 'Localisation', 'Note', 'Statut', 'Actif', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wide font-semibold text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(c => (
                  <tr key={c.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {c.avatar_url ? (
                          <img src={c.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover opacity-80" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40 font-bold">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://appobooking.com/${c.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-white/80 hover:text-brand transition-colors flex items-center gap-1 group"
                            >
                              {c.name}
                              <ExternalLink size={10} className="text-white/25 group-hover:text-brand/60 transition-colors" />
                            </a>
                            {c.is_verified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-brand/20 flex items-center justify-center">
                                <CheckCircle size={9} className="text-brand" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/35">{c.email ?? c.slug}</div>
                          {c.bio && (
                            <div className="text-[10px] text-white/20 mt-0.5 max-w-[220px] truncate" title={c.bio}>
                              {c.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/40">{c.category ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-white/40">
                      {[c.city, c.country].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-yellow-400 fill-current" />
                          <span className="text-xs text-white/60">{c.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-white/25">({c.total_reviews})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/25">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_BADGE[c.status]}`}>
                        {c.status === 'pending' && <Clock size={10} />}
                        {c.status === 'approved' && <CheckCircle size={10} />}
                        {c.status === 'rejected' && <XCircle size={10} />}
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateCoach(c, { is_active: !c.is_active })}
                        disabled={updating === c.slug}
                        className={`w-8 h-4.5 rounded-full transition-all relative ${c.is_active ? 'bg-brand' : 'bg-white/10'}`}
                      >
                        <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${c.is_active ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {c.status !== 'approved' && (
                          <button
                            onClick={() => updateCoach(c, { status: 'approved', is_active: true })}
                            disabled={updating === c.slug}
                            className="px-2.5 py-1 bg-brand/15 hover:bg-brand/25 text-brand border border-brand/20 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50"
                          >
                            Approuver
                          </button>
                        )}
                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => updateCoach(c, { status: 'rejected', is_active: false })}
                            disabled={updating === c.slug}
                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50"
                          >
                            Rejeter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-white/25 text-sm">Aucun coach trouvé</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
