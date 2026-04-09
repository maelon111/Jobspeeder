/**
 * Seed script — migre les articles statiques de lib/blog-posts.ts vers Supabase.
 * Usage: node scripts/seed-blog.mjs
 * Requiert: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY dans l'env
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

// Charge les variables d'env depuis .env.local
const envFile = readFileSync('.env.local', 'utf-8')
const env = Object.fromEntries(
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

// Import des posts statiques — on les inline ici pour éviter de transpiler TS
// (copie manuelle du contenu de lib/blog-posts.ts au format JS)
const require = createRequire(import.meta.url)

// Lecture du fichier TS et extraction des posts via eval simplifié
// → On utilise un import dynamique via tsx si disponible, sinon extraction manuelle
async function loadPosts() {
  try {
    // Tente d'importer via tsx
    const { BLOG_POSTS } = await import('../lib/blog-posts.ts')
    return BLOG_POSTS
  } catch {
    console.error('Impossible d\'importer lib/blog-posts.ts directement.')
    console.error('Lance ce script avec: npx tsx scripts/seed-blog.mjs')
    process.exit(1)
  }
}

async function main() {
  console.log('Chargement des articles statiques...')
  const posts = await loadPosts()
  console.log(`${posts.length} article(s) à migrer`)

  let inserted = 0
  let skipped = 0

  for (const post of posts) {
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
      console.error(`  ✗ ${post.slug}:`, error.message)
      skipped++
    } else {
      console.log(`  ✓ ${post.slug}`)
      inserted++
    }
  }

  console.log(`\nTerminé — ${inserted} insérés, ${skipped} ignorés/erreurs`)
}

main().catch(console.error)
