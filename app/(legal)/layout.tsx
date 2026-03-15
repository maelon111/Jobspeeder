import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Footer } from '@/components/Footer'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        {children}
      </div>
      <Footer />
    </div>
  )
}
