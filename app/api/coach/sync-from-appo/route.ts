/**
 * JobSpeeder — POST /api/coach/sync-from-appo
 *
 * Called by the Appo Edge Function `sync-to-jobspeeder` when a coach
 * completes their Appo onboarding (onboarding_completed = true).
 *
 * Logic:
 * 1. Verifies the shared secret header
 * 2. If user exists in JobSpeeder: creates coach profile (if missing)
 * 3. If user doesn't exist: invites them by email (they get a magic link)
 *
 * Body: { email, appo_slug, display_name, appo_user_id }
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateReferralCode(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

function generateSlug(base: string): string {
  return `${base}-${Date.now().toString(36)}`
}

export async function POST(req: Request) {
  // Verify shared secret
  const secret = req.headers.get('x-sync-secret')
  if (!secret || secret !== process.env.APPO_SYNC_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  let body: { email: string; appo_slug?: string; display_name?: string; appo_user_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide' }, { status: 400 })
  }

  const { email, appo_slug, display_name, appo_user_id } = body

  if (!email) {
    return NextResponse.json({ error: 'email requis' }, { status: 400 })
  }

  const name = display_name || appo_slug || email.split('@')[0]
  const baseSlug = appo_slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

  // --- 1. Check if user already exists in JobSpeeder Supabase ---
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) {
    console.error('listUsers error:', listError)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  const existingUser = users.find(u => u.email === email)

  let userId: string

  if (existingUser) {
    userId = existingUser.id

    // Check if coach profile already exists
    const { data: existingCoach } = await supabaseAdmin
      .from('coaches')
      .select('id, referral_code')
      .eq('user_id', userId)
      .single()

    if (existingCoach) {
      // Already synced — update appo_slug if missing
      if (appo_slug) {
        await supabaseAdmin
          .from('coaches')
          .update({ appo_slug })
          .eq('id', existingCoach.id)
      }
      return NextResponse.json({
        action: 'already_exists',
        coach_id: existingCoach.id,
        referral_code: existingCoach.referral_code,
      })
    }

  } else {
    // --- 2. User doesn't exist — invite them ---
    const { data: invited, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: { role: 'coach', appo_slug: appo_slug || null },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://jobspeeder.online'}/coach/dashboard`,
      }
    )

    if (inviteError || !invited?.user) {
      console.error('inviteUserByEmail error:', inviteError)
      return NextResponse.json({ error: 'Erreur création compte', details: inviteError?.message }, { status: 500 })
    }

    userId = invited.user.id
  }

  // --- 3. Create coach profile ---
  const referral_code = generateReferralCode(baseSlug)
  const slug = generateSlug(baseSlug)

  const { data: coach, error: coachError } = await supabaseAdmin
    .from('coaches')
    .insert({
      user_id: userId,
      slug,
      name,
      email,
      appo_slug: appo_slug || null,
      referral_code,
      status: 'approved',
      is_active: true,
      commission_rate: 0.20,
      bio: null,
      specialties: [],
      country: 'France',
    })
    .select('id, referral_code, slug')
    .single()

  if (coachError) {
    console.error('Coach insert error:', coachError)
    return NextResponse.json({ error: 'Erreur création profil coach', details: coachError.message }, { status: 500 })
  }

  // Update user metadata to mark as coach
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { role: 'coach', appo_slug: appo_slug || null, appo_user_id: appo_user_id || null },
  })

  console.log(`[sync-from-appo] Coach créé: ${email} (appo: ${appo_slug}) → coach id: ${coach.id}`)

  return NextResponse.json({
    action: existingUser ? 'coach_created_existing_user' : 'user_invited_and_coach_created',
    coach_id: coach.id,
    referral_code: coach.referral_code,
    slug: coach.slug,
  }, { status: 201 })
}
