'use client'
import { useEffect, useState, useMemo } from 'react'
import { Activity, Search, CheckCircle, XCircle, AlertTriangle, Lock, ExternalLink, ChevronDown, Cpu } from 'lucide-react'

type FillAttempt = {
  id: string
  created_at: string
  timestamp: string
  job_url: string | null
  page_title: string | null
  form_signature: string | null
  status: string
  fields_mapped: number
  fields_map: Record<string, string> | null
  missing_fields: string[] | null
  validation_errors: string[] | null
  ia_used: string | null
  fill_duration_ms: number | null
  ats_type: string | null
  domain: string | null
  step_count: number | null
  failure_reason: string | null
  total_fields_detected: number | null
}

type Stats = {
  total: number
  byStatus: Record<string, number>
  byDomain: Record<string, number>
  avgFieldsMapped: number
  avgDurationMs: number
  withAI: number
  topMissingFields: { field: string; count: number }[]
}

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: typeof CheckCircle; color: string }> = {
  SUCCESS:          { label: 'Succès',           badge: 'bg-green-500/15 text-green-400 border-green-500/20',    icon: CheckCircle,   color: 'text-green-400' },
  DEAD_END:         { label: 'Dead End',          badge: 'bg-red-500/15 text-red-400 border-red-500/20',          icon: XCircle,       color: 'text-red-400' },
  VALIDATION_ERROR: { label: 'Erreur validation', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', icon: AlertTriangle,  color: 'text-yellow-400' },
  AUTH_REQUIRED:    { label: 'Auth requise',       badge: 'bg-purple-500/15 text-purple-400 border-purple-500/20', icon: Lock,          color: 'text-purple-400' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, badge: 'bg-white/5 text-white/40 border-white/10', icon: Activity, color: 'text-white/40' }
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.badge}`}>
      <Icon size={9} />
      {cfg.label}
    </span>
  )
}

function AtsBadge({ type }: { type: string | null }) {
  if (!type) return <span className="text-white/20 text-xs">—</span>
  const colors: Record<string, string> = {
    lever: 'bg-orange-500/10 text-orange-400/80',
    greenhouse: 'bg-green-500/10 text-green-400/80',
    workday: 'bg-blue-500/10 text-blue-400/80',
    direct: 'bg-white/5 text-white/40',
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[type] ?? 'bg-white/5 text-white/35'}`}>
      {type}
    </span>
  )
}

