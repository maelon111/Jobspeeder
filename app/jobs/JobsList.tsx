'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Briefcase, Clock, Building2, CheckSquare, Square, Send, Search, X, ChevronRight } from 'lucide-react'
import type { PublicJob } from '@/lib/jobs-db'
import { createClient } from '@/lib/supabase/client'

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function CompanyLogo({ job }: { job: PublicJob }) {
  const initials = job.employeur
    .split(' ')
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-gray-300">{initials}</span>
    </div>
  )
}

interface JobsListProps {
  jobs: PublicJob[]
}

const JOBS_PER_PAGE = 20

export default function JobsList({ jobs }: JobsListProps) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMetier, setFilterMetier] = useState('')
  const [filterLieu, setFilterLieu] = useState('')

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const search = searchTerm.toLowerCase()
      const metier = filterMetier.toLowerCase()
      const lieu = filterLieu.toLowerCase()

      return (
        (!search || job.titre.toLowerCase().includes(search) || job.employeur.toLowerCase().includes(search)) &&
        (!metier || job.metier?.toLowerCase().includes(metier)) &&
        (!lieu || job.localisation?.toLowerCase().includes(lieu))
      )
    })
  }, [jobs, searchTerm, filterMetier, filterLieu])

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE
    return filteredJobs.slice(start, start + JOBS_PER_PAGE)
  }, [filteredJobs, currentPage])

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)

  const toggleJob = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(paginatedJobs.map((j) => j.id)))
  }, [paginatedJobs])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const allSelected = selectedIds.size === paginatedJobs.length && paginatedJobs.length > 0
  const resetFilters = () => {
    setSearchTerm('')
    setFilterMetier('')
    setFilterLieu('')
    setCurrentPage(1)
  }

  const handleSendCandidature = useCallback(async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push('/login')
      return
    }

    const selectedJobs = jobs
      .filter((j) => selectedIds.has(j.id))
      .map((j) => ({
        id: j.id,
        titre: j.titre,
        employeur: j.employeur,
        lien_candidature: j.lien_candidature,
        localisation: j.localisation,
        type_contrat: j.type_contrat,
      }))

    setLoading(true)
    try {
      const res = await fetch('/api/campaign/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'forem_jobs', jobs: selectedJobs }),
      })
      if (!res.ok) throw new Error('Erreur lors de l\'envoi')
      setSelectedIds(new Set())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [jobs, selectedIds, router])

  return (
    <div className="relative">
      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Titre, entreprise..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-brand focus:outline-none text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Métier..."
            value={filterMetier}
            onChange={(e) => { setFilterMetier(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-brand focus:outline-none text-sm"
          />
          <input
            type="text"
            placeholder="Ville/Région..."
            value={filterLieu}
            onChange={(e) => { setFilterLieu(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-brand focus:outline-none text-sm"
          />
        </div>
        {(searchTerm || filterMetier || filterLieu) && (
          <button
            onClick={resetFilters}
            className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Réinitialiser filtres
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={allSelected ? deselectAll : selectAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-600 hover:text-white transition-colors"
          >
            {allSelected ? (
              <>
                <Square className="w-4 h-4" />
                Tout désélectionner
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                Tout sélectionner
              </>
            )}
          </button>
        </div>

        {selectedIds.size > 0 && (
          <span className="text-sm text-gray-400">
            {selectedIds.size} offre{selectedIds.size > 1 ? 's' : ''} sélectionnée{selectedIds.size > 1 ? 's' : ''}
          </span>
        )}

        <span className="text-xs text-gray-500 ml-auto">
          {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Job list */}
      <div className="space-y-4 pb-28">
        {paginatedJobs.map((job) => {
          const isSelected = selectedIds.has(job.id)

          return (
            <div key={job.id} className="relative group">
              <button
                onClick={() => toggleJob(job.id)}
                className="absolute left-4 top-5 z-10 w-5 h-5 flex items-center justify-center"
                aria-label={isSelected ? 'Désélectionner' : 'Sélectionner'}
              >
                {isSelected ? (
                  <CheckSquare className="w-5 h-5 text-brand" />
                ) : (
                  <Square className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                )}
              </button>

              <div
                className={`block bg-gray-900 border rounded-xl p-5 pl-14 transition-colors ${
                  isSelected
                    ? 'border-brand/60 bg-brand/5'
                    : 'border-gray-800 hover:border-brand/50 hover:bg-gray-900/80'
                }`}
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <CompanyLogo job={job} />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white text-lg leading-tight mb-1">
                        {job.titre}
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        {job.employeur && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.employeur}
                          </span>
                        )}
                        {job.localisation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.localisation}
                          </span>
                        )}
                        {job.type_contrat && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.type_contrat}
                          </span>
                        )}
                        {job.date_publication && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(job.date_publication)}
                          </span>
                        )}
                      </div>
                      {job.metier && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                          {job.metier}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 hover:border-brand hover:text-brand text-gray-400 transition-colors ml-4"
                    aria-label="Voir les détails"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 py-20">Aucune offre ne correspond à vos critères.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-32">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                currentPage === page
                  ? 'bg-brand text-gray-950 font-semibold'
                  : 'border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Sticky bottom bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">{selectedIds.size}</span>{' '}
              offre{selectedIds.size > 1 ? 's' : ''} sélectionnée{selectedIds.size > 1 ? 's' : ''}
            </p>
            <button
              onClick={handleSendCandidature}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-brand text-gray-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Envoi en cours…' : 'Envoyer ma candidature'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
