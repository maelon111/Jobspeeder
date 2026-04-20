'use client'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useT } from '@/lib/translations'

export function Footer({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()
  const tr = useT(lang)

  return (
    <footer className={`border-t border-white/5 py-5 px-6 ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Legal links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/about" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            {tr.footer.about}
          </Link>
          <Link href="/faq" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            FAQ
          </Link>
          <Link href="/pricing" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            {tr.footer.pricing}
          </Link>
          <Link href="/confidentialite" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            {tr.footer.privacy}
          </Link>
          <Link href="/cgu" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            {tr.footer.terms}
          </Link>
          <Link href="/cookies" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            {tr.footer.cookies}
          </Link>
        </div>

        {/* Contact */}
        <div className="flex items-start gap-1.5">
          <Mail size={12} className="text-white/20 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/25">
            {tr.footer.contact}{' '}
            <a href="mailto:info@jobspeeder.online" className="text-brand/60 hover:text-brand transition-colors">
              info@jobspeeder.online
            </a>
          </p>
        </div>

        <p className="text-xs text-white/15">{tr.footer.rights}</p>
      </div>
    </footer>
  )
}
