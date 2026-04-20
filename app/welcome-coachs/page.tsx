'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Users, Zap, Calendar, ChevronRight, Shield, Star, Award, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { useLanguage } from '@/lib/i18n'
import { useT } from '@/lib/translations'

/* ─── animation helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
})

/* ─── Background blobs (reusable) ─── */
function Blobs() {
  return (
    <>
      <style>{`
        @keyframes wc-blob-morph {
          0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
          25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
          50%{border-radius:50% 60% 30% 60%/30% 60% 70% 40%}
          75%{border-radius:60% 40% 60% 30%/70% 30% 50% 60%}
        }
        @keyframes wc-drift1{0%,100%{transform:translate(0,0)}33%{transform:translate(45px,-35px)}66%{transform:translate(-25px,22px)}}
        @keyframes wc-drift2{0%,100%{transform:translate(0,0)}40%{transform:translate(-35px,28px)}70%{transform:translate(28px,-18px)}}
      `}</style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ position:'absolute', top:'-80px', left:'15%', width:'550px', height:'450px', background:'#00ff88', filter:'blur(55px)', opacity:0.18, animation:'wc-blob-morph 14s ease-in-out infinite, wc-drift1 22s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'30%', left:'-8%', width:'420px', height:'380px', background:'#3b82f6', filter:'blur(50px)', opacity:0.12, animation:'wc-blob-morph 18s ease-in-out infinite 2s, wc-drift2 26s ease-in-out infinite 1s' }} />
        <div style={{ position:'absolute', top:'15%', right:'-5%', width:'400px', height:'460px', background:'#a855f7', filter:'blur(50px)', opacity:0.1, animation:'wc-blob-morph 20s ease-in-out infinite 4s' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'20%', width:'300px', height:'260px', background:'#00ff88', filter:'blur(45px)', opacity:0.08, animation:'wc-blob-morph 16s ease-in-out infinite 7s, wc-drift1 28s ease-in-out infinite 3s' }} />
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize:'32px 32px' }} />
      </div>
    </>
  )
}

