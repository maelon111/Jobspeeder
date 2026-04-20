'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { Navbar } from './Navbar'
import { Hero } from './Hero'
import { Stats } from './Stats'
import { HowItWorks } from './HowItWorks'
import { CTA } from './CTA'
import { useLanguage } from '@/lib/i18n'
import { useT } from '@/lib/translations'
import { BlobBackground } from '@/components/BlobBackground'

export function LandingContent() {
  const { lang } = useLanguage()
  const tr = useT(lang)
  const lf = tr.landingFooter

  return (
    <div className="min-h-screen bg-[#060c16]">
      <BlobBackground />
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <CTA />

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6 mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <Link href="/" className="flex items-center mb-1.5">
                <Image src="/logo-v2.png" alt="JobSpeeder" width={120} height={34} className="h-7 w-auto object-contain" />
              </Link>
              <p className="text-xs text-white/25 max-w-[200px]">
                {lf.tagline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">{lf.legal}</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/confidentialite" className="text-xs text-white/35 hover:text-white/70 transition-colors">{tr.footer.privacy}</Link>
                  <Link href="/cgu" className="text-xs text-white/35 hover:text-white/70 transition-colors">{tr.footer.terms}</Link>
                  <Link href="/cookies" className="text-xs text-white/35 hover:text-white/70 transition-colors">{tr.footer.cookies}</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">{lf.account}</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/login" className="text-xs text-white/35 hover:text-white/70 transition-colors">{tr.navbar.login}</Link>
                  <Link href="/register" className="text-xs text-white/35 hover:text-white/70 transition-colors">{lf.register}</Link>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">{lf.product}</span>
                <div className="flex flex-col gap-1.5">
                  <Link href="/pricing" className="text-xs text-white/35 hover:text-white/70 transition-colors">{tr.navbar.pricing}</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-white/20">{tr.footer.rights}</p>
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
