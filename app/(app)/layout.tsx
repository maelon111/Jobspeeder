'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Zap, LayoutDashboard, FileText, Bot, Settings, LogOut, ChevronRight, Menu, ChevronDown, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/lib/i18n'
import { useT } from '@/lib/translations'
import { useState, useEffect, useRef, useCallback } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = useT(lang)
  const [navOpen, setNavOpen] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleHide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNavOpen(false), 3000)
  }, [])

  useEffect(() => {
    scheduleHide()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [scheduleHide])

  useEffect(() => {
    scheduleHide()
  }, [pathname, scheduleHide])

  const navItems = [
    { href: '/dashboard', label: tr.nav.dashboard, icon: LayoutDashboard },
    { href: '/applications', label: tr.nav.applications, icon: Bot },
    { href: '/job-offers', label: tr.nav.jobOffers, icon: Briefcase },
    { href: '/cv', label: tr.nav.cv, icon: FileText },
    { href: '/settings', label: tr.nav.settings, icon: Settings },
  ]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#060c16] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-white/[0.06] flex-col"
        style={{ background: 'rgba(6, 12, 22, 0.98)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5 font-bold group">
            <div className="p-1.5 bg-brand rounded-xl group-hover:bg-brand-dark transition-colors">
              <Zap size={15} className="text-black fill-current" />
            </div>
            <span className="text-white text-sm">JobSpeeder</span>
          </Link>
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
          <div className="px-2 py-1.5">
            <LanguageSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150 w-full"
          >
            <LogOut size={16} />
            {tr.nav.logout}
          </button>
        </div>

        <Footer className="border-t-0 pt-0" />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0 min-w-0">
        {children}
      </main>

      {/* Bottom nav — mobile */}
      <div className="md:hidden">
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] flex items-center justify-around px-1 py-2 transition-transform duration-300 ease-in-out"
          style={{
            background: 'rgba(6, 12, 22, 0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
            transform: navOpen ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={scheduleHide}
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

        {/* Toggle FAB */}
        <button
          onClick={() => {
            setNavOpen(v => {
              if (!v) scheduleHide()
              return !v
            })
          }}
          className="fixed bottom-4 right-4 z-[60] w-11 h-11 rounded-full bg-brand flex items-center justify-center shadow-brand transition-all duration-300 active:scale-95"
          style={{ bottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
          aria-label="Menu"
        >
          {navOpen
            ? <ChevronDown size={18} className="text-black" />
            : <Menu size={18} className="text-black" />
          }
        </button>
      </div>
    </div>
  )
}
