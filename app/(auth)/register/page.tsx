'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'
import { Mail, Lock, User, Play } from 'lucide-react'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')
  const billingParam = searchParams.get('billing')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (planParam && planParam !== 'free') {
        // Redirect to checkout after signup
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: planParam, billing: billingParam ?? 'monthly' }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
          return
        }
      }
      router.push('/onboarding')
      router.refresh()
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true)
    setError('')
    try {
      // Ensure demo user exists
      const res = await fetch('/api/auth/demo', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setDemoLoading(false)
        return
      }
      // Sign in directly with demo credentials (proper cookie session)
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@jobspeeder.app',
        password: 'DemoJobSpeeder2024',
      })
      if (error) {
        setError('Erreur connexion démo: ' + error.message)
        setDemoLoading(false)
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erreur lors de la connexion démo')
      setDemoLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    })
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-purple-500/4 rounded-full blur-[80px]" />
      </div>

      <div className="relative w-full max-w-sm">
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
          <h1 className="text-2xl font-black text-white mt-4">Créer un compte</h1>
          <p className="text-white/40 text-sm mt-1.5">Commencez à postuler automatiquement</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-6 border border-white/8">
          {/* Demo access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-brand/8 border border-brand/25 rounded-xl text-sm font-bold text-brand hover:bg-brand/15 hover:border-brand/40 transition-all duration-150 mb-4 disabled:opacity-50 active:scale-95"
          >
            <Play size={14} className="fill-current" />
            {demoLoading ? 'Connexion en cours...' : 'Essayer la démo instantanée'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 font-medium">ou créer un compte</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/[0.04] border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white hover:border-white/18 transition-all duration-150 mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 font-medium">email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            <Input
              type="text"
              label="Nom complet"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={<User size={16} />}
            />
            <Input
              type="email"
              label="Email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={16} />}
            />
            <Input
              type="password"
              label="Mot de passe"
              placeholder="8 caractères minimum"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<Lock size={16} />}
            />

            {error && (
              <div className="text-sm text-red-400 bg-red-500/8 border border-red-500/18 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
              Créer mon compte →
            </Button>
          </form>

          <p className="text-xs text-white/25 text-center mt-4">
            En créant un compte, vous acceptez nos conditions d&apos;utilisation.
          </p>
        </div>

        <p className="text-center text-sm text-white/35 mt-5">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-brand hover:text-brand-light transition-colors font-semibold">
            Se connecter →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
