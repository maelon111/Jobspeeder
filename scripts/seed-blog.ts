/**
 * Seed script — migre les articles statiques de lib/blog-posts.ts vers Supabase.
 * Usage (depuis /opt/jobspeeder) : npx tsx scripts/seed-blog.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { BLOG_POSTS } from '../lib/blog-posts'

// Charge les variables d'env depuis .env.local
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
const env: Record<string, string> = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
    })
)

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
)

async function main() {
  console.log(`Seeding ${BLOG_POSTS.length} article(s)...`)

  let inserted = 0
  let skipped = 0

  for (const post of BLOG_POSTS) {
    const { error } = await supabase
      .from('blog_posts')
      .upsert({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        category_slug: post.categorySlug,
        author: post.author,
        author_role: post.authorRole,
        published_at: post.publishedAt,
        updated_at: post.updatedAt,
        reading_time_min: post.readingTimeMin,
        gradient: post.gradient,
        tags: post.tags,
        content: post.content,
        published: true,
      }, { onConflict: 'slug', ignoreDuplicates: true })

    if (error) {
      console.error(`  ✗ ${post.slug}: ${error.message}`)
      skipped++
    } else {
      console.log(`  ✓ ${post.slug}`)
      inserted++
    }
  }

  console.log(`\nTerminé — ${inserted} insérés, ${skipped} ignorés/erreurs`)
}

main().catch(console.error)
