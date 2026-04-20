'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export function JobsNavbar() {
  return (
    <nav className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-v2.png"
            alt="JobSpeeder"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-gray-300 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
            Tarifs
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg bg-brand text-gray-950 font-semibold hover:bg-brand/90 transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </nav>
  )
}

export function JobsFooter() {
  return (
    <footer className="border-t border-gray-800 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
            À propos
          </Link>
          <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">
            FAQ
          </Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Tarifs
          </Link>
          <Link href="/confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
            Confidentialité
          </Link>
          <Link href="/cgu" className="text-sm text-gray-400 hover:text-white transition-colors">
            CGU
          </Link>
          <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
            Cookies
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-500" />
          <p className="text-sm text-gray-400">
            Contact :{' '}
            <a href="mailto:info@jobspeeder.online" className="text-brand hover:text-brand/80 transition-colors">
              info@jobspeeder.online
            </a>
          </p>
        </div>

        <p className="text-xs text-gray-600">© 2024-2025 JobSpeeder. Tous droits réservés.</p>
      </div>
    </footer>
  )
}
