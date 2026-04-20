'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import { Mail, Lock, GraduationCap } from 'lucide-react'
import { BlobBackground } from '@/components/BlobBackground'

export default function CoachLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/coach/dashboard')
    })
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : error.message
      )
      setLoading(false)
    } else {
      router.push('/coach/dashboard')
      router.refresh()
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/coach/dashboard` },
    })
    if (error) {
      setError('Erreur Google : ' + error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex items-center justify-center px-4">
      <BlobBackground />
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-4 group">
            <Image
              src="/logo-v2.png"
              alt="JobSpeeder"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <GraduationCap size={20} className="text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Espace Coach</h1>
          <p className="text-white/40 text-sm mt-1.5">Connectez-vous pour accéder à votre espace</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 border border-white/8">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white hover:border-white/18 transition-all duration-150 mb-4 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            {googleLoading ? 'Redirection...' : 'Continuer avec Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 font-medium">email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Email form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
            <Input
              type="email"
              label="Email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={15} />}
            />
            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock size={15} />}
            />

            {error && (
              <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/18 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Accéder à l&apos;espace coach
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/35 mt-5">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-brand hover:text-brand-light transition-colors font-semibold">
            Créer un compte →
          </Link>
        </p>
      </div>
    </div>
  )
}
