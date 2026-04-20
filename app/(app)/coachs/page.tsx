'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, MapPin, Star, Search, X, ExternalLink, ShieldCheck, ChevronDown, Instagram, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { COUNTRY_FILTER_OPTIONS } from '@/lib/countries'
import { COACH_SERVICES } from '@/lib/coach-services'

const COUNTRY_MAP: Record<string, string> = {
  FR: 'France', BE: 'Belgique', CH: 'Suisse', CA: 'Canada',
  LU: 'Luxembourg', MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie',
  SN: 'Sénégal', CI: "Côte d'Ivoire", CM: 'Cameroun', ES: 'Espagne',
  PT: 'Portugal', IT: 'Italie', DE: 'Allemagne', NL: 'Pays-Bas',
  GB: 'Royaume-Uni', US: 'États-Unis', MR: 'Mauritanie', MG: 'Madagascar',
}

function countryLabel(raw: string | null): string {
  if (!raw) return ''
  const up = raw.toUpperCase().trim()
  return COUNTRY_MAP[up] ?? raw
}

type Coach = {
  slug: string
  display_name: string
  bio: string | null
  bio_en: string | null
  category: string | null
  metier: string | null
  secteur: string | null
  ville: string | null
  pays: string | null
  rating: number
  total_reviews: number
  cover_image_url: string | null
  is_verified: boolean
  accent_color: string | null
  instagram_url: string | null
  linkedin_url: string | null
  users: { avatar_url: string | null } | null
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={size}
          className={cn(s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20 fill-white/20')}
        />
      ))}
    </div>
  )
}

// ─── Coach profile modal ────────────────────────────────────────────────────

