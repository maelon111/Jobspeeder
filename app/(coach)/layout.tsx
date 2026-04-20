'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Users, Wallet, LogOut, ChevronRight, Settings, FileSearch } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Footer } from '@/components/Footer'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/coach/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/coach/coachees', label: 'Mes coachés', icon: Users },
  { href: '/coach/earnings', label: 'Revenus', icon: Wallet },
  { href: '/coach/ats-plus', label: 'ATS+', icon: FileSearch },
]

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [coachName, setCoachName] = useState('')

  useEffect(() => {
    fetch('/api/coach/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) {
          router.replace('/coach/register')
          return
        }
        setCoachName(data.name || '')
      })
      .catch(() => router.replace('/coach/register'))
  }, [router])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/coach/login')
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-white/[0.06] flex-col"
        style={{ background: 'rgba(6, 12, 22, 0.98)' }}
      >
        {/* Logo + badge */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/coach/dashboard" className="flex items-center gap-2.5 mb-3">
            <Image src="/logo-v2.png" alt="JobSpeeder" width={32} height={32} className="h-8 w-8 object-contain" priority />
            <span className="text-white text-sm font-bold">JobSpeeder</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-emerald-400 text-xs font-semibold">Espace Coach</span>
          </div>
          {coachName && (
            <p className="text-white/50 text-xs mt-1 truncate">{coachName}</p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'sidebar-item-active text-brand'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                )}
              >
                <Icon size={16} className={active ? 'text-brand' : ''} />
                {label}
                {active && <ChevronRight size={13} className="ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-1 border-t border-white/[0.06] pt-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-white/70 hover:bg-white/[0.04] transition-all duration-150"
          >
            <Settings size={16} />
            Espace candidat
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150 w-full"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>

        <Footer className="border-t-0 pt-0" />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] flex items-center justify-around px-1 py-2"
        style={{
          background: 'rgba(6, 12, 22, 0.97)',
          backdropFilter: 'blur(20px)',
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 min-w-0 flex-1',
                active ? 'text-brand' : 'text-white/35'
              )}
            >
              <Icon size={20} />
              <span className="text-[9px] font-semibold uppercase tracking-wide truncate">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/35 hover:text-red-400 transition-all duration-150 flex-1"
        >
          <LogOut size={20} />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Sortir</span>
        </button>
      </nav>
    </div>
  )
}
