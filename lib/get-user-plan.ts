import { SupabaseClient } from '@supabase/supabase-js'

export interface UserPlanInfo {
  plan: string
  status: string
  billing_period: string
  current_period_end: string | null
}

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPlanInfo> {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, billing_period, current_period_end')
    .eq('user_id', userId)
    .single()

  return {
    plan: data?.plan ?? 'decouverte',
    status: data?.status ?? 'active',
    billing_period: data?.billing_period ?? 'monthly',
    current_period_end: data?.current_period_end ?? null,
  }
}