function CoachProfileModal({ coach, onClose, onBook }: {
  coach: Coach
  onClose: () => void
  onBook: () => void
}) {
  const avatarUrl = coach.users?.avatar_url
  const accentColor = coach.accent_color ?? '#6C63FF'
  const locationParts = [coach.ville, countryLabel(coach.pays)].filter(Boolean)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full sm:max-w-lg bg-[#0d1520] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Cover */}
          <div className="relative flex-shrink-0">
            <div
              className="h-32 w-full"
              style={{ background: coach.cover_image_url ? undefined : `${accentColor}33` }}
            >
              {coach.cover_image_url && (
                <img src={coach.cover_image_url} alt="" className="w-full h-full object-cover" />
              )}
              {/* gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1520]/80 to-transparent" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all"
            >
              <X size={16} />
            </button>

            {/* Avatar overlapping cover */}
            <div className="absolute -bottom-10 left-5">
              <div
                className="w-20 h-20 rounded-full border-[3px] border-[#0d1520] overflow-hidden flex items-center justify-center shadow-xl"
                style={{ background: avatarUrl ? undefined : `${accentColor}33` }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={coach.display_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold" style={{ color: accentColor }}>
                    {coach.display_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1 pt-14 px-5 pb-6">
            {/* Header info */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-white font-bold text-lg leading-tight">{coach.display_name}</h2>
                  {coach.is_verified && (
                    <span className="flex items-center gap-1 bg-brand/15 text-brand text-[10px] font-medium px-2 py-0.5 rounded-full border border-brand/25 flex-shrink-0">
                      <ShieldCheck size={9} />
                      Vérifié
                    </span>
                  )}
                </div>
                {coach.category && (
                  <p className="text-brand/80 text-sm mt-0.5">{coach.category}</p>
                )}
                {coach.metier && coach.metier.toLowerCase() !== coach.category?.toLowerCase() && (
                  <p className="text-white/45 text-xs mt-0.5">{coach.metier}</p>
                )}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                {coach.instagram_url && (
                  <a
                    href={coach.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] text-white/50 hover:text-white/80 transition-all"
                  >
                    <Instagram size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Location */}
            {locationParts.length > 0 && (
              <div className="flex items-center gap-1.5 text-white/40 text-xs mt-2">
                <MapPin size={11} />
                <span>{locationParts.join(' · ')}</span>
              </div>
            )}

            {/* Rating */}
            {coach.total_reviews > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <StarRating rating={coach.rating} size={13} />
                <span className="text-yellow-400 text-sm font-semibold">{Number(coach.rating).toFixed(1)}</span>
                <span className="text-white/35 text-xs">· {coach.total_reviews} avis</span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/[0.06] my-4" />

            {/* Bio */}
            {coach.bio && (
              <div className="mb-4">
                <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">À propos</h3>
                <p className="text-white/75 text-sm leading-relaxed whitespace-pre-line">{coach.bio}</p>
              </div>
            )}

            {coach.bio_en && coach.bio_en !== coach.bio && (
              <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-1.5">🇬🇧 English</p>
                <p className="text-white/55 text-xs leading-relaxed">{coach.bio_en}</p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/[0.06] my-4" />

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <Button className="w-full gap-2" onClick={onBook}>
                <Calendar size={14} />
                Réserver une séance
              </Button>
              <a
                href={`https://appobooking.com/${coach.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="secondary" size="sm" className="w-full gap-1.5 text-white/50">
                  <ExternalLink size={12} />
                  Voir le profil complet sur Appo
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Coach card ─────────────────────────────────────────────────────────────

function CoachCard({ coach, onViewProfile, onBook }: {
  coach: Coach
  onViewProfile: () => void
  onBook: () => void
}) {
  const locationParts = [coach.ville, countryLabel(coach.pays)].filter(Boolean)
  const avatarUrl = coach.users?.avatar_url
  const accentColor = coach.accent_color ?? '#6C63FF'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group"
      onClick={onViewProfile}
    >
      {/* Cover + avatar overlay */}
      <div className="relative">
        <div
          className="h-20 w-full flex-shrink-0"
          style={{ background: coach.cover_image_url ? undefined : `${accentColor}33` }}
        >
          {coach.cover_image_url && (
            <img src={coach.cover_image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile avatar */}
        <div className="absolute -bottom-7 left-4">
          <div
            className="w-14 h-14 rounded-full border-2 border-[#0d1520] flex items-center justify-center overflow-hidden"
            style={{ background: avatarUrl ? undefined : `${accentColor}33` }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={coach.display_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold" style={{ color: accentColor }}>
                {coach.display_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {coach.is_verified && (
          <div className="absolute top-2 right-2 bg-brand/90 rounded-full p-1">
            <ShieldCheck size={11} className="text-black" />
          </div>
        )}
      </div>

      <div className="pt-10 px-4 pb-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-brand/90 transition-colors">{coach.display_name}</h3>

        {coach.category && (
          <p className="text-brand/80 text-xs mt-0.5 truncate">{coach.category}</p>
        )}
        {coach.metier && coach.metier.toLowerCase() !== coach.category?.toLowerCase() && (
          <p className="text-white/40 text-xs truncate">{coach.metier}</p>
        )}

        {coach.total_reviews > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <StarRating rating={coach.rating} />
            <span className="text-yellow-400 text-xs font-medium ml-0.5">{Number(coach.rating).toFixed(1)}</span>
            <span className="text-white/30 text-xs">· {coach.total_reviews} avis</span>
          </div>
        )}

        {locationParts.length > 0 && (
          <div className="flex items-center gap-1 text-white/35 text-xs mt-1.5">
            <MapPin size={10} />
            <span className="truncate">{locationParts.join(' · ')}</span>
          </div>
        )}

        {coach.bio && (
          <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mt-3 flex-1">{coach.bio}</p>
        )}

        <Button
          size="sm"
          className="w-full mt-4"
          onClick={e => { e.stopPropagation(); onBook() }}
        >
          Réserver une séance
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Booking modal (iframe) ──────────────────────────────────────────────────

function BookingModal({ slug, name, onClose }: { slug: string; name: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col bg-[#060c16]/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col w-full h-full max-w-2xl mx-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
            <div>
              <p className="text-white font-semibold text-sm">{name}</p>
              <p className="text-white/40 text-xs">Réserver une séance</p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://appobooking.com/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/40 hover:text-white/70 text-xs transition-colors"
              >
                <ExternalLink size={13} />
                Ouvrir dans Appo
              </a>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <iframe
              src={`https://appobooking.com/widget/${slug}`}
              className="w-full h-full border-0"
              title={`Réserver avec ${name}`}
              allow="payment"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CoachsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ville, setVille] = useState('')
  const [pays, setPays] = useState('')
  const [service, setService] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [profile, setProfile] = useState<Coach | null>(null)
  const [booking, setBooking] = useState<{ slug: string; name: string } | null>(null)
  const loadCoaches = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (ville) params.set('ville', ville)
    if (pays) params.set('pays', pays)
    if (search) params.set('search', search)
    if (service) params.set('service', service)

    const res = await fetch(`/api/coaches?${params}`)
    if (res.ok) setCoaches(await res.json())
    setLoading(false)
  }, [ville, pays, search, service])

  useEffect(() => { loadCoaches() }, [loadCoaches])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadCoaches()
  }

  function openBooking(slug: string, name: string) {
    setProfile(null)
    setBooking({ slug, name })
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-brand/10 border border-brand/20">
              <GraduationCap size={18} className="text-brand" />
            </div>
            <h1 className="text-white text-xl font-bold">Coachs & Professionnels</h1>
          </div>
          <p className="text-white/45 text-sm">
            Des experts pour vous aider à décrocher votre prochain emploi
          </p>
        </div>
        <a href="https://appobooking.com/register" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="secondary" className="gap-2 hidden sm:flex">
            <ExternalLink size={13} />
            Devenir coach
          </Button>
        </a>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors md:hidden w-full"
          >
            <Search size={14} />
            Filtres de recherche
            <ChevronDown size={14} className={cn('ml-auto transition-transform', showFilters && 'rotate-180')} />
          </button>

          <form
            onSubmit={handleSearch}
            className={cn('gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', showFilters ? 'mt-3 grid' : 'hidden md:grid')}
          >
            <Input
              placeholder="Nom, spécialité..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={service}
              onChange={e => setService(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] text-white/70 text-sm focus:outline-none focus:border-brand/50 transition-all"
              style={{ backgroundColor: '#0d1520', colorScheme: 'dark' }}
            >
              <option value="">Tous les services</option>
              {COACH_SERVICES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <Input
              placeholder="Ville (ex: Paris, Namur...)"
              value={ville}
              onChange={e => setVille(e.target.value)}
            />
            <select
              value={pays}
              onChange={e => setPays(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] text-white/70 text-sm focus:outline-none focus:border-brand/50 transition-all"
              style={{ backgroundColor: '#0d1520', colorScheme: 'dark' }}
            >
              <option value="">Tous les pays</option>
              {COUNTRY_FILTER_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </form>
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          <span className="ml-3 text-white/45 text-sm">Chargement...</span>
        </div>
      ) : coaches.length === 0 ? (
        (search || ville || pays || service) ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 mb-5">
              <GraduationCap size={28} className="text-brand/60" />
            </div>
            <h3 className="text-white/80 font-semibold text-base mb-2">
              Aucun coach disponible dans cette zone pour l&apos;instant
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-6">
              Nos équipes sélectionnent activement les meilleurs profils selon vos critères.
              En attendant, nos coachs en visioconférence sont disponibles dès maintenant pour vous accompagner.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="gap-2"
              onClick={() => { setVille(''); setPays(''); setSearch(''); setService('') }}
            >
              Voir les coachs à distance
            </Button>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <GraduationCap size={40} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/45 text-sm">Aucun coach disponible pour le moment</p>
          </div>
        )
      ) : (
        <>
          <p className="text-white/35 text-xs mb-4">
            {coaches.length} professionnel{coaches.length > 1 ? 's' : ''} disponible{coaches.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map(coach => (
              <CoachCard
                key={coach.slug}
                coach={coach}
                onViewProfile={() => setProfile(coach)}
                onBook={() => openBooking(coach.slug, coach.display_name)}
              />
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 rounded-2xl border border-brand/20 bg-brand/[0.04] p-6 text-center"
      >
        <GraduationCap size={28} className="text-brand mx-auto mb-3" />
        <h3 className="text-white font-semibold mb-1">Vous êtes coach ou professionnel ?</h3>
        <p className="text-white/50 text-sm mb-4">
          Créez votre profil sur Appo et apparaissez automatiquement ici.
        </p>
        <a href="https://appobooking.com/register" target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="secondary" className="gap-2">
            <ExternalLink size={13} />
            Créer mon profil sur Appo
          </Button>
        </a>
      </motion.div>

      {/* Coach profile modal */}
      {profile && !booking && (
        <CoachProfileModal
          coach={profile}
          onClose={() => setProfile(null)}
          onBook={() => openBooking(profile.slug, profile.display_name)}
        />
      )}

      {/* Booking modal */}
      {booking && (
        <BookingModal
          slug={booking.slug}
          name={booking.name}
          onClose={() => setBooking(null)}
        />
      )}
    </div>
  )
}
