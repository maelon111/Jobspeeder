'use client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function AdminLogout() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-150 w-full"
    >
      <LogOut size={15} />
      Déconnexion
    </button>
  )
}