function RowDetail({ row }: { row: FillAttempt }) {
  const [open, setOpen] = useState(false)
  const hasDetail = (row.fields_map && Object.keys(row.fields_map).length > 0) ||
                    (row.missing_fields && row.missing_fields.length > 0) ||
                    (row.validation_errors && row.validation_errors.length > 0)

  return (
    <>
      <tr
        className={`border-b border-white/[0.04] ${hasDetail ? 'cursor-pointer hover:bg-white/[0.02]' : ''} transition-colors`}
        onClick={() => hasDetail && setOpen(v => !v)}
      >
        <td className="px-3 py-2.5 text-xs text-white/35 whitespace-nowrap">
          {new Date(row.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </td>
        <td className="px-3 py-2.5 text-xs text-white/55 max-w-[140px] truncate" title={row.domain ?? ''}>
          {row.domain ?? '—'}
        </td>
        <td className="px-3 py-2.5">
          <StatusBadge status={row.status} />
        </td>
        <td className="px-3 py-2.5 text-xs font-mono text-white/50 whitespace-nowrap">
          {row.fields_mapped ?? 0} champs
        </td>
        <td className="px-3 py-2.5">
          <AtsBadge type={row.ats_type} />
        </td>
        <td className="px-3 py-2.5 text-xs text-white/40 whitespace-nowrap">
          {row.ia_used ? (
            <span className="flex items-center gap-1">
              <Cpu size={10} className="text-brand/60" />
              {row.ia_used.replace('gemini-', 'gem-').replace('-preview', '')}
            </span>
          ) : <span className="text-white/20">direct</span>}
        </td>
        <td className="px-3 py-2.5 text-xs text-white/35 whitespace-nowrap">
          {row.fill_duration_ms != null ? `${(row.fill_duration_ms / 1000).toFixed(1)}s` : '—'}
        </td>
        <td className="px-3 py-2.5 text-xs text-white/35 font-mono max-w-[120px] truncate" title={row.form_signature ?? ''}>
          {row.form_signature ?? '—'}
        </td>
        <td className="px-3 py-2.5 max-w-[200px] truncate text-xs text-white/40" title={row.page_title ?? ''}>
          {row.page_title ?? '—'}
        </td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            {row.job_url && (
              <a href={row.job_url} target="_blank" rel="noopener noreferrer"
                className="p-1 rounded hover:bg-white/[0.06] text-white/20 hover:text-white/60 transition-colors inline-flex"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink size={11} />
              </a>
            )}
            {hasDetail && (
              <ChevronDown size={13} className={`text-white/25 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
            )}
          </div>
        </td>
      </tr>
      {open && hasDetail && (
        <tr className="bg-white/[0.015] border-b border-white/[0.04]">
          <td colSpan={10} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {row.fields_map && Object.keys(row.fields_map).length > 0 && (
                <div>
                  <p className="text-white/25 uppercase tracking-widest text-[10px] font-semibold mb-2">Champs remplis</p>
                  <div className="space-y-1">
                    {Object.entries(row.fields_map).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-white/35 w-28 shrink-0 truncate">{k}</span>
                        <span className="text-white/60 truncate">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {row.missing_fields && row.missing_fields.length > 0 && (
                <div>
                  <p className="text-white/25 uppercase tracking-widest text-[10px] font-semibold mb-2">Champs manquants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.missing_fields.map(f => (
                      <span key={f} className="px-2 py-0.5 rounded bg-red-500/10 text-red-400/80 border border-red-500/15 text-[11px]">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {row.validation_errors && row.validation_errors.length > 0 && (
                <div>
                  <p className="text-white/25 uppercase tracking-widest text-[10px] font-semibold mb-2">Erreurs validation</p>
                  <div className="space-y-1">
                    {row.validation_errors.map((e, i) => (
                      <p key={i} className="text-yellow-400/70">{e}</p>
                    ))}
                  </div>
                </div>
              )}
              {(row.failure_reason || row.step_count != null || row.total_fields_detected != null) && (
                <div>
                  <p className="text-white/25 uppercase tracking-widest text-[10px] font-semibold mb-2">Diagnostic</p>
                  <div className="space-y-1">
                    {row.failure_reason && (
                      <div className="flex gap-2">
                        <span className="text-white/35 shrink-0">Raison</span>
                        <span className="text-orange-400/80 font-mono text-[11px]">{row.failure_reason}</span>
                      </div>
                    )}
                    {row.step_count != null && (
                      <div className="flex gap-2">
                        <span className="text-white/35 shrink-0">Étapes franchies</span>
                        <span className="text-white/60">{row.step_count}</span>
                      </div>
                    )}
                    {row.total_fields_detected != null && (
                      <div className="flex gap-2">
                        <span className="text-white/35 shrink-0">Champs détectés</span>
                        <span className="text-white/60">{row.total_fields_detected} (remplis : {row.fields_mapped ?? 0})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function FormFillsPage() {
  const [rows, setRows] = useState<FillAttempt[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDomain, setFilterDomain] = useState('all')

  useEffect(() => {
    fetch('/api/admin/form-fills?limit=500')
      .then(r => r.json())
      .then(d => { setRows(d.rows || []); setStats(d.stats || null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const domains = useMemo(() => Array.from(new Set(rows.map(r => r.domain).filter(Boolean))) as string[], [rows])

  const filtered = useMemo(() => rows.filter(r => {
    const q = search.toLowerCase()
    const matchQ = !q || (r.domain ?? '').includes(q) || (r.page_title ?? '').toLowerCase().includes(q)
      || (r.form_signature ?? '').includes(q) || (r.job_url ?? '').includes(q)
    const matchStatus = filterStatus === 'all' || r.status === filterStatus
    const matchDomain = filterDomain === 'all' || r.domain === filterDomain
    return matchQ && matchStatus && matchDomain
  }), [rows, search, filterStatus, filterDomain])

  const successRate = stats ? Math.round(((stats.byStatus['SUCCESS'] ?? 0) / Math.max(stats.total, 1)) * 100) : 0

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-brand/3 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-500/3 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <Activity size={22} className="text-brand" />
          Extension — Tentatives de remplissage
        </h1>
        <p className="text-white/35 mt-1 text-sm">
          Télémétrie de l&apos;extension Chrome · {stats?.total ?? 0} tentatives enregistrées
        </p>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="glass rounded-2xl border border-white/[0.06] px-4 py-3 col-span-1">
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-white/35 text-xs mt-0.5">Total</div>
          </div>
          <div className="glass rounded-2xl border border-green-500/15 px-4 py-3">
            <div className="text-2xl font-black text-green-400">{stats.byStatus['SUCCESS'] ?? 0}</div>
            <div className="text-white/35 text-xs mt-0.5">Succès · {successRate}%</div>
          </div>
          <div className="glass rounded-2xl border border-red-500/15 px-4 py-3">
            <div className="text-2xl font-black text-red-400">{stats.byStatus['DEAD_END'] ?? 0}</div>
            <div className="text-white/35 text-xs mt-0.5">Dead End</div>
          </div>
          <div className="glass rounded-2xl border border-brand/15 px-4 py-3">
            <div className="text-2xl font-black text-brand">{stats.avgFieldsMapped}</div>
            <div className="text-white/35 text-xs mt-0.5">Champs moy.</div>
          </div>
          <div className="glass rounded-2xl border border-white/[0.06] px-4 py-3">
            <div className="text-2xl font-black text-white/60 flex items-baseline gap-1">
              {stats.avgDurationMs > 0 ? (stats.avgDurationMs / 1000).toFixed(1) : '—'}
              <span className="text-sm font-normal text-white/30">s</span>
            </div>
            <div className="text-white/35 text-xs mt-0.5">Durée moy.</div>
          </div>
        </div>
      )}

      {/* Top domains */}
      {stats && Object.keys(stats.byDomain).length > 0 && (
        <div className="glass rounded-2xl border border-white/[0.06] p-5 mb-6">
          <h2 className="font-semibold text-sm text-white mb-3">Domaines</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byDomain)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 12)
              .map(([domain, count]) => {
                const domainSuccess = rows.filter(r => r.domain === domain && r.status === 'SUCCESS').length
                const rate = Math.round((domainSuccess / count) * 100)
                return (
                  <button
                    key={domain}
                    onClick={() => setFilterDomain(d => d === domain ? 'all' : domain)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition-colors ${
                      filterDomain === domain
                        ? 'bg-brand/15 border-brand/30 text-brand'
                        : 'bg-white/[0.04] border-white/[0.07] text-white/55 hover:border-white/20'
                    }`}
                  >
                    <span className="font-medium">{domain}</span>
                    <span className="text-white/30">{count}</span>
                    <span className={rate >= 50 ? 'text-green-400/70' : 'text-red-400/60'}>{rate}%</span>
                  </button>
                )
              })}
          </div>
        </div>
      )}

      {/* Top missing fields — fields the extension couldn't fill, to add to custom_answers */}
      {stats && stats.topMissingFields.length > 0 && (
        <div className="glass rounded-2xl border border-yellow-500/10 p-5 mb-6">
          <h2 className="font-semibold text-sm text-white mb-1">Champs manquants fréquents</h2>
          <p className="text-white/30 text-xs mb-3">À ajouter dans <code className="text-yellow-400/70">custom_answers</code> de l&apos;extension pour améliorer le taux de succès</p>
          <div className="flex flex-wrap gap-2">
            {stats.topMissingFields.map(({ field, count }) => (
              <span
                key={field}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border bg-yellow-500/5 border-yellow-500/15 text-yellow-300/80"
              >
                <span>{field}</span>
                <span className="text-yellow-500/50 font-mono">{count}×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="URL, titre, signature…"
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
        <select
          value={filterDomain}
          onChange={e => setFilterDomain(e.target.value)}
          className="bg-[#0d1825] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-brand/40"
        >
          <option value="all">Tous les domaines</option>
          {domains.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div className="flex items-center text-xs text-white/25 px-2">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Date', 'Domaine', 'Statut', 'Champs', 'ATS', 'IA', 'Durée', 'Signature', 'Titre', ''].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-[10px] uppercase tracking-wide font-semibold text-white/25 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => <RowDetail key={row.id} row={row} />)}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-white/25 text-sm">
                      Aucune tentative trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
