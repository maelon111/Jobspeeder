'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap, Check, X, Shield, ChevronDown, Star,
  Users, Crown, Sparkles, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/* ─── Data ─── */
type Feature = {
  label: string
  values: (string | boolean | number)[]
  highlight?: boolean
  engine?: boolean
  linkedin?: boolean
}

const FEATURES: Feature[] = [
  { label: 'Candidatures / jour',    values: [3, 10, 25, 50] },
  { label: 'Candidatures / mois',    values: [20, 150, 500, 1500] },
  { label: 'Offres proposées / jour', values: [10, 50, 200, 500] },
  { label: 'Profils CV',             values: [1, 2, 5, 15], highlight: true },
  { label: 'Suivi des candidatures', values: [true, true, true, true] },
  { label: 'Personnalisation email', values: ['Basique', 'Avancée', 'Avancée', 'Avancée'] },
  { label: 'Relances automatiques',  values: [false, false, true, true] },
  { label: 'Account manager dédié', values: [false, false, false, true] },
  { label: 'Support',               values: [false, 'Email', 'Prioritaire', '24/7'] },
  { label: 'Modèle IA',             values: ['JobSpeeder 1.0', 'JobSpeeder 1.0', 'JobSpeeder 2.0', 'JobSpeeder 2.0'], engine: true },
  { label: 'Extension Chrome LinkedIn', values: [false, false, true, true], linkedin: true },
]

const PLANS = [
  {
    id: 'free',
    name: 'FREE',
    tagline: 'Pour tester JobSpeeder',
    monthly: 0,
    annualMonthly: 0,
    cta: 'Commencer gratuitement',
    href: '/register',
    featured: false,
    elite: false,
    gold: false,
    icon: Zap,
  },
  {
    id: 'gold',
    name: 'GOLD',
    tagline: 'Pour une recherche active',
    monthly: 29,
    annualMonthly: 23,
    cta: 'Choisir Gold',
    href: '/register',
    featured: false,
    elite: false,
    gold: true,
    icon: Star,
  },
  {
    id: 'platinum',
    gold: false,
    name: 'PLATINUM',
    tagline: 'Pour maximiser vos chances',
    monthly: 59,
    annualMonthly: 47,
    cta: 'Choisir Platinum',
    href: '/register',
    featured: true,
    elite: false,
    badge: 'Le plus populaire',
    icon: Sparkles,
  },
  {
    id: 'elite',
    name: 'ELITE',
    tagline: 'Pour les profils exigeants',
    monthly: 149,
    annualMonthly: 119,
    cta: 'Choisir Elite',
    href: '/register',
    featured: false,
    elite: true,
    gold: false,
    icon: Crown,
  },
]

const FAQS = [
  {
    q: 'Puis-je changer de forfait à tout moment ?',
    a: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment depuis votre espace personnel. Le changement prend effet immédiatement et la facturation est ajustée au prorata.",
  },
  {
    q: 'Qu\'est-ce qu\'un profil CV ?',
    a: "Un profil CV correspond à un ensemble de données (CV, préférences, compétences) utilisé pour personnaliser vos candidatures. Plus vous avez de profils, plus vous pouvez cibler des types de postes différents simultanément.",
  },
  {
    q: 'Comment fonctionne la garantie 14 jours ?',
    a: "Si vous n'êtes pas satisfait dans les 7 jours suivant votre premier abonnement payant, nous vous remboursons, sous condition. Contactez simplement notre support.",
  },
  {
    q: 'Les candidatures sont-elles vraiment automatiques ?',
    a: "Oui. JobSpeeder utilise une technologie d'IA avancée pour postuler en votre nom sur les offres correspondant à vos critères, personnalisant chaque candidature avec votre profil CV.",
  },
  {
    q: 'Quelle est la différence entre le support email et le support prioritaire ?',
    a: "Le support email répond sous 48h ouvrées. Le support prioritaire (Platinum) répond sous 4h. Le plan Elite inclut un account manager dédié et un support 24/7 par chat et téléphone.",
  },
]

