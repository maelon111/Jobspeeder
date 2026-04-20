'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Zap, Check, X, Shield, ChevronDown, Star,
  Users, Crown, Sparkles, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { JsonLd } from '@/components/JsonLd'
import { useLanguage } from '@/lib/i18n'
import { useT } from '@/lib/translations'
import { BlobBackground } from '@/components/BlobBackground'

const SITE_URL = 'https://jobspeeder.online'

/* ─── Static Structured Data (French, for SEO) ─── */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Puis-je changer de forfait à tout moment ?', acceptedAnswer: { '@type': 'Answer', text: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment depuis votre espace personnel." } },
    { '@type': 'Question', name: "Qu'est-ce qu'un profil CV ?", acceptedAnswer: { '@type': 'Answer', text: "Un profil CV correspond à un ensemble de données utilisé pour personnaliser vos candidatures." } },
    { '@type': 'Question', name: 'Comment fonctionne la garantie 7 jours ?', acceptedAnswer: { '@type': 'Answer', text: "Si vous n'êtes pas satisfait dans les 7 jours, nous vous remboursons, sous condition." } },
    { '@type': 'Question', name: 'Les candidatures sont-elles vraiment automatiques ?', acceptedAnswer: { '@type': 'Answer', text: "Oui. JobSpeeder utilise une technologie d'IA avancée pour postuler en votre nom." } },
    { '@type': 'Question', name: 'Quelle est la différence entre le support email et le support prioritaire ?', acceptedAnswer: { '@type': 'Answer', text: "Le support email répond sous 48h ouvrées. Le support prioritaire (Platinum) répond sous 4h." } },
  ],
}

const pricingAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'JobSpeeder',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description: "Automatisez vos candidatures d'emploi grâce à l'IA.",
  offers: [
    { '@type': 'Offer', name: 'DÉCOUVERTE', price: '1', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: 1, priceCurrency: 'EUR', billingDuration: 'P1M' } },
    { '@type': 'Offer', name: 'GOLD', price: '29', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: 29, priceCurrency: 'EUR', billingDuration: 'P1M' } },
    { '@type': 'Offer', name: 'PLATINUM', price: '59', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: 59, priceCurrency: 'EUR', billingDuration: 'P1M' } },
    { '@type': 'Offer', name: 'ELITE', price: '147', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: 147, priceCurrency: 'EUR', billingDuration: 'P1M' } },
  ],
}

const pricingBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Tarifs', item: `${SITE_URL}/pricing` },
  ],
}

/* ─── Sub-components ─── */
function FeatureValue({ val }: { val: string | boolean | number }) {
  if (val === true)
    return <Check size={17} className="text-brand mx-auto" strokeWidth={2.5} />
  if (val === false)
    return <X size={15} className="text-white/20 mx-auto" strokeWidth={2} />
  return <Check size={17} className="text-brand mx-auto" strokeWidth={2.5} />
}

