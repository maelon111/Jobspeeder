'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import Link from 'next/link'
import { GraduationCap, ExternalLink, CheckCircle } from 'lucide-react'
import { BlobBackground } from '@/components/BlobBackground'

const SPECIALTIES = [
  'Recherche d\'emploi', 'CV & Lettre de motivation', 'Entretiens',
  'Reconversion professionnelle', 'Networking', 'LinkedIn',
  'Négociation salariale', 'Bilan de compétences',
]

export default function CoachRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [form, setForm] = useState({
    name: '',
    appo_slug: '',
    bio: '',
    city: '',
    specialties: [] as string[],
  })

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/coach/login')
        return
      }
      // Vérifie s'il a déjà un profil coach
      const res = await fetch('/api/coach/me')
      if (res.ok) {
        router.replace('/coach/dashboard')
        return
      }
      // Pré-rempli le nom depuis le profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single()
      if (profile?.full_name) setForm(f => ({ ...f, name: profile.full_name! }))
      setAuthChecked(true)
    }
    check()
  }, [router])

  function toggleSpecialty(s: string) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Nom requis'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/coach/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        appo_slug: form.appo_slug || undefined,
        bio: form.bio || undefined,
        city: form.city || undefined,
        specialties: form.specialties,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erreur lors de la création')
      setLoading(false)
      return
    }

    router.push('/coach/dashboard')
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#060c16] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex items-center justify-center px-4 py-12">
      <BlobBackground />
      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image src="/logo-v2.png" alt="JobSpeeder" width={140} height={40} className="h-9 w-auto" priority />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <GraduationCap size={20} className="text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Créer votre espace coach</h1>
          <p className="text-white/40 text-sm mt-2">
            Accédez au suivi de vos coachés et à vos commissions d&apos;affiliation
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-6 border border-white/8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nom complet"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />

            {/* Appo slug */}
            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">
                Votre slug Appo{' '}
                <span className="text-white/30">(optionnel mais recommandé)</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="votre-nom"
                    value={form.appo_slug}
                    onChange={e => setForm(f => ({ ...f, appo_slug: e.target.value.trim().toLowerCase() }))}
                  />
                </div>
                {form.appo_slug && (
                  <a
                    href={`https://appobooking.com/${form.appo_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-brand hover:text-brand/80 transition-colors flex-shrink-0"
                  >
                    <ExternalLink size={12} />
                    Vérifier
                  </a>
                )}
              </div>
              <p className="text-white/25 text-xs mt-1">
                Trouvez votre slug sur appobooking.com/{'{'}votre-slug{'}'}
              </p>
            </div>

            <div>
              <label className="text-white/60 text-xs font-medium mb-1.5 block">Biographie courte</label>
              <textarea
                placeholder="Coach emploi spécialisé dans la reconversion..."
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-brand/50 transition-all resize-none"
              />
            </div>

            <Input
              label="Ville"
              placeholder="Paris"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
            />

            {/* Spécialités */}
            <div>
              <label className="text-white/60 text-xs font-medium mb-2 block">
                Spécialités{' '}
                <span className="text-white/30">({form.specialties.length} sélectionnée{form.specialties.length > 1 ? 's' : ''})</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(s => {
                  const active = form.specialties.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        active
                          ? 'bg-brand/15 border-brand/30 text-brand'
                          : 'bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80 hover:border-white/20'
                      }`}
                    >
                      {active && <CheckCircle size={10} />}
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/18 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              Créer mon espace coach →
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-white/25 mt-4">
          Vous n&apos;êtes pas encore sur Appo ?{' '}
          <a
            href="https://appobooking.com/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand/80 transition-colors"
          >
            Créer votre profil →
          </a>
        </p>
      </div>
    </div>
  )
}
