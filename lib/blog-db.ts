import { createClient } from '@supabase/supabase-js'
import type { ContentBlock, BlogPost } from './blog-posts'

// Service-role client — server-side only, never expose to browser
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Anon client for public reads (RLS: published = true)
function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── Row shape from Supabase ──────────────────────────────────────────────────
type BlogPostRow = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  category_slug: string
  author: string
  author_role: string
  published_at: string
  updated_at: string
  reading_time_min: number
  gradient: string
  tags: string[]
  content: ContentBlock[]
  published: boolean
}

function rowToPost(row: BlogPostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    categorySlug: row.category_slug,
    author: row.author,
    authorRole: row.author_role,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readingTimeMin: row.reading_time_min,
    gradient: row.gradient,
    tags: row.tags,
    content: row.content,
  }
}

// ── Public reads ─────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await publicClient()
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[blog-db] getAllPosts error:', error)
    return []
  }
  return (data as BlogPostRow[]).map(rowToPost)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await publicClient()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null
  return rowToPost(data as BlogPostRow)
}

export async function getRelatedPosts(
  currentSlug: string,
  limit = 2
): Promise<BlogPost[]> {
  const { data, error } = await publicClient()
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return (data as BlogPostRow[]).map(rowToPost)
}

export async function getAllSlugs(): Promise<string[]> {
  const { data, error } = await publicClient()
    .from('blog_posts')
    .select('slug')
    .eq('published', true)

  if (error || !data) return []
  return data.map((r: { slug: string }) => r.slug)
}

// ── Admin writes ─────────────────────────────────────────────────────────────

export type CreatePostInput = {
  slug: string
  title: string
  excerpt: string
  category: string
  categorySlug: string
  author?: string
  authorRole?: string
  publishedAt?: string
  readingTimeMin: number
  gradient: string
  tags: string[]
  content: ContentBlock[]
  published?: boolean
}

export async function createPost(input: CreatePostInput): Promise<BlogPost | null> {
  const { data, error } = await adminClient()
    .from('blog_posts')
    .insert({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      category: input.category,
      category_slug: input.categorySlug,
      author: input.author ?? 'Équipe JobSpeeder',
      author_role: input.authorRole ?? 'Experts en recrutement IA',
      published_at: input.publishedAt ?? new Date().toISOString(),
      reading_time_min: input.readingTimeMin,
      gradient: input.gradient,
      tags: input.tags,
      content: input.content,
      published: input.published ?? true,
    })
    .select()
    .single()

  if (error) {
    console.error('[blog-db] createPost error:', error)
    return null
  }
  return rowToPost(data as BlogPostRow)
}