/* ─── Sub-components ─── */
function FeatureValue({ val }: { val: string | boolean | number }) {
  if (val === true)
    return <Check size={17} className="text-brand mx-auto" strokeWidth={2.5} />
  if (val === false)
    return <X size={15} className="text-white/20 mx-auto" strokeWidth={2} />
  return <span className="text-sm text-white/70 font-medium">{val}</span>
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-medium text-white/80">{q}</span>
        <ChevronDown
          size={16}
          className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-white/45 leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Page ─── */
export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  async function handleCTAClick(planId: string) {
    if (planId === 'free') {
      router.push('/register')
      return
    }
    setLoadingPlan(planId)
    const billing = annual ? 'annual' : 'monthly'

    if (!isLoggedIn) {
      router.push(`/register?plan=${planId}&billing=${billing}`)
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#060c16] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/4 rounded-full blur-[100px]" />
      </div>

      {/* Nav mini */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/[0.05] max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2.5 font-bold group">
          <div className="p-1.5 bg-brand rounded-xl">
            <Zap size={14} className="text-black fill-current" />
          </div>
          <span className="text-white text-sm">JobSpeeder</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/40 hover:text-white/80 transition-colors">Se connecter</Link>
          <Link href="/register" className="text-sm px-4 py-2 bg-brand text-black font-semibold rounded-xl hover:bg-brand/90 transition-colors">
            Essayer gratuitement
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium mb-5">
            <Zap size={11} />
            Tarifs simples et transparents
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trouvez votre emploi{' '}
            <span className="text-brand">10x plus vite</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Choisissez le forfait adapté à votre recherche d&apos;emploi. Changez ou annulez à tout moment.
          </p>
        </motion.div>

        {/* Toggle annuel/mensuel */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-white/35'}`}>Mensuel</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-brand' : 'bg-white/10'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${annual ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-white/35'}`}>Annuel</span>
            <span className="text-xs px-2 py-0.5 bg-brand/15 border border-brand/25 text-brand rounded-full font-semibold">-20%</span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 items-end mb-20">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            const price = annual ? plan.annualMonthly : plan.monthly
            const annualTotal = plan.annualMonthly * 12

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`relative rounded-2xl flex flex-col ${
                  plan.featured
                    ? 'ring-2 ring-brand shadow-[0_0_60px_rgba(0,255,136,0.15)] scale-105 lg:scale-105 z-10 bg-[#0a1a12]'
                    : plan.elite
                    ? 'ring-1 ring-yellow-500/40 bg-gradient-to-b from-[#12100a] to-[#0a0c16]'
                    : plan.gold
                    ? 'ring-1 ring-blue-400/35 bg-gradient-to-b from-[#080e1a] to-[#060c16] shadow-[0_0_30px_rgba(96,165,250,0.08)] scale-[1.02] z-[5]'
                    : 'ring-1 ring-white/[0.07] bg-white/[0.02]'
                }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-black text-xs font-bold rounded-full whitespace-nowrap shadow-brand">
                    ⚡ {plan.badge}
                  </div>
                )}

                {/* Elite top border */}
                {plan.elite && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent rounded-t-2xl" />
                )}
                {/* Gold top border */}
                {plan.gold && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-t-2xl" />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="mb-6">
                    <div className={`inline-flex p-2 rounded-xl mb-3 ${
                      plan.featured ? 'bg-brand/20' : plan.elite ? 'bg-yellow-500/10' : plan.gold ? 'bg-blue-400/15' : 'bg-white/5'
                    }`}>
                      <Icon size={18} className={plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/40'} />
                    </div>
                    <div className={`text-xs font-bold tracking-widest mb-1 ${
                      plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/35'
                    }`}>
                      {plan.name}
                    </div>
                    <p className="text-xs text-white/40">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">{price}</span>
                      <span className="text-white/40 mb-1.5 text-sm">€/mois</span>
                    </div>
                    {annual && plan.monthly > 0 && (
                      <p className="text-xs text-white/30 mt-1">
                        soit {annualTotal}€/an · économisez {(plan.monthly - plan.annualMonthly) * 12}€
                      </p>
                    )}
                    {!annual && plan.monthly > 0 && (
                      <p className="text-xs text-white/25 mt-1">ou {plan.annualMonthly}€/mois en annuel</p>
                    )}
                    {plan.monthly === 0 && <p className="text-xs text-white/25 mt-1">pour toujours</p>}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {FEATURES.map((f, fi) => {
                      const val = f.values[i]

                      if (f.linkedin) {
                        return (
                          <li key={fi} className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-4 flex justify-center">
                              {val
                                ? <Check size={17} className="text-brand mx-auto" strokeWidth={2.5} />
                                : <X size={15} className="text-white/20 mx-auto" strokeWidth={2} />}
                            </div>
                            <span className={`text-xs leading-tight flex items-center gap-1.5 ${val ? 'text-white/55' : 'text-white/25'}`}>
                              Extension Chrome LinkedIn
                              {val
                                ? <span className="px-1.5 py-0.5 bg-brand/15 border border-brand/30 text-brand text-[10px] font-semibold rounded-full">Beta</span>
                                : <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/30 text-[10px] rounded-full">Non inclus</span>}
                            </span>
                          </li>
                        )
                      }

                      if (f.engine) {
                        const isPowerful = val === 'JobSpeeder 2.0'
                        return (
                          <li key={fi} className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-4 flex justify-center">
                              <Check size={17} className={isPowerful
                                ? plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : 'text-white/50'
                                : 'text-white/20'} strokeWidth={2.5} />
                            </div>
                            <span className={`text-xs leading-tight font-medium ${isPowerful
                              ? plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-300' : 'text-white/70'
                              : 'text-white/35'}`}>
                              {isPowerful ? 'JobSpeeder 2.0 — Puissant !' : 'JobSpeeder 1.0'}
                            </span>
                          </li>
                        )
                      }

                      return (
                        <li key={fi} className={`flex items-center gap-2.5 ${f.highlight ? 'py-1 px-2 -mx-2 rounded-lg bg-white/[0.04]' : ''}`}>
                          <div className="flex-shrink-0 w-4 flex justify-center">
                            <FeatureValue val={val} />
                          </div>
                          <span className={`text-xs leading-tight ${
                            val === false ? 'text-white/25 line-through' : f.highlight ? 'text-white/90 font-semibold' : 'text-white/55'
                          }`}>
                            {f.highlight && typeof val === 'number'
                              ? <><span className={`font-bold text-sm ${plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/80'}`}>{val}</span> profil{(val as number) > 1 ? 's' : ''} CV</>
                              : f.label
                            }
                            {!f.highlight && typeof val === 'number' && ` : ${val}`}
                            {!f.highlight && typeof val === 'string' && ` ${val.toLowerCase()}`}
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleCTAClick(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-70 ${
                      plan.featured
                        ? 'bg-brand text-black hover:bg-brand/90 shadow-brand'
                        : plan.elite
                        ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 text-yellow-300 hover:border-yellow-500/70'
                        : plan.gold
                        ? 'bg-blue-500/15 border border-blue-400/40 text-blue-300 hover:bg-blue-500/25 hover:border-blue-400/60'
                        : 'bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white'
                    }`}
                  >
                    {loadingPlan === plan.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : plan.cta}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Garantie */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl px-8 py-6 mb-20 max-w-2xl mx-auto"
        >
          <div className="p-3 bg-brand/10 rounded-2xl flex-shrink-0">
            <Shield size={28} className="text-brand" />
          </div>
          <div className="text-center sm:text-left">
            <div className="font-semibold text-white mb-1">Satisfait ou remboursé — 7 jours</div>
            <p className="text-sm text-white/40">
              Pas convaincu dans les 7 jours ? Nous vous remboursons, sous condition.
            </p>
          </div>
        </motion.div>

        {/* Nombre de profils — focus section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Pourquoi les profils CV font la différence</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">
              Chaque profil CV cible un type de poste précis. Plus vous en avez, plus vos candidatures sont personnalisées et percutantes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLANS.map((plan, i) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 text-center ${
                  plan.featured
                    ? 'bg-brand/10 border border-brand/25'
                    : plan.elite
                    ? 'bg-yellow-500/5 border border-yellow-500/20'
                    : plan.gold
                    ? 'bg-blue-500/5 border border-blue-400/20'
                    : 'bg-white/[0.02] border border-white/[0.06]'
                }`}
              >
                <Users size={20} className={`mx-auto mb-2 ${plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/30'}`} />
                <div className={`text-3xl font-bold mb-1 ${plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/70'}`}>
                  {FEATURES.find(f => f.highlight)?.values[i]}
                </div>
                <div className="text-xs text-white/35 font-medium">{plan.name}</div>
                <div className="text-xs text-white/25">profil{(FEATURES.find(f => f.highlight)?.values[i] as number) > 1 ? 's' : ''} CV</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6">
            {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center"
        >
          <p className="text-white/30 text-sm mb-4">Déjà un compte ?</p>
          <Link href="/login" className="text-brand hover:text-brand/80 text-sm font-medium transition-colors">
            Se connecter →
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
