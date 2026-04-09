import { NextRequest, NextResponse } from 'next/server'
import { getOpenAI } from '@/lib/openai'
import { createPost } from '@/lib/blog-db'
import type { ContentBlock } from '@/lib/blog-posts'

const SITE_URL = 'https://jobspeeder.online'

const GRADIENTS = [
  'from-brand/20 via-blue-500/10 to-purple-500/10',
  'from-purple-500/20 via-pink-500/10 to-brand/10',
  'from-blue-500/20 via-brand/10 to-teal-500/10',
  'from-sky-500/20 via-blue-500/10 to-brand/10',
  'from-yellow-500/20 via-orange-500/10 to-brand/10',
]

function randomGradient() {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
}

const SYSTEM_PROMPT = `Tu es un expert SEO senior et rédacteur de contenu pour JobSpeeder, un SaaS français qui automatise les candidatures d'emploi via l'IA (GPT-4o, n8n, Playwright).

Règles absolues :
- Langue : français, registre professionnel mais accessible
- Structure LLM-friendly : headings H2/H3 descriptifs et précis, paragraphes courts (3-5 lignes max), listes factuelles
- SEO : un seul H1 implicite (le title), H2 en mots-clés longue traîne, alt-text implicite dans les callouts
- Maillage interne naturel : mentionne JobSpeeder de façon contextuelle (pas publicitaire) dans 2-3 paragraphes
- Longueur : 1200 à 1800 mots au total (tous les blocs combinés)
- readingTimeMin : calcule honnêtement (230 mots/min en moyenne)
- Le slug doit être en kebab-case, en français, max 60 caractères, sans accents
- L'excerpt doit faire 140-160 caractères exactement

Retourne UNIQUEMENT un objet JSON valide (sans markdown, sans \`\`\`, sans commentaires) avec cette structure exacte :
{
  "slug": "string",
  "title": "string",
  "excerpt": "string (140-160 chars)",
  "readingTimeMin": number,
  "gradient": "string (utilise exactement la valeur fournie)",
  "tags": ["string", ...],
  "content": [ContentBlock, ...]
}

Types ContentBlock disponibles (utilise une variété) :
{ "type": "h2", "text": "..." }
{ "type": "h3", "text": "..." }
{ "type": "p", "text": "..." }
{ "type": "ul", "items": ["...", ...] }
{ "type": "ol", "items": ["...", ...] }
{ "type": "callout", "text": "..." }
{ "type": "tip", "label": "...", "text": "..." }

Structure recommandée : intro (1-2 p) → callout clé → 3-5 sections H2 avec sous-sections → ul/ol factuels → tip pratique → conclusion avec mention JobSpeeder.`

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization')
  const secret = process.env.BLOG_GENERATE_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  let body: {
    topic: string
    keywords?: string[]
    category?: string
    categorySlug?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { topic, keywords = [], category = 'Recherche d\'emploi', categorySlug = 'recherche-emploi' } = body
  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const gradient = randomGradient()

  const userPrompt = `Génère un article de blog complet sur le sujet suivant :

Sujet : ${topic}
Mots-clés cibles : ${keywords.length ? keywords.join(', ') : topic}
Catégorie : ${category} (slug: ${categorySlug})
Gradient à utiliser : "${gradient}"
URL du site : ${SITE_URL}

L'article doit cibler un lecteur français en recherche active d'emploi, cadre ou non-cadre, 25-45 ans, à l'aise avec les outils numériques.`

  // ── Generate ──────────────────────────────────────────────────────────────
  let generated: {
    slug: string
    title: string
    excerpt: string
    readingTimeMin: number
    gradient: string
    tags: string[]
    content: ContentBlock[]
  }

  try {
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    generated = JSON.parse(raw)
  } catch (err) {
    console.error('[blog/generate] OpenAI or parse error:', err)
    return NextResponse.json({ error: 'Generation failed', detail: String(err) }, { status: 500 })
  }

  // ── Save to Supabase ──────────────────────────────────────────────────────
  const post = await createPost({
    slug: generated.slug,
    title: generated.title,
    excerpt: generated.excerpt,
    category,
    categorySlug,
    readingTimeMin: generated.readingTimeMin,
    gradient: generated.gradient || gradient,
    tags: generated.tags,
    content: generated.content,
    published: true,
  })

  if (!post) {
    return NextResponse.json({ error: 'Failed to save post (slug may already exist)' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    post: {
      slug: post.slug,
      title: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
  })
}
