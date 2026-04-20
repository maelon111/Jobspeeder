'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Upload, FileText, X, CheckCircle2, XCircle,
  AlertCircle, Copy, Check, ChevronDown, ChevronUp, Loader2, ArrowRight, Zap, Crown, Star
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionTip = { section: string; tip: string; status: 'ok' | 'warn' | 'missing' }
type Rewrite = { original: string; improved: string; reason: string }

type ATSResult = {
  ats_score: number
  label?: string
  keywords_found?: string[]
  keywords_missing?: string[]
  section_tips?: SectionTip[]
  rewrites?: Rewrite[]
  summary?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 75) return { text: 'text-emerald-400', bg: 'bg-emerald-500', bar: 'bg-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_24px_rgba(52,211,153,0.15)]' }
  if (score >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-500', bar: 'bg-yellow-400', border: 'border-yellow-500/30', glow: 'shadow-[0_0_24px_rgba(234,179,8,0.12)]' }
  return { text: 'text-red-400', bg: 'bg-red-500', bar: 'bg-red-400', border: 'border-red-500/30', glow: 'shadow-[0_0_24px_rgba(239,68,68,0.12)]' }
}

function scoreLabel(score: number) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Moyen'
  return 'Faible'
}

const LOADING_STEPS = [
  'Extraction du contenu du CV...',
  'Analyse des mots-clés de l\'offre...',
  'Comparaison sémantique...',
  'Génération des recommandations...',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
      title="Copier"
    >
      {copied ? <Check size={13} className="text-brand" /> : <Copy size={13} />}
    </button>
  )
}

function ScoreGauge({ score }: { score: number }) {
  const c = scoreColor(score)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('rounded-2xl border p-6 text-center', c.border, c.glow, 'bg-white/[0.02]')}
    >
      <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">Score ATS global</p>
      <div className={cn('text-6xl font-black mb-1', c.text)}>
        {score}<span className="text-3xl">%</span>
      </div>
      <p className={cn('text-sm font-bold mb-4', c.text)}>{scoreLabel(score)}</p>
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', c.bar)}
        />
      </div>
    </motion.div>
  )
}

function KeywordPills({ keywords, type }: { keywords?: string[]; type: 'found' | 'missing' }) {
  const isFound = type === 'found'
  const list = keywords ?? []
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {isFound
          ? <CheckCircle2 size={14} className="text-emerald-400" />
          : <XCircle size={14} className="text-red-400" />}
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          {isFound ? `Présents (${list.length})` : `Manquants — le GAP (${list.length})`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((kw) => (
          <span
            key={kw}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium border',
              isFound
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            )}
          >
            {isFound ? '✓' : '✗'} {kw}
          </span>
        ))}
        {list.length === 0 && (
          <span className="text-white/25 text-xs italic">Aucun</span>
        )}
      </div>
    </div>
  )
}

