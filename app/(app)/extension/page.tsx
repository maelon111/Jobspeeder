'use client'
import { Download, Chrome, Puzzle, CheckCircle, Zap, ExternalLink, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const WEBSTORE_URL = 'https://chromewebstore.google.com/detail/hfkbdomgdojdkhjiigaglndfnfdleajj?utm_source=item-share-cb'

const steps = [
  {
    icon: Chrome,
    title: 'Ouvrir le Chrome Web Store',
    desc: 'Clique sur le bouton ci-dessus pour accéder à la page de l\'extension sur le Chrome Web Store.',
  },
  {
    icon: Download,
    title: 'Ajouter à Chrome',
    desc: 'Clique sur "Ajouter à Chrome" puis confirme en cliquant sur "Ajouter l\'extension".',
  },
  {
    icon: Puzzle,
    title: 'Épingler l\'extension',
    desc: 'Clique sur l\'icône puzzle dans Chrome, puis épingle JobSpeeder pour y accéder facilement.',
  },
]

export default function ExtensionPage() {
  const [showFallback, setShowFallback] = useState(false)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-brand/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* Hero */}
      <div className="glass rounded-2xl border border-brand/20 p-8 mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
          <Zap size={28} className="text-brand" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Extension Chrome JobSpeeder</h1>
        <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
          Automatise tes candidatures LinkedIn Easy Apply directement depuis ton navigateur.
        </p>

        {/* Primary CTA — Web Store */}
        <a
          href={WEBSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-brand hover:bg-brand/90 text-black font-bold rounded-xl transition-all duration-150 active:scale-95 shadow-brand"
        >
          <Chrome size={17} />
          Installer depuis le Chrome Web Store
          <ExternalLink size={14} />
        </a>

        <p className="text-white/20 text-xs mt-3">Gratuit · Officiel · Chrome / Edge</p>

        {/* Fallback trigger */}
        <button
          onClick={() => setShowFallback(v => !v)}
          className="mt-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 rounded-lg px-4 py-2"
        >
          <AlertCircle size={14} />
          Des difficultés ? Télécharger directement
        </button>

        {/* Fallback download */}
        {showFallback && (
          <div className="mt-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-left">
            <p className="text-xs text-white/50 mb-3">
              Si le Web Store est inaccessible, tu peux installer l&apos;extension manuellement :
            </p>
            <a
              href="/extension.zip"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white/70 text-sm font-medium rounded-lg transition-all duration-150 active:scale-95"
            >
              <Download size={14} />
              Télécharger le ZIP — V2.0
            </a>
            <p className="text-white/25 text-xs mt-2">Nécessite d&apos;activer le mode développeur Chrome</p>
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Installation en 3 étapes</h2>
        <div className="space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="glass rounded-xl border border-white/[0.06] p-4 flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 border border-brand/15">
                  <Icon size={15} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-brand/50 uppercase tracking-wider">Étape {i + 1}</span>
                  </div>
                  <div className="font-semibold text-sm text-white/80">{step.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{step.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <div className="glass rounded-xl border border-yellow-500/15 p-4 flex gap-3">
        <CheckCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-white/70 mb-0.5">Extension vérifiée par Google</div>
          <p className="text-xs text-white/35">
            Cette extension est publiée sur le Chrome Web Store officiel et maintenue par JobSpeeder. Elle accède uniquement aux pages LinkedIn pour automatiser les candidatures Easy Apply. Aucune donnée personnelle n&apos;est transmise à des tiers.
          </p>
        </div>
      </div>
    </div>
  )
}
