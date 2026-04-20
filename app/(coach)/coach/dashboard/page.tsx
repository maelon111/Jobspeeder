'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Wallet, Zap, Trophy, Copy, Check, ArrowRight, TrendingUp, Tag, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Stats = {
  total_coachees: number
  active_subscribers: number
  total_applications: number
  total_interviews: number
  monthly_earnings_cents: number
  total_earnings_cents: number
  pending_cents: number
  commission_rate: number
}

type Coach = {
  id: string
  name: string
  referral_code: string
  appo_slug: string | null
  commission_rate: number
}

function formatEuros(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType
  label: string
  value: string
  sub?: string
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={17} />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-white/50 text-xs font-medium">{label}</div>
      {sub && <div className="text-white/30 text-xs mt-1">{sub}</div>}
    </motion.div>
  )
}

export default function CoachDashboardPage() {
  const [coach, setCoach] = useState<Coach | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoCopied, setPromoCopied] = useState(false)
  const [promoGenerating, setPromoGenerating] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/coach/me').then(r => r.ok ? r.json() : null),
      fetch('/api/coach/stats').then(r => r.ok ? r.json() : null),
      fetch('/api/coach/promo-code').then(r => r.ok ? r.json() : null),
    ]).then(([coachData, statsData, promoData]) => {
      setCoach(coachData)
      setStats(statsData)
      if (promoData?.promo_code) setPromoCode(promoData.promo_code)
      setLoading(false)
    })
  }, [])

  const referralUrl = coach
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://jobspeeder.online'}/register?ref=${coach.referral_code}`
    : ''

  function copyReferralLink() {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function copyPromoCode() {
    if (!promoCode) return
    navigator.clipboard.writeText(promoCode)
    setPromoCopied(true)
    setTimeout(() => setPromoCopied(false), 2000)
  }

  async function generatePromoCode() {
    setPromoGenerating(true)
    const res = await fetch('/api/coach/promo-code', { method: 'POST' })
    const data = await res.json()
    if (data.promo_code) setPromoCode(data.promo_code)
    setPromoGenerating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Espace Coach</span>
        </div>
        <h1 className="text-white text-2xl font-black">Bonjour{coach ? `, ${coach.name.split(' ')[0]}` : ''} 👋</h1>
        <p className="text-white/40 text-sm mt-1">
          Votre taux de commission : <span className="text-brand font-semibold">{Math.round((coach?.commission_rate || 0.20) * 100)}%</span>
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Coachés inscrits"
          value={String(stats?.total_coachees ?? 0)}
          sub={`${stats?.active_subscribers ?? 0} abonnés actifs`}
          color="bg-blue-500/10 text-blue-400"
        />
        <StatCard
          icon={Wallet}
          label="Revenus ce mois"
          value={formatEuros(stats?.monthly_earnings_cents ?? 0)}
          sub={`${formatEuros(stats?.pending_cents ?? 0)} en attente`}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <StatCard
          icon={Zap}
          label="Candidatures"
          value={String(stats?.total_applications ?? 0)}
          sub="de vos coachés"
          color="bg-brand/10 text-brand"
        />
        <StatCard
          icon={Trophy}
          label="Entretiens"
          value={String(stats?.total_interviews ?? 0)}
          sub={`sur ${stats?.total_applications ?? 0} candidatures`}
          color="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      {/* Lien de parrainage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-brand/20 bg-brand/[0.04] p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-white font-bold text-base mb-1">Votre lien de parrainage</h2>
            <p className="text-white/50 text-sm">
              Partagez ce lien à vos clients. Chaque abonnement rapporte{' '}
              <span className="text-brand font-semibold">{Math.round((coach?.commission_rate || 0.20) * 100)}%</span> de commission.
            </p>
          </div>
          <TrendingUp size={22} className="text-brand flex-shrink-0 mt-1" />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/70 font-mono truncate">
            {referralUrl || '...'}
          </div>
          <button
            onClick={copyReferralLink}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand text-black text-sm font-bold hover:bg-brand/90 transition-all active:scale-95 flex-shrink-0"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>

        {coach?.appo_slug && (
          <p className="text-white/30 text-xs mt-3">
            Profil Appo : appobooking.com/{coach.appo_slug}
          </p>
        )}
      </motion.div>

      {/* Code promo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-6 mb-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-white font-bold text-base mb-1">Votre code promo</h2>
            <p className="text-white/50 text-sm">
              Offrez <span className="text-purple-400 font-semibold">10% de réduction</span> à vos clients
              et gagnez <span className="text-purple-400 font-semibold">10% de commission</span> sur leur abonnement.
            </p>
          </div>
          <Tag size={22} className="text-purple-400 flex-shrink-0 mt-1" />
        </div>

        {promoCode ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-4 py-3 text-base text-white font-mono font-bold tracking-widest">
              {promoCode}
            </div>
            <button
              onClick={copyPromoCode}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-all active:scale-95 flex-shrink-0"
            >
              {promoCopied ? <Check size={15} /> : <Copy size={15} />}
              {promoCopied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        ) : (
          <button
            onClick={generatePromoCode}
            disabled={promoGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600/80 text-white text-sm font-bold hover:bg-purple-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {promoGenerating ? (
              <><Loader2 size={15} className="animate-spin" /> Génération en cours...</>
            ) : (
              <><Tag size={15} /> Générer mon code promo</>
            )}
          </button>
        )}
      </motion.div>

      {/* Raccourcis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/coach/coachees">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Users size={16} className="text-blue-400" />
              </div>
              <ArrowRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="text-white font-semibold text-sm">Mes coachés</div>
            <div className="text-white/40 text-xs mt-0.5">Suivi de l&apos;activité et des abonnements</div>
          </motion.div>
        </Link>

        <Link href="/coach/earnings">
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all p-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Wallet size={16} className="text-emerald-400" />
              </div>
              <ArrowRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <div className="text-white font-semibold text-sm">Revenus & commissions</div>
            <div className="text-white/40 text-xs mt-0.5">
              Total : <span className="text-emerald-400 font-semibold">{formatEuros(stats?.total_earnings_cents ?? 0)}</span>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  )
}
