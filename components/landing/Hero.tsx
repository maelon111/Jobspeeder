'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, CheckCircle2, TrendingUp } from 'lucide-react'

const mockApplications = [
  { company: 'Stripe', role: 'Senior Engineer', status: 'interview', color: 'text-brand', bg: 'bg-brand/15', dot: 'bg-brand' },
  { company: 'Notion', role: 'Product Manager', status: 'Envoyée', color: 'text-blue-400', bg: 'bg-blue-500/15', dot: 'bg-blue-400' },
  { company: 'Vercel', role: 'Frontend Dev', status: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-500/15', dot: 'bg-yellow-400' },
  { company: 'Linear', role: 'UX Designer', status: 'Envoyée', color: 'text-blue-400', bg: 'bg-blue-500/15', dot: 'bg-blue-400' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pb-12">
      {/* Background — animated CSS blobs */}
      <style>{`
        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50%      { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75%      { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }
        @keyframes blobDrift1 {
          0%,100% { transform: translate(0px, 0px); }
          33%     { transform: translate(50px, -40px); }
          66%     { transform: translate(-30px, 25px); }
        }
        @keyframes blobDrift2 {
          0%,100% { transform: translate(0px, 0px); }
          40%     { transform: translate(-40px, 30px); }
          70%     { transform: translate(30px, -20px); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main green blob */}
        <div style={{
          position: 'absolute', top: '-80px', left: '15%',
          width: '550px', height: '450px',
          background: '#00ff88', filter: 'blur(55px)', opacity: 0.2,
          animation: 'blobMorph 14s ease-in-out infinite, blobDrift1 22s ease-in-out infinite',
        }} />
        {/* Blue blob — left */}
        <div style={{
          position: 'absolute', top: '25%', left: '-8%',
          width: '420px', height: '380px',
          background: '#3b82f6', filter: 'blur(50px)', opacity: 0.14,
          animation: 'blobMorph 18s ease-in-out infinite 2s, blobDrift2 26s ease-in-out infinite 1s',
        }} />
        {/* Purple blob — right */}
        <div style={{
          position: 'absolute', top: '20%', right: '-5%',
          width: '400px', height: '460px',
          background: '#a855f7', filter: 'blur(50px)', opacity: 0.12,
          animation: 'blobMorph 20s ease-in-out infinite 4s',
        }} />
        {/* Secondary green blob — bottom center */}
        <div style={{
          position: 'absolute', bottom: '10%', right: '25%',
          width: '300px', height: '260px',
          background: '#00ff88', filter: 'blur(45px)', opacity: 0.1,
          animation: 'blobMorph 16s ease-in-out infinite 7s, blobDrift1 28s ease-in-out infinite 3s',
        }} />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/8 border border-brand/20 text-brand text-sm font-medium mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          Propulsé par GPT-4o · Automatisation 24h/24
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-5xl md:text-[72px] font-black tracking-tight leading-[1.05] mb-6"
        >
          <span className="text-white">Postulez à </span>
          <span className="text-gradient-brand">100 offres</span>
          <br />
          <span className="text-white">pendant votre </span>
          <span className="relative inline-block">
            <span className="text-white">sommeil</span>
            <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
              <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
            </svg>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-lg md:text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Uploadez votre CV, laissez l&apos;IA l&apos;optimiser pour les filtres ATS,
          et notre bot postule automatiquement aux offres qui vous correspondent.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-brand text-black font-bold rounded-2xl hover:bg-brand-dark transition-all duration-200 text-base glow-brand active:scale-95 shadow-brand"
          >
            Commencer gratuitement
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 text-white border border-white/12 font-semibold rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-base"
          >
            Se connecter
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="flex items-center justify-center gap-5 text-sm text-white/30 mb-16"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-brand/60" />
            Aucune carte requise
          </span>
          <span className="w-px h-3.5 bg-white/15" />
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-brand/60" />
            Setup en 3 minutes
          </span>
          <span className="w-px h-3.5 bg-white/15" />
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-brand/60" />
            Résultats en 48h
          </span>
        </motion.div>

        {/* Mock App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-3xl"
          style={{
            perspective: '1200px',
          }}
        >
          <div
            style={{
              transform: 'rotateX(6deg)',
              transformOrigin: 'top center',
            }}
            className="relative"
          >
            {/* Browser chrome */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
              style={{ background: 'rgba(14, 24, 37, 0.95)' }}
            >
              {/* Top bar */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/6"
                style={{ background: 'rgba(10, 18, 32, 0.9)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-lg border border-white/8 text-xs text-white/30">
                    <div className="w-3 h-3 rounded-full bg-brand/50 flex items-center justify-center">
                      <Zap size={7} className="text-brand" />
                    </div>
                    app.jobspeeder.io/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="flex" style={{ minHeight: '300px' }}>
                {/* Sidebar */}
                <div className="w-14 border-r border-white/5 flex flex-col items-center py-4 gap-3"
                  style={{ background: 'rgba(8, 15, 26, 0.8)' }}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center mb-2">
                    <Zap size={14} className="text-black" />
                  </div>
                  {[LayoutDashboardIcon, BriefcaseIcon, FileIcon, SettingsIcon].map((Icon, i) => (
                    <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-brand/15 text-brand' : 'text-white/20'}`}>
                      <Icon size={14} />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    {[
                      { label: 'Envoyées', value: '247', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { label: 'Entretiens', value: '12', color: 'text-brand', bg: 'bg-brand/10' },
                      { label: 'En attente', value: '89', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                      { label: 'Taux succès', value: '4.8%', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl p-3 border border-white/5"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className={`text-lg font-bold ${stat.color} leading-none mb-1`}>{stat.value}</div>
                        <div className="text-[10px] text-white/30">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Applications table */}
                  <div className="rounded-xl border border-white/5 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="px-4 py-2.5 border-b border-white/5 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                      Candidatures récentes
                    </div>
                    {mockApplications.map((app, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/4 last:border-0 hover:bg-white/2">
                        <div className="w-5 h-5 rounded-md bg-white/8 flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] font-bold text-white/50">{app.company[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-medium text-white/80 truncate">{app.role}</div>
                          <div className="text-[10px] text-white/30">{app.company}</div>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium ${app.bg} ${app.color} border border-current/20`}>
                          <div className={`w-1 h-1 rounded-full ${app.dot}`} />
                          {app.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -right-6 top-16 glass-strong rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-card border-brand/20"
              style={{ minWidth: '180px' }}
            >
              <div className="p-1.5 bg-brand/20 rounded-lg flex-shrink-0">
                <TrendingUp size={12} className="text-brand" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Nouvelle candidature</div>
                <div className="text-[10px] text-white/40">Airbnb · Designer Product</div>
              </div>
            </motion.div>

            {/* Floating badge left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="absolute -left-8 bottom-12 glass-strong rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-card"
            >
              <div className="p-1.5 bg-green-500/20 rounded-lg flex-shrink-0">
                <CheckCircle2 size={12} className="text-green-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Entretien obtenu</div>
                <div className="text-[10px] text-white/40">Stripe · Taux 4.8%</div>
              </div>
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #060c16)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

// Inline icon components for the mockup
function LayoutDashboardIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  )
}

function BriefcaseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

function FileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
  )
}

function SettingsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
