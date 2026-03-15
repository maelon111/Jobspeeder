'use client'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      {/* Modal */}
      <div className={cn(
        'relative z-10 w-full max-w-md rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]',
        'border border-white/10 animate-fade-in flex flex-col max-h-[90vh]',
        className
      )}
        style={{ background: 'rgba(14, 22, 35, 0.98)', backdropFilter: 'blur(20px)' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
            <h2 className="text-base font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/8"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  )
}