function LinkedInLogo({ active }: { active: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect width="24" height="24" rx="4" fill={active ? '#0A66C2' : 'rgba(255,255,255,0.12)'} />
      <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white" />
      <circle cx="6.25" cy="6.75" r="1.5" fill="white" />
      <path d="M19 19H16.5V14C16.5 12.9 15.6 12 14.5 12C13.4 12 12.5 12.9 12.5 14V19H10V9.5H12.5V10.8C13.1 9.9 14.2 9.3 15.4 9.3C17.4 9.3 19 10.9 19 12.9V19Z" fill="white" />
    </svg>
  )
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
  const { lang } = useLanguage()
  const tr = useT(lang)
  const p = tr.pricing

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  async function handleCTAClick(planId: string) {
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

  const PLANS = [
    { id: 'decouverte', name: 'DÉCOUVERTE', tagline: p.plans.decouverte.tagline, cta: p.plans.decouverte.cta, monthly: 1,   annualMonthly: 1,   featured: false, elite: false, gold: false, icon: Zap },
    { id: 'gold',       name: 'GOLD',       tagline: p.plans.gold.tagline,       cta: p.plans.gold.cta,       monthly: 27,  annualMonthly: 22,  featured: false, elite: false, gold: true,  icon: Star },
    { id: 'platinum',   name: 'PLATINUM',   tagline: p.plans.platinum.tagline,   cta: p.plans.platinum.cta,   monthly: 57,  annualMonthly: 46,  featured: true,  elite: false, gold: false, icon: Sparkles, badge: p.popular },
    { id: 'elite',      name: 'ELITE',      tagline: p.plans.elite.tagline,      cta: p.plans.elite.cta,      monthly: 147, annualMonthly: 119, featured: false, elite: true,  gold: false, icon: Crown },
  ]

  const f = p.features
  const FEATURES = [
    { label: f.appsPerDay,     values: [3, 10, 25, 50] },
    { label: f.appsPerMonth,   values: [20, 150, 500, 1500] },
    { label: f.offersPerDay,   values: [10, 50, 200, 500] },
    { label: f.cvProfiles,     values: [1, 2, 5, 15], highlight: true },
    { label: f.tracking,       values: [true, true, true, true] },
    { label: f.emailCustom,    values: [f.basic, f.advanced, f.advanced, f.advanced] },
    { label: f.followUp,       values: [false, false, true, true] },
    { label: f.accountManager, values: [false, false, false, true] },
    { label: f.support,        values: [false, 'Email', f.priority, '24/7'] },
    { label: f.aiModel,        values: ['JobSpeeder 1.0', 'JobSpeeder 1.0', 'JobSpeeder 2.0', 'JobSpeeder 3.0'], engine: true },
    { label: f.linkedinExt,    values: [false, false, true, true], linkedin: true },
  ]

  return (
    <div className="min-h-screen bg-[#060c16] text-white">
      <JsonLd data={faqSchema} />
      <JsonLd data={pricingAppSchema} />
      <JsonLd data={pricingBreadcrumbSchema} />
      <BlobBackground />
      <div className="relative z-10">

      {/* Nav mini */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-white/[0.05] max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center group">
          <Image src="/logo-v2.png" alt="JobSpeeder" width={130} height={37} className="h-8 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/40 hover:text-white/80 transition-colors">{p.nav.login}</Link>
          <Link href="/register" className="text-sm px-4 py-2 bg-brand text-black font-semibold rounded-xl hover:bg-brand/90 transition-colors">
            {p.nav.register}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium mb-5">
            <Zap size={11} />
            {p.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {p.headline}{' '}
            <span className="text-brand">{p.headlineHighlight}</span>
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            {p.sub}
          </p>
        </motion.div>

        {/* Toggle annuel/mensuel */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-white/35'}`}>{p.monthly}</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-brand' : 'bg-white/10'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${annual ? 'left-7' : 'left-1'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-white/35'}`}>{p.annual}</span>
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

                {plan.elite && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent rounded-t-2xl" />
                )}
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
                      <span className="text-white/40 mb-1.5 text-sm">{p.perMonth}</span>
                    </div>
                    {annual && plan.monthly > 0 && plan.monthly !== plan.annualMonthly && (
                      <p className="text-xs text-white/30 mt-1">
                        {p.annualSave
                          .replace('{total}', String(annualTotal))
                          .replace('{save}', String((plan.monthly - plan.annualMonthly) * 12))}
                      </p>
                    )}
                    {!annual && plan.monthly > 0 && plan.monthly !== plan.annualMonthly && (
                      <p className="text-xs text-white/25 mt-1">
                        {p.orAnnual.replace('{price}', String(plan.annualMonthly))}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {FEATURES.map((feat, fi) => {
                      const val = feat.values[i]

                      if (feat.linkedin) {
                        return (
                          <li key={fi} className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-4 flex justify-center">
                              {val
                                ? <Check size={17} className="text-brand mx-auto" strokeWidth={2.5} />
                                : <X size={15} className="text-white/20 mx-auto" strokeWidth={2} />}
                            </div>
                            <span className={`text-xs leading-tight flex items-center gap-1.5 ${val ? 'text-white/55' : 'text-white/25'}`}>
                              <LinkedInLogo active={!!val} />
                              {val ? f.linkedinBeta : f.linkedinExt}
                              {!val && <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/30 text-[10px] rounded-full">{f.notIncluded}</span>}
                            </span>
                          </li>
                        )
                      }

                      if (feat.engine) {
                        const isV2 = val === 'JobSpeeder 2.0'
                        const isV3 = val === 'JobSpeeder 3.0'
                        const isUpgraded = isV2 || isV3
                        const label = isV3 ? f.aiV3 : isV2 ? f.aiV2 : 'JobSpeeder 1.0'
                        return (
                          <li key={fi} className="flex items-center gap-2.5">
                            <div className="flex-shrink-0 w-4 flex justify-center">
                              <Check size={17} className={isUpgraded
                                ? plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : 'text-white/50'
                                : 'text-white/20'} strokeWidth={2.5} />
                            </div>
                            <span className={`text-xs leading-tight font-medium ${isUpgraded
                              ? plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-300' : 'text-white/70'
                              : 'text-white/35'}`}>
                              <span className="text-white/30 font-normal">{f.aiModelPrefix}</span>{label}
                            </span>
                          </li>
                        )
                      }

                      return (
                        <li key={fi} className={`flex items-center gap-2.5 ${feat.highlight ? 'py-1 px-2 -mx-2 rounded-lg bg-white/[0.04]' : ''}`}>
                          <div className="flex-shrink-0 w-4 flex justify-center">
                            <FeatureValue val={val} />
                          </div>
                          <span className={`text-xs leading-tight ${
                            val === false ? 'text-white/25 line-through' : feat.highlight ? 'text-white/90 font-semibold' : 'text-white/55'
                          }`}>
                            {feat.highlight && typeof val === 'number'
                              ? <><span className={`font-bold text-sm ${plan.featured ? 'text-brand' : plan.elite ? 'text-yellow-400' : plan.gold ? 'text-blue-400' : 'text-white/80'}`}>{val}</span> {(val as number) > 1 ? f.cvProfiles2 : f.cvProfile}</>
                              : feat.label
                            }
                            {!feat.highlight && typeof val === 'number' && ` : ${val}`}
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
            <div className="font-semibold text-white mb-1">{p.guarantee.title}</div>
            <p className="text-sm text-white/40">{p.guarantee.sub}</p>
          </div>
        </motion.div>

        {/* Nombre de profils */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{p.profiles.title}</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">{p.profiles.sub}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLANS.map((plan, i) => {
              const cvCount = FEATURES.find(f => f.highlight)?.values[i] as number
              return (
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
                    {cvCount}
                  </div>
                  <div className="text-xs text-white/35 font-medium">{plan.name}</div>
                  <div className="text-xs text-white/25">{cvCount > 1 ? p.profiles.units : p.profiles.unit}</div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">{p.faqTitle}</h2>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-6">
            {p.faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center"
        >
          <p className="text-white/30 text-sm mb-4">{p.bottom.alreadyAccount}</p>
          <Link href="/login" className="text-brand hover:text-brand/80 text-sm font-medium transition-colors">
            {p.bottom.login}
          </Link>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
