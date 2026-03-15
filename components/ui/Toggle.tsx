'use client'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-dark',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          checked ? 'bg-brand' : 'bg-white/20'
        )}
      >
        <span className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1'
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-white/50">{description}</p>}
        </div>
      )}
    </div>
  )
}
