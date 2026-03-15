import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Footer } from '@/components/Footer'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Language switcher top-right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="flex-1">
        {children}
      </div>

      <Footer />
    </div>
  )
}
