'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { PublicJob } from '@/lib/jobs-db'

interface JobApplicationButtonProps {
  job: PublicJob
}

export default function JobApplicationButton({ job }: JobApplicationButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const webhookUrl = process.env.NEXT_PUBLIC_JOBSPEEDER_WEBHOOK
      if (!webhookUrl) {
        throw new Error('Webhook non configuré')
      }

      const payload = {
        source: 'forem_jobs_instant',
        job: {
          id: job.id,
          titre: job.titre,
          employeur: job.employeur,
          lien_candidature: job.lien_candidature,
          localisation: job.localisation,
          type_contrat: job.type_contrat,
        },
        timestamp: new Date().toISOString(),
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm ${
        success
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-brand text-gray-950 hover:bg-brand/90'
      } disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <Send className="w-4 h-4" />
      {loading ? 'Envoi...' : success ? '✓ Envoyée' : 'Candidature en un clic'}
    </button>
  )
}
