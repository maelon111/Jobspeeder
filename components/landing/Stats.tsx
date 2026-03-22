'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TrendingUp, Clock, Zap, Target } from 'lucide-react'

const stats = [
  {
    value: 10000,
    suffix: '+',
    label: 'Offres analysées',
    description: 'chaque jour',
    icon: Target,
    color: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    value: 94,
    suffix: '%',
    label: 'Taux de succès',
    description: 'candidatures envoyées',
    icon: TrendingUp,
    color: 'text-brand',
    iconBg: 'bg-brand/10',
  },
  {
    value: 3,
    suffix: ' min',
    label: 'Setup initial',
    description: 'pour être opérationnel',
    icon: Zap,
    color: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
  },
  {
    value: 48,
    suffix: 'h',
    label: 'Délai moyen',
    description: 'avant le premier retour',
    icon: Clock,
    color: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
  },
]

function AnimatedCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1600
    const step = value / (duration / 16)
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, value)
      setCount(Math.floor(current))
      if (current >= value) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref} className={`tabular-nums ${color}`}>
      {count.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative py-16 px-4 overflow-hidden">
      {/* Section blob */}
      <div className="blob-drift-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: '#00ff88', filter: 'blur(70px)', opacity: 0.08 }} />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-8 flex flex-col gap-3 group hover:bg-white/2 transition-colors"
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${stat.iconBg} w-fit`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-black mb-0.5">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} color={stat.color} />
                    </div>
                    <div className="text-sm font-semibold text-white/80">{stat.label}</div>
                    <div className="text-xs text-white/35 mt-0.5">{stat.description}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
