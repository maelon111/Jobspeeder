'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Star } from 'lucide-react'

const avatars = ['S', 'M', 'A', 'T', 'L']

export function CTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-[1px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.35) 0%, rgba(0,255,136,0.05) 40%, rgba(168,85,247,0.2) 100%)',
          }}
        >
          <div
            className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a1525 0%, #060c16 100%)' }}
          >
            {/* Glow orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-brand/15 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-60 h-40 bg-purple-500/8 blur-[60px] pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10">
              <div className="inline-flex p-4 bg-brand/10 rounded-2xl border border-brand/20 mb-6">
                <Zap size={28} className="text-brand" fill="currentColor" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                Prêt à accélérer{' '}
                <br className="hidden md:block" />
                votre recherche ?
              </h2>
              <p className="text-white/45 mb-8 max-w-sm mx-auto text-base leading-relaxed">
                Rejoignez des milliers de candidats qui trouvent leur emploi idéal avec JobSpeeder.
              </p>

              {/* CTA Button */}
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-brand text-black font-bold rounded-2xl hover:bg-brand-dark transition-all duration-200 text-base shadow-brand glow-brand active:scale-95 mb-8"
              >
                <Zap size={16} fill="currentColor" />
                Démarrer maintenant — c&apos;est gratuit
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-3">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {avatars.map((letter, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-[#060c16] flex items-center justify-center text-[10px] font-bold text-white"
                      style={{
                        background: `hsl(${(i * 60 + 140) % 360}, 60%, 30%)`,
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                {/* Stars + text */}
                <div className="text-left">
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-xs text-white/35">
                    <span className="text-white/60 font-medium">2 400+</span> candidats actifs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
