'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, Briefcase, MapPin, Wifi, FileText, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

type JobOffer = {
  job_id: string | null
  titre: string
  entreprise_nom: string
  localisation: string
  remote: string
  type_contrat: string
  logo_entreprise: string | null
}

const PER_PAGE = 20

export default function JobOffersPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set())

  const fetchJobs = useCallback(async (q: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (q) params.set('search', q)
      const res = await fetch(`/api/available-jobs?${params}`)
      const data = await res.json()
      setJobs(data.jobs || [])
      setTotal(data.total || 0)
    } catch {
      setJobs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs('', 0)
  }, [fetchJobs])

  // Debounced search — reset to page 0
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0)
      setSelected(new Set())
      fetchJobs(search, 0)
    }, 400)
    return () => clearTimeout(t)
  }, [search, fetchJobs])

  const jobKey = (job: JobOffer, idx: number) => job.job_id || `${job.titre}-${idx}`

  const allKeys = jobs.map((j, i) => jobKey(j, i))
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k))
  const someSelected = allKeys.some((k) => selected.has(k))
  const totalPages = Math.ceil(total / PER_PAGE)

  function toggleSelectAll() {
    if (allSelected) {
      const next = new Set(selected)
      allKeys.forEach((k) => next.delete(k))
      setSelected(next)
    } else {
      const next = new Set(selected)
      allKeys.forEach((k) => next.add(k))
      setSelected(next)
    }
  }

  function toggleSelect(key: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function goToPage(p: number) {
    setPage(p)
    fetchJobs(search, p)
  }

  async function handleApply() {
    const selectedJobs = jobs.filter((j, i) => selected.has(jobKey(j, i)))
    if (selectedJobs.length === 0) return
    setApplying(true)
    try {
      await fetch('/api/available-jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs: selectedJobs }),
      })
      setApplySuccess(true)
      setSelected(new Set())
      setTimeout(() => setApplySuccess(false), 4000)
    } catch {
      // silently fail
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-brand/10 rounded-xl">
            <Briefcase size={20} className="text-brand" />
          </div>
          <h1 className="text-xl font-semibold text-white">Offres d&apos;emploi</h1>
        </div>
        <p className="text-white/45 text-sm ml-[52px]">
          Sélectionnez les offres qui vous intéressent et postulez en un clic.
        </p>
      </motion.div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre, entreprise, localisation…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand/40 transition-colors"
          />
        </div>
        <button
          onClick={() => fetchJobs(search, page)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.08] text-white/45 hover:text-white/80 hover:bg-white/[0.04] transition-all text-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Apply bar */}
      {someSelected && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 mb-5"
        >
          <span className="text-sm text-white/70">
            <span className="text-brand font-semibold">{selected.size}</span>{' '}
            offre{selected.size > 1 ? 's' : ''} sélectionnée{selected.size > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-white/40 hover:text-white/70 transition-colors px-2"
            >
              Tout désélectionner
            </button>
            <Button variant="primary" size="sm" onClick={handleApply} disabled={applying}>
              {applying ? 'Envoi…' : 'Postuler aux offres sélectionnées'}
            </Button>
          </div>
        </motion.div>
      )}

      {applySuccess && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-5 text-sm text-green-400"
        >
          Candidatures envoyées avec succès !
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[40px_48px_1fr_1fr_140px_120px_120px] gap-2 px-4 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-wider">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleSelectAll}
              className="text-white/30 hover:text-brand transition-colors"
              title={allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
            >
              {allSelected
                ? <CheckSquare size={16} className="text-brand" />
                : <Square size={16} />
              }
            </button>
          </div>
          <div />
          <div>Titre</div>
          <div>Entreprise</div>
          <div>Localisation</div>
          <div>Remote</div>
          <div>Contrat</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3 text-white/25">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-white/25">
            <Briefcase size={24} />
            <span className="text-sm">Aucune offre disponible</span>
          </div>
        ) : (
          <div>
            {jobs.map((job, i) => {
              const key = jobKey(job, i)
              const isSelected = selected.has(key)
              const logoFailed = logoErrors.has(key)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => toggleSelect(key)}
                  className={`grid grid-cols-[40px_48px_1fr_1fr_140px_120px_120px] gap-2 px-4 py-3.5 border-b border-white/[0.04] last:border-0 cursor-pointer transition-colors ${
                    isSelected ? 'bg-brand/[0.06]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleSelect(key)} className="text-white/30 hover:text-brand transition-colors">
                      {isSelected
                        ? <CheckSquare size={16} className="text-brand" />
                        : <Square size={16} />
                      }
                    </button>
                  </div>

                  {/* Logo */}
                  <div className="flex items-center">
                    {job.logo_entreprise && !logoFailed ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0 relative">
                        <Image
                          src={job.logo_entreprise}
                          alt={job.entreprise_nom}
                          fill
                          className="object-contain p-0.5"
                          onError={() => setLogoErrors((prev) => { const n = new Set(prev); n.add(key); return n })}
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                        <Briefcase size={13} className="text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Titre */}
                  <div className="flex items-center min-w-0">
                    <span className="text-sm text-white font-medium truncate">{job.titre}</span>
                  </div>

                  {/* Entreprise */}
                  <div className="flex items-center min-w-0">
                    <span className="text-sm text-white/60 truncate">{job.entreprise_nom}</span>
                  </div>

                  {/* Localisation */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {job.localisation && (
                      <>
                        <MapPin size={12} className="text-white/25 flex-shrink-0" />
                        <span className="text-sm text-white/50 truncate">{job.localisation}</span>
                      </>
                    )}
                  </div>

                  {/* Remote */}
                  <div className="flex items-center gap-1.5">
                    {job.remote && (
                      <>
                        <Wifi size={12} className="text-white/25 flex-shrink-0" />
                        <span className="text-sm text-white/50 truncate">{job.remote}</span>
                      </>
                    )}
                  </div>

                  {/* Type contrat */}
                  <div className="flex items-center">
                    {job.type_contrat && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/50 border border-white/[0.08]">
                        <FileText size={10} />
                        {job.type_contrat}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-white/30">
            {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} sur {total} offre{total > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/80 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter((i) => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
              .reduce<(number | '...')[]>((acc, i, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (i as number) - (arr[idx - 1] as number) > 1) {
                  acc.push('...')
                }
                acc.push(i)
                return acc
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="text-white/25 text-xs px-1">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === item
                        ? 'bg-brand text-black'
                        : 'border border-white/[0.08] text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                  >
                    {(item as number) + 1}
                  </button>
                )
              )}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/80 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {!loading && total > 0 && totalPages <= 1 && (
        <p className="text-center text-xs text-white/25 mt-4">
          {total} offre{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
