import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, GraduationCap, Briefcase, Zap } from 'lucide-react'
import AdminLogout from './AdminLogout'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (token !== process.env.ADMIN_SECRET) {
    redirect('/admin/login')
  }

  const navItems = [
    { href: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/coaches', label: 'Coachs', icon: GraduationCap },
    { href: '/admin/applications', label: 'Candidatures', icon: Briefcase },
  ]

  return (
    <div className="min-h-screen bg-[#060c16] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-white/[0.06] flex-col"
        style={{ background: 'rgba(6, 12, 22, 0.98)' }}
      >
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-2.5 mb-3">
            <Image src="/logo-v2.png" alt="JobSpeeder" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="text-white text-sm font-bold">JobSpeeder</span>
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand/10 border border-brand/20 rounded-full w-fit">
            <Zap size={10} className="text-brand fill-current" />
            <span className="text-brand text-[10px] font-bold uppercase tracking-wider">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/45 hover:text-white/80 hover:bg-white/[0.04] transition-all duration-150"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-5 border-t border-white/[0.06] pt-3">
          <AdminLogout />
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
