'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Clock, CheckCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Commission = {
  id: string
  coachee_name: string
  plan: string
  billing_period: string
  amount_cents: number
  commission_cents: number
  status: 'pending' | 'paid'
  source: 'referral' | 'promo_code'
  period_month: string
  created_at: string
}

type MonthSummary = {
  month: string
  total_cents: number
  count: number
  paid_cents: number
}

function formatEuros(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

function formatMonth(m: string) {
  const [year, month] = m.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const PLAN_COLORS: Record<string, string> = {
  free: 'text-white/40',
  gold: 'text-yellow-400',
  platinum: 'text-sky-400',
  elite: 'text-purple-400',
}

export default function EarningsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [byMonth, setByMonth] = useState<MonthSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/coach/earnings')
      .then(r => r.ok ? r.json() : { commissions: [], by_month: [] })
      .then(data => {
        setCommissions(data.commissions || [])
        setByMonth(data.by_month || [])
        setLoading(false)
      })
  }, [])

  const totalCents = byMonth.reduce((s, m) => s + m.total_cents, 0)
  const pendingCents = commissions.filter(c => c.status === 'pending').reduce((s, c) => s + c.commission_cents, 0)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const thisMonthCents = byMonth.find(m => m.month === currentMonth)?.total_cents ?? 0

  const filtered = selectedMonth
    ? commissions.filter(c => c.period_month === selectedMonth)
    : commissions

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Wallet size={18} className="text-emerald-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Revenus & commissions</h1>
        </div>
        <p className="text-white/40 text-sm mt-1">Historique de vos gains par parrainage</p>
      </motion.div>

      {/* Totaux */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total gagné', value: formatEuros(totalCents), icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Ce mois', value: formatEuros(thisMonthCents), icon: Wallet, color: 'text-brand bg-brand/10' },
          { label: 'En attente', value: formatEuros(pendingCents), icon: Clock, color: 'text-orange-400 bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
          >
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2', color)}>
              <Icon size={15} />
            </div>
            <div className="text-white font-black text-lg">{value}</div>
            <div className="text-white/40 text-xs mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-20">
          <Wallet size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/45 text-sm">Aucune commission pour l&apos;instant</p>
          <p className="text-white/30 text-xs mt-1">Partagez votre lien de parrainage pour commencer à gagner</p>
        </div>
      ) : (
        <>
          {/* Filtre par mois */}
          {byMonth.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-5">
              <button
                onClick={() => setSelectedMonth(null)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg border transition-all',
                  !selectedMonth
                    ? 'bg-brand/15 border-brand/30 text-brand'
                    : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/70'
                )}
              >
                Tout
              </button>
              {byMonth.map(m => (
                <button
                  key={m.month}
                  onClick={() => setSelectedMonth(m.month)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-lg border transition-all',
                    selectedMonth === m.month
                      ? 'bg-brand/15 border-brand/30 text-brand'
                      : 'bg-white/[0.03] border-white/[0.08] text-white/40 hover:text-white/70'
                  )}
                >
                  {formatMonth(m.month)} · {formatEuros(m.total_cents)}
                </button>
              ))}
            </div>
          )}

          {/* Liste commissions */}
          <div className="space-y-3">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4"
              >
                {/* Statut */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  c.status === 'paid' ? 'bg-emerald-500/10' : 'bg-orange-500/10'
                )}>
                  {c.status === 'paid'
                    ? <CheckCircle size={15} className="text-emerald-400" />
                    : <Clock size={15} className="text-orange-400" />
                  }
                </div>

                {/* Détails */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">{c.coachee_name}</span>
                    <span className={cn('text-xs font-medium capitalize', PLAN_COLORS[c.plan] || 'text-white/50')}>
                      {c.plan} {c.billing_period === 'annual' ? '(annuel)' : '(mensuel)'}
                    </span>
                    {c.source === 'promo_code' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400">
                        code promo
                      </span>
                    )}
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">{formatMonth(c.period_month)}</p>
                </div>

                {/* Montant */}
                <div className="text-right flex-shrink-0">
                  <div className="text-emerald-400 font-black text-base">
                    +{formatEuros(c.commission_cents)}
                  </div>
                  <div className="text-white/25 text-xs">
                    sur {formatEuros(c.amount_cents)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
