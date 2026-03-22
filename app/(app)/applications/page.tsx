'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import {
  Briefcase, Search, RefreshCw,
  ChevronLeft, ChevronRight,
  Zap, Upload, FileText
} from 'lucide-react'

type JobOffer = {
  titre: string
  entreprise_nom: string
  logo_entreprise: string | null
  date: string | null
}

const CONTRACT_TYPES = ['CDI', 'CDD', 'Freelance', 'Stage']

// [TASK 1] Mapping libellés → valeurs API pour le champ job_type
const JOB_TYPES: { label: string; value: string }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Temps plein', value: 'fulltime' },
  { label: 'Temps partiel', value: 'parttime' },
]
const COUNTRIES = [
  'Argentina', 'Australia', 'Austria', 'Bahrain', 'Bangladesh', 'Belgium', 'Bulgaria', 'Brazil',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
  'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Ireland', 'Italy', 'Japan', 'Kuwait',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta', 'Mexico', 'Morocco', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Saudi Arabia', 'Singapore',
  'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Venezuela', 'Vietnam',
]
const WORK_MODES = ['Présentiel', 'Distanciel', 'Hybride']

const PER_PAGE = 20

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  // Campaign form
  const [showCampaignModal, setShowCampaignModal] = useState(false)
  const [campaignSuccess, setCampaignSuccess] = useState(false)
  const [launching, setLaunching] = useState(false)
  const [campaignForm, setCampaignForm] = useState({
    cv: null as File | null,
    poste: '',
    ville: '',
    pays: '',
    contrat: [] as string[],
    mode: '',
    // [TASK 1] Champ type de travail (valeur API)
    job_type: 'all',
    rayon: '20',
    salary_expectation: '',
    availability: 'Immédiate',
    work_authorization: 'Oui, sans restriction',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleContrat(type: string) {
    setCampaignForm(prev => ({
      ...prev,
      contrat: prev.contrat.includes(type)
        ? prev.contrat.filter(c => c !== type)
        : [...prev.contrat, type],
    }))
  }

  function resetCampaign() {
    // [TASK 1] job_type réinitialisé à 'all'
    setCampaignForm({ cv: null, poste: '', ville: '', pays: '', contrat: [], mode: '', job_type: 'all', rayon: '20', salary_expectation: '', availability: 'Immédiate', work_authorization: 'Oui, sans restriction' })
    setCampaignSuccess(false)
    setShowCampaignModal(false)
  }

  async function handleLaunchCampaign() {
    const { cv, poste, ville, pays, contrat, mode } = campaignForm
    if (!cv || !poste || !ville || !pays || contrat.length === 0 || !mode) return
    setLaunching(true)

    try {
      console.log('[campaign] step 1: getUser')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      console.log('[campaign] step 2: user =', user?.id)
      if (!user) return

      console.log('[campaign] step 3: uploading CV')
      const fileExt = cv.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('campaign-cvs')
        .upload(filePath, cv, { upsert: true })
      console.log('[campaign] step 4: upload done, error =', uploadError)

      let cvUrl = ''
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('campaign-cvs').getPublicUrl(filePath)
        cvUrl = publicUrl
      }

      console.log('[campaign] step 5: firing webhook')
      const webhookRes = await fetch('/api/campaign/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          user_email: user.email,
          cv_url: cvUrl,
          cv_filename: cv.name,
          poste,
          ville,
          pays,
          type_contrat: contrat,
          mode_travail: mode,
          // [TASK 1] Champ job_type inclus dans le payload webhook n8n
          job_type: campaignForm.job_type,
          rayon: campaignForm.rayon,
          salary_expectation: campaignForm.salary_expectation || null,
          availability: campaignForm.availability,
          work_authorization: campaignForm.work_authorization,
          launched_at: new Date().toISOString(),
        }),
      })
      console.log('[campaign] step 5b: webhook status =', webhookRes.status)

      console.log('[campaign] step 6: success')
      setCampaignSuccess(true)
    } catch (err) {
      console.error('[campaign] ERROR:', err)
    } finally {
      console.log('[campaign] finally: setLaunching(false)')
      setLaunching(false)
    }
  }

  const loadJobs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      limit: String(PER_PAGE),
      offset: String(page * PER_PAGE),
    })
    if (search.trim()) params.set('search', search.trim())
    const res = await fetch(`/api/job-offers?${params}`)
    const data = await res.json()
    setJobs(data.jobs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(loadJobs, search ? 400 : 0)
    return () => clearTimeout(t)
  }, [loadJobs, search])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Candidature automatique</h1>
          <p className="text-white/40 mt-1">{total} candidature{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={() => { setCampaignSuccess(false); setShowCampaignModal(true) }}>
          <Zap size={16} />
          Nouvelle campagne
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher entreprise, poste..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0) }}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-white/30">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-4 bg-white/5 rounded-2xl inline-flex mb-4">
              <Briefcase size={32} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm">Aucune candidature trouvée</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Poste</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Entreprise</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Statut</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobs.map((job, i) => (
                    <tr key={i} className="hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{job.titre}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {job.logo_entreprise && (
                            <img
                              src={job.logo_entreprise}
                              alt=""
                              className="w-10 h-10 rounded object-contain bg-white/5"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                          <span className="text-sm text-white/60">{job.entreprise_nom || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/20">
                          Envoyée
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30 hidden sm:table-cell">
                        {job.date ? new Date(job.date).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
                <span className="text-xs text-white/30">
                  {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, total)} sur {total}
                </span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Campaign modal */}
      <Modal
        open={showCampaignModal}
        onClose={resetCampaign}
        title="Nouvelle campagne de candidature automatique"
        className="max-w-2xl"
      >
        {/* Animation robots — thème JobSpeeder (vert néon #00ff88, fond sombre, glassmorphism) */}
        {(launching || campaignSuccess) ? (
          <div className="relative w-full overflow-hidden rounded-2xl text-center" style={{background:'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.07) 0%, transparent 65%)'}}>
            <style>{`
              @keyframes js-bob1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
              @keyframes js-bob2 { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(5px)} }
              @keyframes js-bob3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
              @keyframes js-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
              @keyframes js-spinr { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
              @keyframes js-scan  { 0%,100%{transform:translateY(0px);opacity:.8} 50%{transform:translateY(13px);opacity:.15} }
              @keyframes js-ant   { 0%,100%{opacity:1;filter:drop-shadow(0 0 4px #00ff88)} 50%{opacity:.2;filter:none} }
              @keyframes js-mail  { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 65%{transform:translate(18px,-24px) rotate(-20deg);opacity:.3} 100%{transform:translate(32px,-44px) rotate(-25deg);opacity:0} }
              @keyframes js-ptcl  { 0%{transform:translateY(0);opacity:0} 10%{opacity:.8} 88%{opacity:.5} 100%{transform:translateY(-65px);opacity:0} }
              @keyframes js-flow  { 0%{transform:translateX(-10px);opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{transform:translateX(58px);opacity:0} }
              @keyframes js-prog  { 0%{width:3%} 88%{width:92%} 100%{width:92%} }
              @keyframes js-shim  { 0%{left:-40%} 100%{left:130%} }
              @keyframes js-ring  { 0%{transform:scale(.8);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
              @keyframes js-ok    { 0%{transform:scale(.5) translateY(18px);opacity:0} 65%{transform:scale(1.05) translateY(-2px);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
              @keyframes js-chk   { from{stroke-dashoffset:64} to{stroke-dashoffset:0} }
              @keyframes js-glow  { 0%,100%{opacity:.6} 50%{opacity:1} }
              .js-b1{animation:js-bob1 2.6s ease-in-out infinite}
              .js-b2{animation:js-bob2 2.1s ease-in-out infinite}
              .js-b3{animation:js-bob3 2.9s ease-in-out infinite}
              .js-g1{animation:js-spin 2.2s linear infinite;transform-origin:center}
              .js-g2{animation:js-spinr 2.2s linear infinite;transform-origin:center}
              .js-scan{animation:js-scan 1.6s ease-in-out infinite}
              .js-ant{animation:js-ant 1.1s ease-in-out infinite}
              .js-mail{animation:js-mail 2.4s ease-out infinite}
              .js-glow{animation:js-glow 1.5s ease-in-out infinite}
              .js-ok{animation:js-ok .6s cubic-bezier(.34,1.56,.64,1) forwards}
              .js-ring{animation:js-ring 1.5s ease-out infinite}
              .js-chk{animation:js-chk .55s .2s ease-out forwards;stroke-dasharray:64;stroke-dashoffset:64}
            `}</style>

            {campaignSuccess ? (
              /* ─── Succès ─── */
              <div className="flex flex-col items-center gap-5 py-10 js-ok">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-28 h-28 rounded-full js-ring" style={{background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.15)'}}/>
                  <div className="absolute w-20 h-20 rounded-full js-ring" style={{background:'rgba(0,255,136,.06)',border:'1px solid rgba(0,255,136,.1)',animationDelay:'.35s'}}/>
                  <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{background:'rgba(0,255,136,.08)',border:'1.5px solid rgba(0,255,136,.35)',boxShadow:'0 0 40px rgba(0,255,136,.2), inset 0 0 20px rgba(0,255,136,.05)'}}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <polyline points="6,18 14,26 30,10" stroke="#00ff88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="js-chk"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-xl text-white tracking-tight">Campagne lancée !</p>
                  <p className="text-white/40 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                    Vos agents IA sont en route — vos candidatures vont être déposées automatiquement.
                  </p>
                </div>
                <Button onClick={resetCampaign}>Fermer</Button>
              </div>
            ) : (
              /* ─── Robots au travail ─── */
              <div className="relative flex flex-col items-center gap-5 py-7 px-4">

                {/* Grille verte subtile */}
                <div className="absolute inset-0 opacity-[0.045]" style={{backgroundImage:'linear-gradient(rgba(0,255,136,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,1) 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>

                {/* Particules vertes flottantes */}
                {[10,22,36,50,63,76,42,58].map((l,i)=>(
                  <div key={i} className="absolute bottom-0 rounded-full pointer-events-none"
                    style={{left:`${l}%`,width:'3px',height:'3px',background:'#00ff88',opacity:.6,
                      animation:`js-ptcl ${2.4+i*.32}s ease-out infinite ${i*.26}s`}}/>
                ))}

                {/* Lueur centrale derrière les robots */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
                  style={{background:'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)'}}/>

                {/* ─── Scène des 3 robots ─── */}
                <div className="relative flex items-end justify-center gap-5 z-10 w-full max-w-md mx-auto">

                  {/* Robot 1 — Scanner */}
                  <div className="js-b1 flex flex-col items-center gap-2.5">
                    <svg width="62" height="78" viewBox="0 0 62 78" fill="none" style={{filter:'drop-shadow(0 0 8px rgba(0,255,136,.45))'}}>
                      <rect x="30" y="0" width="2" height="9" fill="rgba(0,255,136,.5)"/>
                      <circle cx="31" cy="0" r="3.5" fill="#00ff88" className="js-ant"/>
                      {/* Tête */}
                      <rect x="7" y="9" width="48" height="30" rx="8" fill="#060c16" stroke="rgba(0,255,136,.6)" strokeWidth="1.5"/>
                      <rect x="12" y="14" width="38" height="20" rx="4" fill="#0a1220"/>
                      {/* Scan beam */}
                      <rect x="13" y="14" width="36" height="2.5" rx="1" fill="#00ff88" opacity=".7" className="js-scan" style={{filter:'drop-shadow(0 0 3px #00ff88)'}}/>
                      {/* Visor */}
                      <rect x="14" y="19" width="34" height="9" rx="3" fill="rgba(0,255,136,.06)" stroke="rgba(0,255,136,.3)" strokeWidth="1"/>
                      <rect x="16" y="21" width="30" height="5" rx="2" fill="rgba(0,255,136,.12)" className="js-glow"/>
                      {/* LED bouche */}
                      <rect x="19" y="33" width="8" height="2" rx="1" fill="#00ff88" opacity=".5"/>
                      <rect x="29" y="33" width="14" height="2" rx="1" fill="rgba(0,255,136,.2)"/>
                      {/* Cou */}
                      <rect x="27" y="39" width="8" height="5" rx="2" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1"/>
                      {/* Corps */}
                      <rect x="9" y="44" width="44" height="28" rx="8" fill="#060c16" stroke="rgba(0,255,136,.5)" strokeWidth="1.5"/>
                      {/* Traces circuit */}
                      <path d="M17 52 h7 v4 h5" stroke="rgba(0,255,136,.3)" strokeWidth=".8" fill="none"/>
                      <path d="M45 52 h-7 v4 h-5" stroke="rgba(0,255,136,.3)" strokeWidth=".8" fill="none"/>
                      <circle cx="17" cy="52" r="1.2" fill="rgba(0,255,136,.5)"/>
                      <circle cx="45" cy="52" r="1.2" fill="rgba(0,255,136,.5)"/>
                      {/* Loupe */}
                      <circle cx="31" cy="61" r="6.5" stroke="#00ff88" strokeWidth="1.4" fill="rgba(0,255,136,.06)" style={{filter:'drop-shadow(0 0 4px rgba(0,255,136,.4))'}}/>
                      <circle cx="29.5" cy="59.5" r="3.5" stroke="rgba(0,255,136,.5)" strokeWidth="1" fill="none"/>
                      <line x1="33" y1="63" x2="36" y2="66" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round"/>
                      {/* Bras */}
                      <rect x="1" y="46" width="8" height="16" rx="4" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1.2"/>
                      <rect x="53" y="46" width="8" height="16" rx="4" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1.2"/>
                    </svg>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.2)',color:'rgba(0,255,136,.85)'}}>
                      Recherche
                    </span>
                  </div>

                  {/* Flux 1→2 */}
                  <div className="relative w-10 mb-12 overflow-hidden" style={{height:'6px'}}>
                    {[0,.5,1].map(d=>(
                      <div key={d} className="absolute rounded-full"
                        style={{width:'6px',height:'6px',background:'#00ff88',top:0,
                          boxShadow:'0 0 6px #00ff88',
                          animation:`js-flow 1.6s linear infinite ${d}s`}}/>
                    ))}
                  </div>

                  {/* Robot 2 — Processeur (central, plus grand) */}
                  <div className="js-b2 flex flex-col items-center gap-2.5 -mb-3">
                    <svg width="76" height="94" viewBox="0 0 76 94" fill="none" style={{filter:'drop-shadow(0 0 12px rgba(0,255,136,.55))'}}>
                      {/* Antennes */}
                      <rect x="29" y="0" width="2" height="11" fill="rgba(0,255,136,.5)"/>
                      <rect x="45" y="0" width="2" height="8" fill="rgba(0,255,136,.3)"/>
                      <circle cx="30" cy="0" r="4" fill="#00ff88" className="js-ant"/>
                      <circle cx="30" cy="0" r="2" fill="white" opacity=".6" className="js-ant"/>
                      <circle cx="46" cy="0" r="2.5" fill="rgba(0,255,136,.5)"/>
                      {/* Tête */}
                      <rect x="7" y="11" width="62" height="34" rx="10" fill="#060c16" stroke="rgba(0,255,136,.7)" strokeWidth="2"/>
                      <rect x="13" y="17" width="50" height="22" rx="5" fill="#0a1220"/>
                      {/* Yeux carrés */}
                      <rect x="17" y="21" width="15" height="11" rx="3.5" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1"/>
                      <rect x="44" y="21" width="15" height="11" rx="3.5" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1"/>
                      <rect x="19" y="23" width="11" height="7" rx="2" fill="rgba(0,255,136,.2)" className="js-glow"/>
                      <rect x="46" y="23" width="11" height="7" rx="2" fill="rgba(0,255,136,.2)" className="js-glow"/>
                      <circle cx="24.5" cy="26.5" r="2.5" fill="#00ff88" style={{filter:'drop-shadow(0 0 4px #00ff88)'}}/>
                      <circle cx="51.5" cy="26.5" r="2.5" fill="#00ff88" style={{filter:'drop-shadow(0 0 4px #00ff88)'}}/>
                      {/* Barres données */}
                      <rect x="18" y="36" width="4" height="2.5" rx="1" fill="#00ff88" opacity=".8"/>
                      <rect x="24" y="36" width="9" height="2.5" rx="1" fill="rgba(0,255,136,.4)"/>
                      <rect x="35" y="36" width="4" height="2.5" rx="1" fill="#00ff88" opacity=".8"/>
                      <rect x="41" y="36" width="9" height="2.5" rx="1" fill="rgba(0,255,136,.4)"/>
                      {/* Cou */}
                      <rect x="33" y="45" width="10" height="6" rx="3" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1.2"/>
                      {/* Corps */}
                      <rect x="5" y="51" width="66" height="38" rx="10" fill="#060c16" stroke="rgba(0,255,136,.7)" strokeWidth="2"/>
                      {/* Engrenage central */}
                      <g className="js-g1" style={{transformOrigin:'38px 70px'}}>
                        <circle cx="38" cy="70" r="10" fill="rgba(0,255,136,.06)" stroke="#00ff88" strokeWidth="2" style={{filter:'drop-shadow(0 0 5px rgba(0,255,136,.5))'}}/>
                        <circle cx="38" cy="70" r="4" fill="#060c16" stroke="#00ff88" strokeWidth="1.5"/>
                        {[0,45,90,135,180,225,270,315].map((a,i)=>(
                          <rect key={i} x="37" y="59" width="2" height="3.5" rx="1" fill="#00ff88"
                            style={{transformOrigin:'38px 70px',transform:`rotate(${a}deg)`,opacity:.9}}/>
                        ))}
                      </g>
                      {/* Petits engrenages */}
                      <g className="js-g2" style={{transformOrigin:'20px 70px'}}>
                        <circle cx="20" cy="70" r="6" stroke="rgba(0,255,136,.5)" strokeWidth="1.2" fill="rgba(0,255,136,.04)"/>
                        <circle cx="20" cy="70" r="2" fill="#060c16" stroke="rgba(0,255,136,.5)" strokeWidth="1"/>
                        {[0,60,120,180,240,300].map((a,i)=>(
                          <rect key={i} x="19.2" y="63.5" width="1.6" height="2.5" rx=".8" fill="rgba(0,255,136,.6)"
                            style={{transformOrigin:'20px 70px',transform:`rotate(${a}deg)`}}/>
                        ))}
                      </g>
                      <g className="js-g1" style={{transformOrigin:'56px 70px'}}>
                        <circle cx="56" cy="70" r="6" stroke="rgba(0,255,136,.5)" strokeWidth="1.2" fill="rgba(0,255,136,.04)"/>
                        <circle cx="56" cy="70" r="2" fill="#060c16" stroke="rgba(0,255,136,.5)" strokeWidth="1"/>
                        {[0,60,120,180,240,300].map((a,i)=>(
                          <rect key={i} x="55.2" y="63.5" width="1.6" height="2.5" rx=".8" fill="rgba(0,255,136,.6)"
                            style={{transformOrigin:'56px 70px',transform:`rotate(${a}deg)`}}/>
                        ))}
                      </g>
                      {/* Bras */}
                      <rect x="-3" y="53" width="8" height="20" rx="4" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1.4"/>
                      <rect x="71" y="53" width="8" height="20" rx="4" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1.4"/>
                    </svg>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{background:'rgba(0,255,136,.12)',border:'1px solid rgba(0,255,136,.3)',color:'#00ff88',boxShadow:'0 0 12px rgba(0,255,136,.15)'}}>
                      Traitement
                    </span>
                  </div>

                  {/* Flux 2→3 */}
                  <div className="relative w-10 mb-12 overflow-hidden" style={{height:'6px'}}>
                    {[0,.5,1].map(d=>(
                      <div key={d} className="absolute rounded-full"
                        style={{width:'6px',height:'6px',background:'#00ff88',top:0,
                          boxShadow:'0 0 6px #00ff88',
                          animation:`js-flow 1.6s linear infinite ${d+.3}s`}}/>
                    ))}
                  </div>

                  {/* Robot 3 — Envoi */}
                  <div className="js-b3 flex flex-col items-center gap-2.5">
                    <div className="relative">
                      <svg width="62" height="78" viewBox="0 0 62 78" fill="none" style={{filter:'drop-shadow(0 0 8px rgba(0,255,136,.4))'}}>
                        <rect x="30" y="0" width="2" height="9" fill="rgba(0,255,136,.5)"/>
                        <circle cx="31" cy="0" r="3.5" fill="#00ff88" className="js-ant" style={{animationDelay:'.5s'}}/>
                        {/* Tête */}
                        <rect x="7" y="9" width="48" height="30" rx="8" fill="#060c16" stroke="rgba(0,255,136,.55)" strokeWidth="1.5"/>
                        <rect x="12" y="14" width="38" height="20" rx="4" fill="#0a1220"/>
                        {/* Yeux ronds */}
                        <circle cx="22" cy="24" r="5" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1"/>
                        <circle cx="40" cy="24" r="5" fill="#060c16" stroke="rgba(0,255,136,.4)" strokeWidth="1"/>
                        <circle cx="22" cy="24" r="2.8" fill="rgba(0,255,136,.25)" className="js-glow"/>
                        <circle cx="40" cy="24" r="2.8" fill="rgba(0,255,136,.25)" className="js-glow"/>
                        <circle cx="22" cy="24" r="1.2" fill="#00ff88" style={{filter:'drop-shadow(0 0 3px #00ff88)'}}/>
                        <circle cx="40" cy="24" r="1.2" fill="#00ff88" style={{filter:'drop-shadow(0 0 3px #00ff88)'}}/>
                        {/* Barres signal */}
                        <rect x="20" y="33" width="3" height="2" rx=".8" fill="rgba(0,255,136,.3)"/>
                        <rect x="25" y="31.5" width="3" height="3.5" rx=".8" fill="rgba(0,255,136,.5)"/>
                        <rect x="30" y="30" width="3" height="5" rx=".8" fill="#00ff88" opacity=".8"/>
                        <rect x="35" y="31.5" width="3" height="3.5" rx=".8" fill="rgba(0,255,136,.5)"/>
                        {/* Cou */}
                        <rect x="27" y="39" width="8" height="5" rx="2" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1"/>
                        {/* Corps */}
                        <rect x="9" y="44" width="44" height="28" rx="8" fill="#060c16" stroke="rgba(0,255,136,.5)" strokeWidth="1.5"/>
                        {/* Icône enveloppe */}
                        <rect x="18" y="52" width="26" height="16" rx="3" fill="rgba(0,255,136,.06)" stroke="rgba(0,255,136,.4)" strokeWidth="1.2"/>
                        <path d="M18 54 L31 62 L44 54" stroke="#00ff88" strokeWidth="1.2" fill="none" opacity=".7"/>
                        {/* Traces circuit */}
                        <circle cx="17" cy="66" r="1.2" fill="rgba(0,255,136,.4)"/>
                        <circle cx="45" cy="66" r="1.2" fill="rgba(0,255,136,.4)"/>
                        {/* Bras */}
                        <rect x="1" y="46" width="8" height="16" rx="4" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1.2"/>
                        <rect x="53" y="46" width="8" height="16" rx="4" fill="#060c16" stroke="rgba(0,255,136,.35)" strokeWidth="1.2"/>
                      </svg>
                      {/* Enveloppe qui s'envole */}
                      <div className="absolute js-mail" style={{top:'43px',right:'-2px',pointerEvents:'none'}}>
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                          <rect width="16" height="12" rx="2" fill="rgba(0,255,136,.15)" stroke="#00ff88" strokeWidth="1" style={{filter:'drop-shadow(0 0 4px #00ff88)'}}/>
                          <path d="M0 2 L8 7 L16 2" stroke="#00ff88" strokeWidth="1" fill="none"/>
                        </svg>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{background:'rgba(0,255,136,.08)',border:'1px solid rgba(0,255,136,.2)',color:'rgba(0,255,136,.85)'}}>
                      Envoi
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className="relative z-10 space-y-1.5">
                  <p className="font-bold text-lg text-white tracking-tight">Vos agents sont au travail</p>
                  <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                    Votre campagne est en cours — critères configurés, candidatures en route.
                  </p>
                </div>

                {/* Barre de progression */}
                <div className="relative z-10 w-72">
                  <div className="flex justify-between text-xs mb-1.5" style={{color:'rgba(255,255,255,.3)'}}>
                    <span>Traitement en cours</span>
                    <span style={{color:'rgba(0,255,136,.7)'}}>● actif</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.06)'}}>
                    <div className="relative h-full rounded-full overflow-hidden"
                      style={{background:'linear-gradient(90deg, #00cc6a, #00ff88)',animation:'js-prog 4.5s cubic-bezier(.4,0,.2,1) infinite',boxShadow:'0 0 10px rgba(0,255,136,.5)'}}>
                      <div className="absolute inset-0 rounded-full"
                        style={{background:'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)',width:'35%',animation:'js-shim 1.8s ease-in-out infinite'}}/>
                    </div>
                  </div>
                </div>

                {/* Chips statut */}
                <div className="relative z-10 flex gap-2 flex-wrap justify-center">
                  {['3 agents actifs','Analyse IA','Candidatures en route'].map((label,i)=>(
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                      style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',color:'rgba(255,255,255,.4)'}}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{background:'#00ff88',boxShadow:'0 0 5px #00ff88',animation:`js-ant 1s ease-in-out infinite ${i*.3}s`}}/>
                      {label}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {/* CV Upload */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-2">CV (PDF ou DOCX) *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={e => setCampaignForm(prev => ({ ...prev, cv: e.target.files?.[0] ?? null }))}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 transition-colors ${
                  campaignForm.cv
                    ? 'border-brand/40 bg-brand/5'
                    : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {campaignForm.cv ? (
                  <>
                    <FileText size={24} className="text-brand" />
                    <span className="text-sm font-medium text-white">{campaignForm.cv.name}</span>
                    <span className="text-xs text-white/40">Cliquer pour changer</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-white/30" />
                    <span className="text-sm text-white/50">Glisser votre CV ici ou cliquer pour parcourir</span>
                    <span className="text-xs text-white/30">PDF, DOCX</span>
                  </>
                )}
              </button>
            </div>

            {/* Ligne 1 : Poste recherché | Prétentions salariales */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Poste recherché *"
                placeholder="Développeur Full Stack..."
                value={campaignForm.poste}
                onChange={e => setCampaignForm(prev => ({ ...prev, poste: e.target.value }))}
              />
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Prétentions salariales</label>
                <input
                  type="text"
                  placeholder="Ex: 45 000€ / an, Négociable..."
                  value={campaignForm.salary_expectation}
                  onChange={e => setCampaignForm(prev => ({ ...prev, salary_expectation: e.target.value }))}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>
            </div>

            {/* Ligne 2 : Pays | Ville | Rayon */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-1.5">Pays *</label>
                <select
                  value={campaignForm.pays}
                  onChange={e => setCampaignForm(prev => ({ ...prev, pays: e.target.value }))}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand/50 appearance-none"
                >
                  <option value="" disabled className="bg-dark-200">Sélectionner un pays</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country} className="bg-dark-200">{country}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Ville *"
                placeholder="Paris, Lyon..."
                value={campaignForm.ville}
                onChange={e => setCampaignForm(prev => ({ ...prev, ville: e.target.value }))}
              />
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Rayon (km)</label>
                <div className="flex gap-2">
                  {['20', '50', '100', '200'].map(r => {
                    const selected = campaignForm.rayon === r
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, rayon: r }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {r}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Ligne 3 : Type de contrat | Type de travail */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Type de contrat *</label>
                <div className="flex flex-wrap gap-2">
                  {CONTRACT_TYPES.map(type => {
                    const selected = campaignForm.contrat.includes(type)
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleContrat(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Type de travail</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(({ label, value }) => {
                    const selected = campaignForm.job_type === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, job_type: value }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Ligne 4 : Mode de travail | Disponibilité */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Mode de travail *</label>
                <div className="flex gap-2">
                  {WORK_MODES.map(mode => {
                    const selected = campaignForm.mode === mode
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, mode }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {mode}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 block mb-2">Disponibilité</label>
                <div className="flex gap-2">
                  {[
                    { label: 'Immédiate', value: 'Immédiate' },
                    { label: '1–3 mois', value: 'Entre 1 - 3 mois' },
                    { label: '3 mois+', value: 'Plus de 3 mois' },
                  ].map(({ label, value }) => {
                    const selected = campaignForm.availability === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setCampaignForm(prev => ({ ...prev, availability: value }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          selected
                            ? 'bg-brand/20 border-brand/40 text-brand'
                            : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" onClick={resetCampaign} className="flex-1">
                Annuler
              </Button>
              <Button
                onClick={handleLaunchCampaign}
                loading={launching}
                disabled={
                  !campaignForm.cv || !campaignForm.poste || !campaignForm.ville ||
                  !campaignForm.pays || campaignForm.contrat.length === 0 || !campaignForm.mode
                }
                className="flex-1"
              >
                <Zap size={15} />
                Lancer la campagne
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