/* ─── Coaching simulation section ─── */
const PRESETS = [
  { clients: 3, sessions: 1, price: 60 },
  { clients: 8, sessions: 2, price: 80 },
  { clients: 15, sessions: 3, price: 100 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HSlider({ label, value, min, max, step = 1, color, unit, onChange }: {
  label: string; value: number; min: number; max: number; step?: number
  color: string; unit?: string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
      <span className="text-white/80 text-sm font-medium md:w-56 md:flex-shrink-0">{label}</span>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`, accentColor: color }}
        />
        <span className="font-black text-sm tabular-nums w-16 text-right flex-shrink-0" style={{ color }}>
          {value}{unit ?? ''}
        </span>
      </div>
    </div>
  )
}

/* ─── Commission simulation section ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommissionSimSection({ c }: { c: any }) {
  const [gold,     setGold]     = useState(5)
  const [platinum, setPlatinum] = useState(3)
  const [elite,    setElite]    = useState(1)
  const monthly = (gold * 29 + platinum * 59 + elite * 149) * 0.1
  const annual  = monthly * 12

  return (
    <section className="relative px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp(0)} className="glass-strong gradient-border rounded-3xl p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold">
              <TrendingUp size={12} />
              {c.commSimBadge ?? 'Simulateur de revenus parrainage'}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{c.commissionHeadline}</h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">{c.commSimSub ?? c.commissionBody}</p>

          {/* Sliders */}
          <div className="space-y-5 mb-8">
            <HSlider label={c.commSimGoldLabel   ?? 'Candidats GOLD · 29 €/mois'}     value={gold}     min={0} max={30} color="#fbbf24" onChange={setGold}     />
            <HSlider label={c.commSimPlatinumLabel ?? 'Candidats PLATINUM · 59 €/mois'} value={platinum} min={0} max={20} color="#60a5fa" onChange={setPlatinum} />
            <HSlider label={c.commSimEliteLabel   ?? 'Candidats ELITE · 149 €/mois'}   value={elite}    min={0} max={10} color="#a855f7" onChange={setElite}    />
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-5">
              <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-widest">{c.commSimMonthlyLabel}</p>
              <p className="text-brand font-black text-3xl tabular-nums">{fmt(monthly)}</p>
              <p className="text-white/20 text-xs mt-1">/mois</p>
            </div>
            <div className="bg-brand/10 border border-brand/25 rounded-2xl px-5 py-5">
              <p className="text-brand/60 text-xs font-medium mb-2 uppercase tracking-widest">{c.commSimAnnualLabel}</p>
              <p className="text-brand font-black text-3xl tabular-nums">{fmt(annual)}</p>
              <p className="text-white/20 text-xs mt-1">/an</p>
            </div>
          </div>

          <p className="text-xs text-white/25 text-center">{c.commSimNote}</p>
        </motion.div>
      </div>
    </section>
  )
}

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SimulationSection({ c }: { c: any }) {
  const [clients, setClients] = useState(8)
  const [sessions, setSessions] = useState(2)
  const [price, setPrice] = useState(80)
  const monthly = clients * sessions * price
  const annual = monthly * 12

  return (
    <section className="relative px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp(0)} className="glass-strong gradient-border rounded-3xl p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold">
              <TrendingUp size={12} />
              {c.simBadge}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{c.simHeadline}</h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">{c.simSub}</p>

          {/* Presets */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => { setClients(p.clients); setSessions(p.sessions); setPrice(p.price) }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                  clients === p.clients && sessions === p.sessions && price === p.price
                    ? 'bg-brand/20 border-brand/50 text-brand'
                    : 'bg-white/[0.04] border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                }`}
              >
                {[c.simPreset1, c.simPreset2, c.simPreset3][i]}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-5 mb-8">
            <HSlider label={c.simClientsLabel}  value={clients}  min={1}  max={20}  color="#00ff88" onChange={setClients}  />
            <HSlider label={c.simSessionsLabel} value={sessions} min={1}  max={5}   color="#60a5fa" onChange={setSessions} />
            <HSlider label={c.simPriceLabel}    value={price}    min={40} max={150} step={5} color="#a855f7" unit=" €" onChange={setPrice} />
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-5">
              <p className="text-white/40 text-xs font-medium mb-2 uppercase tracking-widest">{c.simMonthlyLabel}</p>
              <p className="text-brand font-black text-3xl tabular-nums">{fmt(monthly)}</p>
              <p className="text-white/20 text-xs mt-1">/mois</p>
            </div>
            <div className="bg-brand/10 border border-brand/25 rounded-2xl px-5 py-5">
              <p className="text-brand/60 text-xs font-medium mb-2 uppercase tracking-widest">{c.simAnnualLabel}</p>
              <p className="text-brand font-black text-3xl tabular-nums">{fmt(annual)}</p>
              <p className="text-white/20 text-xs mt-1">/an</p>
            </div>
          </div>

          <p className="text-xs text-white/25 text-center">{c.simNote}</p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Main page ─── */
export default function WelcomeCoachsPage() {
  const { lang } = useLanguage()
  const tr = useT(lang)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = (tr as any).coaches ?? {}

  return (
    <main className="relative min-h-screen bg-[#060c16] text-white overflow-x-hidden">
      <Blobs />
      <Navbar />

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-16 pt-24">
        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
          {/* Badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/8 border border-brand/20 text-brand text-sm font-medium mb-8">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            {c.launchBadge}
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.08)} className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6">
            <span className="text-white">{c.heroHeadline1}</span>
            <span className="text-gradient-brand">{c.heroHeadline2}</span>
          </motion.h1>

          {/* Sub */}
          <motion.div {...fadeUp(0.16)} className="text-lg md:text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed text-left">
            <p className="mb-4">{c.heroSubIntro}</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2"><span className="text-brand mt-1">•</span><span>{c.heroBullet1}</span></li>
              <li className="flex items-start gap-2"><span className="text-brand mt-1">•</span><span>{c.heroBullet2}</span></li>
              <li className="flex items-start gap-2"><span className="text-brand mt-1">•</span><span>{c.heroBullet3}</span></li>
              <li className="flex items-start gap-2"><span className="text-brand mt-1">•</span><span>{c.heroBullet4}</span></li>
            </ul>
            <p>{c.heroSubOutro}</p>
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://appobooking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-brand text-black font-bold rounded-2xl hover:bg-brand-dark transition-all duration-200 text-base glow-brand active:scale-95 shadow-brand"
            >
              {c.ctaJoin}
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#comment"
              className="inline-flex items-center gap-2 px-6 py-4 text-white/60 font-medium rounded-2xl hover:text-white transition-colors text-base"
            >
              {c.ctaHow}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 2. POURQUOI ÇA CHANGE TOUT ── */}
      <section className="relative px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium mb-6">
              <Zap size={13} className="text-brand" />
              {c.whyBadge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {c.whyHeadline}<br /><br />
              <span className="text-gradient-brand">{c.whyHeadline2}</span><br /><br />
              {c.whyHeadline3}
            </h2>
          </motion.div>

          {/* Stats choc */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <motion.div {...fadeUp(0.05)} className="glass gradient-border rounded-2xl p-7 text-center card-hover">
              <div className="text-5xl font-black text-brand mb-3">{c.stat1Value}</div>
              <p className="text-white/55 text-sm leading-relaxed">{c.stat1Desc}</p>
            </motion.div>
            <motion.div {...fadeUp(0.1)} className="glass gradient-border rounded-2xl p-7 text-center card-hover">
              <div className="text-5xl font-black text-white mb-3">{c.stat2Value}</div>
              <p className="text-white/55 text-sm leading-relaxed">{c.stat2Desc}</p>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="glass gradient-border rounded-2xl p-7 text-center card-hover">
              <div className="text-5xl font-black text-white mb-3">{c.stat3Value}</div>
              <p className="text-white/55 text-sm leading-relaxed">{c.stat3Desc}</p>
            </motion.div>
          </div>

          {/* Citations percutantes */}
          <div className="space-y-4">
            <motion.div {...fadeUp(0.1)} className="flex gap-5 items-start glass-strong gradient-border-subtle rounded-2xl px-7 py-6">
              <div className="text-3xl leading-none flex-shrink-0">😮‍💨</div>
              <div>
                <p className="text-white font-semibold mb-1">{c.quote1Title}</p>
                <p className="text-white/45 text-sm leading-relaxed">{c.quote1Body}</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.12)} className="flex gap-5 items-start glass-strong gradient-border-subtle rounded-2xl px-7 py-6">
              <div className="text-3xl leading-none flex-shrink-0">🤖</div>
              <div>
                <p className="text-white font-semibold mb-1">{c.quote2Title}</p>
                <p className="text-white/45 text-sm leading-relaxed">{c.quote2Body}</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.14)} className="flex gap-5 items-start glass-strong gradient-border-subtle rounded-2xl px-7 py-6">
              <div className="text-3xl leading-none flex-shrink-0">🎯</div>
              <div>
                <p className="text-white font-semibold mb-1">{c.quote3Title}</p>
                <p className="text-white/45 text-sm leading-relaxed">{c.quote3Body}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. CE QUE VOUS GAGNEZ ── */}
      <section className="relative px-4 py-24 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{c.gainsHeadline}</h2>
          <p className="text-white/45 text-lg">{c.gainsSub}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div {...fadeUp(0.05)} className="glass gradient-border rounded-2xl p-7 card-hover relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-bold">
              {c.gain1Badge}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center mb-5">
              <Users size={22} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{c.gain1Title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">{c.gain1Desc}</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div {...fadeUp(0.1)} className="glass gradient-border rounded-2xl p-7 card-hover relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
              {c.gain2Badge}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-5">
              <Zap size={22} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{c.gain2Title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">{c.gain2Desc}</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div {...fadeUp(0.15)} className="glass gradient-border rounded-2xl p-7 card-hover relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-brand/15 border border-brand/30 text-brand text-xs font-bold">
              {c.gain3Badge}
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mb-5">
              <Calendar size={22} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">{c.gain3Title}</h3>
            <p className="text-white/50 leading-relaxed text-sm">{c.gain3Desc}</p>
          </motion.div>
        </div>
      </section>

      {/* ── 3b. SIMULATION ── */}
      <SimulationSection c={c} />

      {/* ── 3c. COMMISSION ── */}
      <CommissionSimSection c={c} />

      {/* ── 4. COMMENT ÇA FONCTIONNE ── */}
      <section id="comment" className="relative px-4 py-24 max-w-4xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">{c.howHeadline}</h2>
          <p className="text-white/45 text-lg">{c.howSub}</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-[2.4rem] top-8 bottom-8 w-px bg-gradient-to-b from-brand/30 via-brand/15 to-transparent" />

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: c.step1Title,
                desc: c.step1Desc,
                color: 'text-brand',
                bg: 'bg-brand/15',
                border: 'border-brand/30',
              },
              {
                step: '02',
                title: c.step2Title,
                desc: c.step2Desc,
                color: 'text-blue-400',
                bg: 'bg-blue-500/15',
                border: 'border-blue-500/25',
              },
              {
                step: '03',
                title: c.step3Title,
                desc: c.step3Desc,
                color: 'text-purple-400',
                bg: 'bg-purple-500/15',
                border: 'border-purple-500/25',
              },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)} className="flex gap-5 items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center font-black text-sm ${s.color} z-10`}>
                  {s.step}
                </div>
                <div className="glass gradient-border-subtle rounded-2xl px-6 py-5 flex-1 card-hover">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ChevronRight size={14} className={s.color} />
                    <h3 className="font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4b. NIVEAUX DE CONFIANCE ── */}
      <section className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium mb-6">
              <Shield size={13} className="text-brand" />
              {c.trustBadge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {c.trustHeadline}
            </h2>
            <p className="text-white/45 text-lg">{c.trustSub}</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/10 via-brand/20 to-brand/40" />

            <div className="space-y-5">
              {/* Niveau 1 */}
              <motion.div {...fadeUp(0.05)} className="relative md:flex md:gap-8 md:items-start">
                <div className="hidden md:flex flex-col items-center w-1/2 pr-8 text-right pt-1">
                  <p className="text-white/35 text-sm leading-relaxed">{c.level1Desc}</p>
                </div>
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center">
                    <Shield size={20} className="text-white/50" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 glass gradient-border-subtle rounded-2xl px-6 py-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="md:hidden w-10 h-10 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center flex-shrink-0">
                      <Shield size={17} className="text-white/50" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{c.level1Label}</span>
                      <h3 className="font-bold text-white">{c.level1Title}</h3>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed md:hidden">{c.level1Desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/35 text-xs">
                    {c.level1Badge}
                  </span>
                </div>
              </motion.div>

              {/* Niveau 2 */}
              <motion.div {...fadeUp(0.1)} className="relative md:flex md:gap-8 md:items-start">
                <div className="hidden md:flex flex-col items-center w-1/2 pr-8 text-right pt-1">
                  <p className="text-white/35 text-sm leading-relaxed">{c.level2Desc}</p>
                </div>
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-brand/15 border border-brand/30 flex items-center justify-center">
                    <Star size={20} className="text-brand" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 glass gradient-border rounded-2xl px-6 py-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="md:hidden w-10 h-10 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center flex-shrink-0">
                      <Star size={17} className="text-brand" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand/60 uppercase tracking-widest">{c.level2Label}</span>
                      <h3 className="font-bold text-white">{c.level2Title}</h3>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed md:hidden">{c.level2Desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand/70 text-xs">
                    {c.level2Badge}
                  </span>
                </div>
              </motion.div>

              {/* Niveau 3 */}
              <motion.div {...fadeUp(0.15)} className="relative md:flex md:gap-8 md:items-start">
                <div className="hidden md:flex flex-col items-center w-1/2 pr-8 text-right pt-1">
                  <p className="text-white/35 text-sm leading-relaxed">{c.level3Desc}</p>
                </div>
                <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                    <Award size={20} className="text-yellow-400" />
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8 glass rounded-2xl px-6 py-5 card-hover"
                  style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.06), rgba(234,179,8,0.02))', border: '1px solid rgba(234,179,8,0.2)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="md:hidden w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                      <Award size={17} className="text-yellow-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-yellow-500/70 uppercase tracking-widest">{c.level3Label}</span>
                      <h3 className="font-bold text-white">{c.level3Title}</h3>
                    </div>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed md:hidden">{c.level3Desc}</p>
                  <span className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/25 text-yellow-400/80 text-xs">
                    <Award size={10} />
                    {c.level3Badge}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CE QU'EST JOBSPEEDER ── */}
      <section className="relative px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium mb-8">
              <Zap size={13} className="text-brand" />
              {c.platformBadge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              {c.platformHeadline}
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-6">
              {c.platformIntro}
            </p>
            <ul className="text-left inline-block space-y-3 mb-6">
              {[c.platformBullet1, c.platformBullet2, c.platformBullet3, c.platformBullet4].map((bullet: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-brand mt-1 flex-shrink-0">•</span>
                  <span className="text-white/70 text-lg leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
            <p className="text-white/55 text-lg leading-relaxed">
              {c.platformOutro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 6. CE QU'ON ATTEND DE VOUS ── */}
      <section className="relative px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center glass gradient-border rounded-3xl px-8 py-16">
            <h2 className="text-2xl font-bold text-white/40 mb-4 uppercase tracking-widest text-sm">{c.expectLabel}</h2>
            <p className="text-3xl md:text-4xl font-black text-white leading-tight">
              {c.expectBody}
            </p>
            <p className="text-brand font-bold text-2xl mt-3">{c.expectSuffix}</p>
          </motion.div>
        </div>
      </section>

      {/* ── 7. INSCRIPTION ── */}
      <section id="formulaire" className="relative px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/8 border border-brand/20 text-brand text-sm font-medium mb-6">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              {c.formBadge}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {c.formHeadline}
            </h2>
            <p className="text-white/45 text-lg">
              {c.formSub}
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="glass-strong gradient-border rounded-3xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center mx-auto mb-6">
              <Calendar size={28} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {c.formCardTitle}
            </h3>
            <p className="text-white/50 leading-relaxed mb-8">
              {c.formCardBody}
            </p>
            <a
              href="https://appobooking.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-brand text-black font-bold rounded-2xl hover:bg-brand-dark transition-all duration-200 text-base glow-brand active:scale-95 shadow-brand"
            >
              {c.formCta}
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <p className="mt-5 text-xs text-white/30">
              {c.formNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 8. FOOTER MINIMAL ── */}
      <footer className="border-t border-white/5 px-4 py-8 text-center">
        <p className="text-xs text-white/20">
          JobSpeeder © 2025 ·{' '}
          <Link href="https://jobspeeder.online" className="hover:text-white/40 transition-colors">
            jobspeeder.online
          </Link>
          {' · '}
          <a href="mailto:contact@jobspeeder.online" className="text-brand/50 hover:text-brand transition-colors">
            contact@jobspeeder.online
          </a>
        </p>
      </footer>
    </main>
  )
}