function SectionTips({ tips }: { tips: SectionTip[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const icons = {
    ok: <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />,
    warn: <AlertCircle size={14} className="text-yellow-400 flex-shrink-0" />,
    missing: <XCircle size={14} className="text-red-400 flex-shrink-0" />,
  }
  return (
    <div className="space-y-2">
      {tips.map((t) => (
        <div key={t.section} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <button
            onClick={() => setOpen(open === t.section ? null : t.section)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
          >
            {icons[t.status]}
            <span className="text-white/80 text-sm font-medium flex-1 capitalize">{t.section}</span>
            {open === t.section
              ? <ChevronUp size={14} className="text-white/30" />
              : <ChevronDown size={14} className="text-white/30" />}
          </button>
          <AnimatePresence>
            {open === t.section && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <p className="text-white/50 text-sm leading-relaxed border-t border-white/[0.04] pt-3">{t.tip}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function RewriteCards({ rewrites }: { rewrites: Rewrite[] }) {
  return (
    <div className="space-y-3">
      {rewrites.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3"
        >
          <div>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider mb-1.5">Avant</p>
            <p className="text-white/45 text-sm leading-relaxed line-through decoration-red-500/40">{r.original}</p>
          </div>
          <div className="bg-brand/[0.05] border border-brand/15 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-brand/60 uppercase tracking-wider mb-1.5">Après</p>
                <p className="text-white/85 text-sm leading-relaxed">{r.improved}</p>
              </div>
              <CopyButton text={r.improved} />
            </div>
          </div>
          {r.reason && (
            <p className="text-white/30 text-xs leading-relaxed">{r.reason}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Quota Upgrade Card ───────────────────────────────────────────────────────

const UPGRADE_PLANS = [
  { key: 'gold',     icon: <Zap size={14} />,   color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/25', text: 'text-yellow-400', price: '29€' },
  { key: 'platinum', icon: <Star size={14} />,   color: 'from-brand/20 to-brand/10',           border: 'border-brand/25',       text: 'text-brand',       price: '59€' },
  { key: 'elite',    icon: <Crown size={14} />,  color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/25', text: 'text-violet-400', price: '149€' },
] as const

const QUOTA_COPY = {
  fr: {
    title: 'Vous avez utilisé toutes vos analyses ce mois-ci',
    subtitle: (used: number, limit: number) => `${used} analyse${used > 1 ? 's' : ''} sur ${limit} utilisée${used > 1 ? 's' : ''} — quota mensuel atteint.`,
    usageLabel: 'Analyses ce mois',
    cta: 'Voir les forfaits',
    plans: { gold: 'Gold', platinum: 'Platinum', elite: 'Elite' },
    planSubtitle: { gold: 'Analyses illimitées', platinum: 'Analyses illimitées + priorité', elite: 'Tout illimité' },
    choosePlan: 'Choisir',
  },
  en: {
    title: "You've used all your analyses this month",
    subtitle: (used: number, limit: number) => `${used} of ${limit} analys${used > 1 ? 'es' : 'is'} used — monthly quota reached.`,
    usageLabel: 'Analyses this month',
    cta: 'See plans',
    plans: { gold: 'Gold', platinum: 'Platinum', elite: 'Elite' },
    planSubtitle: { gold: 'Unlimited analyses', platinum: 'Unlimited + priority', elite: 'Everything unlimited' },
    choosePlan: 'Choose',
  },
}

function QuotaUpgradeCard({ quotaUsed, quotaLimit }: { quotaUsed: number; quotaLimit: number }) {
  const { lang } = useLanguage()
  const copy = QUOTA_COPY[lang === 'fr' ? 'fr' : 'en']

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 mb-1">
          <Zap size={18} className="text-brand" />
        </div>
        <p className="text-white/90 font-bold text-base">{copy.title}</p>
        <p className="text-white/45 text-sm">{copy.subtitle(quotaUsed, quotaLimit)}</p>
      </div>

      {/* Usage bar */}
      <div>
        <div className="flex justify-between text-xs text-white/35 mb-1.5">
          <span>{copy.usageLabel}</span>
          <span className="font-semibold text-white/60">{quotaUsed} / {quotaLimit}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }}
          />
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-3">
        {UPGRADE_PLANS.map((plan) => (
          <a
            key={plan.key}
            href="/pricing"
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all hover:scale-[1.02]',
              `bg-gradient-to-b ${plan.color}`, plan.border
            )}
          >
            <span className={cn('flex items-center gap-1 text-xs font-bold', plan.text)}>
              {plan.icon} {copy.plans[plan.key]}
            </span>
            <span className={cn('text-lg font-black', plan.text)}>{plan.price}<span className="text-xs font-medium opacity-60">/mois</span></span>
            <span className="text-white/40 text-[10px] leading-snug">{copy.planSubtitle[plan.key]}</span>
            <span className={cn('mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border', plan.text, plan.border, `bg-gradient-to-b ${plan.color}`)}>
              {copy.choosePlan} →
            </span>
          </a>
        ))}
      </div>

      <div className="text-center">
        <a href="/pricing" className="text-brand/70 hover:text-brand text-xs font-medium transition-colors underline underline-offset-2">
          {copy.cta}
        </a>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ATSPlusContent({ cvBuilderPath = '/cv-builder' }: { cvBuilderPath?: string }) {
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jobOffer, setJobOffer] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [quotaError, setQuotaError] = useState<{ message: string; quota_used: number; quota_limit: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setCvFile(file)
    }
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCvFile(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cvFile || !jobOffer.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)
    setQuotaError(null)
    setLoadingStep(0)

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1))
    }, 1800)

    try {
      const formData = new FormData()
      formData.append('cv_file', cvFile)
      formData.append('job_offer', jobOffer)

      const res = await fetch('/api/ats-analysis', {
        method: 'POST',
        body: formData,
      })

      clearInterval(stepInterval)

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 429 && data.error === 'quota_exceeded') {
          setQuotaError({ message: data.message, quota_used: data.quota_used, quota_limit: data.quota_limit })
        } else {
          setError(data.error || 'Une erreur est survenue')
        }
        return
      }

      const data: ATSResult = await res.json()
      console.log('[ats-plus] data received:', JSON.stringify(data))
      setResult(data)

    } catch {
      setError('Impossible de joindre le serveur d\'analyse')
    } finally {
      clearInterval(stepInterval)
      setLoading(false)
    }
  }

  const canSubmit = !!cvFile && jobOffer.trim().length >= 100 && !loading

  function handleGoToBuilder() {
    if (!result) return

    const skills = (result.keywords_missing ?? []).map((kw, i) => ({
      id: `ats-skill-${i}`,
      name: kw,
      level: 'débutant' as const,
    }))

    const certKeywords = (result.keywords_missing ?? []).filter((kw) =>
      /certif|cbap|uml|bpmn|pmp|scrum|aws|azure|gcp|prince/i.test(kw)
    )
    const certifications = certKeywords.map((kw, i) => ({
      id: `ats-cert-${i}`,
      title: kw,
      organization: '',
      date: '',
    }))

    const summary = result.rewrites?.[0]?.improved ?? ''

    const draft = {
      data: {
        personal: { name: '', title: '', email: '', phone: '', city: '', linkedin: '', github: '' },
        summary,
        experiences: [],
        education: [],
        skills,
        languages: [],
        certifications,
      },
      fromAts: true,
    }

    localStorage.setItem('jobspeeder_cv_draft', JSON.stringify(draft))
    window.open(cvBuilderPath, '_blank')
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-500/25">
            <Sparkles size={18} className="text-violet-400" />
          </div>
          <h1 className="text-white text-xl font-bold">Analyse de Gap Sémantique</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-xs font-bold">
            ATS+
          </span>
        </div>
        <p className="text-white/45 text-sm">
          Uploadez votre CV et collez une offre d&apos;emploi — l&apos;IA identifie exactement ce qui manque pour passer les filtres ATS.
        </p>
      </motion.div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Left — CV Upload */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Votre CV
            </label>

            {cvFile ? (
              <div className="h-48 rounded-2xl border border-brand/25 bg-brand/[0.04] flex flex-col items-center justify-center gap-3">
                <div className="p-3 rounded-xl bg-brand/10 border border-brand/20">
                  <FileText size={22} className="text-brand" />
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm font-medium">{cvFile.name}</p>
                  <p className="text-white/35 text-xs mt-0.5">{(cvFile.size / 1024).toFixed(0)} Ko</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCvFile(null)}
                  className="flex items-center gap-1.5 text-white/35 hover:text-red-400 text-xs transition-colors"
                >
                  <X size={12} /> Supprimer
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200',
                  isDragging
                    ? 'border-brand/60 bg-brand/[0.06]'
                    : 'border-white/[0.10] bg-white/[0.02] hover:border-white/[0.20] hover:bg-white/[0.04]'
                )}
              >
                <div className={cn('p-3 rounded-xl border transition-colors', isDragging ? 'bg-brand/15 border-brand/30' : 'bg-white/[0.05] border-white/[0.08]')}>
                  <Upload size={22} className={isDragging ? 'text-brand' : 'text-white/30'} />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium">Glissez votre CV ici</p>
                  <p className="text-white/30 text-xs mt-0.5">ou cliquez pour sélectionner</p>
                  <p className="text-white/20 text-xs mt-2">PDF ou DOCX — max 10 Mo</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onFileChange}
              className="hidden"
            />
          </motion.div>

          {/* Right — Job Offer */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider">
                Offre d&apos;emploi
              </label>
              <span className="text-white/25 text-xs">{jobOffer.length} car.</span>
            </div>
            <textarea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              placeholder="Collez ici le texte complet de l'offre d'emploi (titre du poste, missions, compétences requises, profil recherché...)&#10;&#10;Plus l'offre est complète, plus l'analyse sera précise."
              rows={9}
              className="w-full h-48 px-4 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] text-white/80 text-sm placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.04] transition-all leading-relaxed"
            />
            {jobOffer.length > 0 && jobOffer.length < 100 && (
              <p className="text-yellow-400/70 text-xs mt-1.5 flex items-center gap-1">
                <AlertCircle size={11} /> Collez l&apos;offre complète pour une meilleure analyse
              </p>
            )}
          </motion.div>
        </div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex justify-center">
          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'gap-2.5 px-8 py-3 text-base font-bold transition-all',
              canSubmit ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
            )}
          >
            {loading
              ? <><Loader2 size={16} className="animate-spin" /> Analyse en cours...</>
              : <><Sparkles size={16} /> Lancer l&apos;analyse ATS+</>}
          </Button>
        </motion.div>
      </form>

      {/* ── Loading ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-6"
          >
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4 text-center">
              Analyse en cours
            </p>
            <div className="space-y-3">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className={cn('flex items-center gap-3 transition-all duration-500', i <= loadingStep ? 'opacity-100' : 'opacity-20')}>
                  {i < loadingStep ? (
                    <CheckCircle2 size={16} className="text-brand flex-shrink-0" />
                  ) : i === loadingStep ? (
                    <Loader2 size={16} className="text-violet-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/15 flex-shrink-0" />
                  )}
                  <p className={cn('text-sm', i === loadingStep ? 'text-white/80' : i < loadingStep ? 'text-white/40' : 'text-white/20')}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4 flex items-center gap-3"
          >
            <XCircle size={18} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400/90 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quota Exceeded ── */}
      <AnimatePresence>
        {quotaError && <QuotaUpgradeCard quotaUsed={quotaError.quota_used} quotaLimit={quotaError.quota_limit} />}
      </AnimatePresence>

      {/* ── Results ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-white/25 text-xs font-semibold uppercase tracking-wider">Rapport d&apos;analyse</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ScoreGauge score={result.ats_score} />
              {result.summary && (
                <div className="md:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col justify-center">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Synthèse</p>
                  <p className="text-white/75 text-sm leading-relaxed">{result.summary}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-5">Mots-clés détectés</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KeywordPills keywords={result.keywords_found} type="found" />
                <KeywordPills keywords={result.keywords_missing} type="missing" />
              </div>
            </div>

            {(result.section_tips?.length ?? 0) > 0 && (
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Analyse par section</p>
                <SectionTips tips={result.section_tips!} />
              </div>
            )}

            {(result.rewrites?.length ?? 0) > 0 && (
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">Reformulations suggérées</p>
                <RewriteCards rewrites={result.rewrites!} />
              </div>
            )}

            {/* CTA builder */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6 flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="flex-1 text-center sm:text-left">
                <p className="text-white/80 text-sm font-semibold mb-1">Prêt à optimiser votre CV ?</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Les mots-clés manquants et les reformulations sont pré-remplis dans le builder — il ne reste plus qu&apos;à compléter vos informations.
                </p>
              </div>
              <Button
                onClick={handleGoToBuilder}
                className="flex-shrink-0 gap-2 px-6 py-2.5 font-bold text-sm"
              >
                <Sparkles size={14} />
                Créer mon CV optimisé
                <ArrowRight size={14} />
              </Button>
            </motion.div>

            <div className="pb-4 flex justify-center">
              <button
                onClick={() => { setResult(null); setCvFile(null); setJobOffer('') }}
                className="text-white/30 hover:text-white/60 text-sm transition-colors"
              >
                Nouvelle analyse →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
