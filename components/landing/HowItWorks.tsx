'use client'
import { motion } from 'framer-motion'
import { Upload, Sparkles, Rocket, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Uploadez votre CV',
    description: 'Importez votre CV existant ou construisez-en un depuis zéro avec notre éditeur intégré.',
    accent: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    borderAccent: 'hover:border-blue-500/30',
    tag: 'PDF, DOCX',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Optimisation IA',
    description: 'GPT-4o analyse et réécrit votre CV pour maximiser votre score ATS et attirer les recruteurs.',
    accent: 'from-brand to-brand-dark',
    iconBg: 'bg-brand/10',
    iconColor: 'text-brand',
    borderAccent: 'hover:border-brand/30',
    tag: 'GPT-4o',
    tagColor: 'bg-brand/10 text-brand border-brand/20',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Candidatures automatiques',
    description: 'Notre bot postule aux offres correspondant à vos critères — emails, LinkedIn, sites carrière — 24h/24.',
    accent: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    borderAccent: 'hover:border-purple-500/30',
    tag: '24h/24',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-medium mb-4">
            Comment ça marche
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Aussi simple que{' '}
            <span className="text-gradient-brand">1, 2, 3</span>
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-base">
            De zéro à 100 candidatures envoyées en moins de 5 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-4 relative">
          {/* Connector lines — desktop only */}
          <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+16px)] right-[calc(33.33%+16px)] h-px"
            style={{
              background: 'linear-gradient(90deg, rgba(0,255,136,0.3), rgba(168,85,247,0.3))',
            }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
              <ArrowRight size={14} className="text-white/20" />
            </div>
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`relative group glass rounded-2xl p-6 border border-white/8 card-hover ${step.borderAccent} overflow-hidden`}
              >
                {/* Step number watermark */}
                <div className="absolute top-3 right-4 text-7xl font-black text-white/[0.03] select-none leading-none">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center p-3.5 rounded-2xl ${step.iconBg} mb-5 relative z-10`}>
                  <Icon size={22} className={step.iconColor} />
                </div>

                {/* Tag */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${step.tagColor} mb-3`}>
                  {step.tag}
                </div>

                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.description}</p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
