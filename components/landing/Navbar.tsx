'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return !prev
    })
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div
        className={`max-w-5xl mx-auto rounded-2xl px-5 py-3 transition-all duration-300 ${
          scrolled
            ? 'bg-[#060c16]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'glass'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-v2.png"
              alt="JobSpeeder"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/pricing"
              className="text-sm text-white/55 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-sm text-white/55 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2 bg-brand text-black rounded-xl hover:bg-brand-dark transition-all duration-150 active:scale-95"
            >
              Commencer →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMenu}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 transition-colors border border-white/10"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 pt-3 pb-1">
                <Link
                  href="/pricing"
                  onClick={closeMenu}
                  className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/8 text-center"
                >
                  Tarifs
                </Link>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2.5 rounded-xl hover:bg-white/8 text-center"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="text-sm font-bold px-4 py-2.5 bg-brand text-black rounded-xl hover:bg-brand-dark transition-colors text-center"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
