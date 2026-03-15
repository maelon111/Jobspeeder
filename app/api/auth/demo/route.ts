import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEMO_EMAIL = 'demo@jobspeeder.app'
const DEMO_PASSWORD = 'DemoJobSpeeder2024'
const DEMO_NAME = 'Alex Demo'

export async function POST() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Try to sign in first (demo user might already exist)
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: signInData } = await supabaseClient.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (signInData.session) {
    return NextResponse.json({ ok: true })
  }

  // Demo user doesn't exist, create it
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: DEMO_NAME },
  })

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: 'Impossible de créer le compte démo. Veuillez d\'abord appliquer le fix SQL dans Supabase.' },
      { status: 500 }
    )
  }

  // Manually create profile (in case trigger failed)
  await supabaseAdmin.from('profiles').upsert({
    user_id: newUser.user.id,
    full_name: DEMO_NAME,
    location: 'Paris, France',
    linkedin_url: 'linkedin.com/in/alex-demo',
  }).eq('user_id', newUser.user.id)

  // Seed some demo applications
  const demoApps = [
    { user_id: newUser.user.id, company: 'Spotify', job_title: 'Product Manager', status: 'interview', applied_via: 'email' },
    { user_id: newUser.user.id, company: 'Doctolib', job_title: 'Senior PM', status: 'sent', applied_via: 'skyvern' },
    { user_id: newUser.user.id, company: 'Blablacar', job_title: 'Product Manager', status: 'viewed', applied_via: 'skyvern' },
    { user_id: newUser.user.id, company: 'Criteo', job_title: 'Growth PM', status: 'rejected', applied_via: 'email' },
    { user_id: newUser.user.id, company: 'Contentsquare', job_title: 'PM Data', status: 'pending', applied_via: 'skyvern' },
  ]
  await supabaseAdmin.from('applications').insert(demoApps)

  // Seed demo CV
  const demoCV = {
    summary: 'Product Manager avec 5 ans d\'expérience dans les startups B2C et SaaS. Spécialisé en growth et data.',
    experience: [
      { title: 'Senior Product Manager', company: 'Startup SaaS', start_date: '01/2022', current: true, bullets: ['Lancement de 3 features majeures', 'Augmentation de la rétention de 25%'] },
    ],
    education: [{ degree: 'Master en Management', school: 'HEC Paris', graduation_year: '2019' }],
    skills: ['Product Strategy', 'SQL', 'Figma', 'A/B Testing', 'Agile', 'OKRs'],
    languages: [{ language: 'Français', level: 'Natif' }, { language: 'Anglais', level: 'Courant' }],
  }
  await supabaseAdmin.from('cvs').insert({
    user_id: newUser.user.id,
    name: 'CV Principal',
    content_json: demoCV,
    is_active: true,
  })

  // Seed demo preferences
  await supabaseAdmin.from('job_preferences').upsert({
    user_id: newUser.user.id,
    job_title: 'Product Manager',
    location: 'Paris',
    contract_types: ['CDI'],
    work_mode: 'hybrid',
    work_time: 'full_time',
    salary_min: 65000,
    salary_max: 85000,
    is_active: true,
  })

  return NextResponse.json({ ok: true })
}
