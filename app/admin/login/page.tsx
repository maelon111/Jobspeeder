'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff, Zap } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur de connexion')
    }
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex items-center justify-center p-4">
      {/* Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/4 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <Image src="/logo-v2.png" alt="JobSpeeder" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-white text-base font-bold">JobSpeeder</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full">
            <Zap size={11} className="text-brand fill-current" />
            <span className="text-brand text-xs font-bold uppercase tracking-wider">Admin</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 backdrop-blur-sm">
          <h1 className="text-white font-bold text-lg mb-1">Accès administrateur</h1>
          <p className="text-white/35 text-sm mb-6">Connectez-vous pour gérer la plateforme</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand/90 text-black font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
