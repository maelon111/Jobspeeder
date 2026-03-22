import { Navbar } from '@/components/landing/Navbar'
import Link from 'next/link'
import { Zap, Mail } from 'lucide-react'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060c16] text-white">
      <Navbar />
      <main>{children}</main>

      <footer className="border-t border-white/5 py-10 px-6 mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <Link href="/" className="flex items-center gap-2 text-sm font-bold mb-1.5">
                <div className="p-1 bg-brand rounded-lg">
                  <Zap size={12} className="text-black fill-current" />
                </div>
                <span className="text-white">JobSpeeder</span>
              </Link>
              <p className="text-xs text-white/25 max-w-[200px]">
                L&apos;automatisation intelligente de vos candidatures.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Produit</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/pricing" className="text-xs text-white/35 hover:text-white/70 transition-colors">Tarifs</Link>
                  <Link href="/blog" className="text-xs text-white/35 hover:text-white/70 transition-colors">Blog</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Légal</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/confidentialite" className="text-xs text-white/35 hover:text-white/70 transition-colors">Confidentialité</Link>
                  <Link href="/cgu" className="text-xs text-white/35 hover:text-white/70 transition-colors">CGU</Link>
                  <Link href="/cookies" className="text-xs text-white/35 hover:text-white/70 transition-colors">Cookies</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Compte</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/login" className="text-xs text-white/35 hover:text-white/70 transition-colors">Connexion</Link>
                  <Link href="/register" className="text-xs text-white/35 hover:text-white/70 transition-colors">S&apos;inscrire</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-white/20">© 2025 JobSpeeder. Tous droits réservés.</p>
            <div className="flex items-center gap-1.5">
              <Mail size={11} className="text-white/20" />
              <a href="mailto:info@jobspeeder.online" className="text-xs text-white/25 hover:text-brand/70 transition-colors">
                info@jobspeeder.online
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
