import { createClient } from '@supabase/supabase-js'

const publicClient = () => createClient(
  'https://ecbwdvdhxqbeqkoblcjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjYndkdmRoeHFiZXFrb2JsY2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODM5ODMsImV4cCI6MjA4ODE1OTk4M30.YL5TVqevFNeAHYHGAmEnlvPsnJNwKH5oOgZPJQ0AZcc'
)

async function getPublishedJobs(page = 1, perPage = 30) {
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  const { data, error, count } = await publicClient()
    .from('public_jobs')
    .select('*', { count: 'exact' })
    .eq('published', true)
    .order('date_publication', { ascending: false })
    .range(from, to)
  
  console.log('Error:', error?.message || 'none')
  console.log('Count:', count)
  console.log('Data length:', data?.length || 0)
  
  return { jobs: (data ?? []), total: count ?? 0 }
}

await getPublishedJobs(1, 100)
