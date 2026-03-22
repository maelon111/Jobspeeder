import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight, Zap } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { BLOG_POSTS, CATEGORIES, formatDate } from '@/lib/blog-posts'

const SITE_URL = 'https://jobspeeder.online'

export const metadata: Metadata = {
  title: 'Blog JobSpeeder — Conseils emploi, automatisation et IA',
  description:
    'Guides pratiques pour accélérer votre recherche d\'emploi : automatisation des candidatures, lettres de motivation avec l\'IA, optimisation LinkedIn, préparation aux entretiens.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog JobSpeeder — Conseils emploi, automatisation et IA',
    description:
      'Guides pratiques pour accélérer votre recherche d\'emploi avec l\'IA et l\'automatisation.',
    url: `${SITE_URL}/blog`,
    type: 'website',
    images: [{ url: `${SITE_URL}/logo-v2.png` }],
  },
}

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog JobSpeeder',
  url: `${SITE_URL}/blog`,
  description:
    'Guides pratiques pour accélérer votre recherche d\'emploi avec l\'IA et l\'automatisation.',
  publisher: {
    '@type': 'Organization',
    name: 'JobSpeeder',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-v2.png` },
  },
  blogPost: BLOG_POSTS.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author },
    keywords: post.tags.join(', '),
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
  ],
}

const CATEGORY_COLORS: Record<string, string> = {
  automatisation: 'text-brand bg-brand/10 border-brand/20',
  'lettre-de-motivation': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'recherche-emploi': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  linkedin: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  entretien: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
}

function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] ?? 'text-white/50 bg-white/5 border-white/10'
}

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-xs text-brand font-medium mb-5">
              <Zap size={11} />
              Ressources & guides
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Trouvez votre emploi{' '}
              <span className="text-gradient-brand">plus vite</span>
            </h1>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              Conseils pratiques, guides IA et stratégies pour automatiser votre recherche
              d&apos;emploi et décrocher plus d&apos;entretiens.
            </p>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map((cat) => (
              <span
                key={cat.slug}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default ${
                  cat.slug === 'tous'
                    ? 'bg-brand text-black border-brand font-semibold'
                    : 'text-white/40 bg-white/4 border-white/8 hover:text-white/70'
                }`}
              >
                {cat.label}
              </span>
            ))}
          </div>

          {/* Posts grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BLOG_POSTS.map((post) => {
              const catColor = getCategoryColor(post.categorySlug)
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col glass rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
                >
                  {/* Cover gradient */}
                  <div className={`h-40 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Zap size={64} className="text-white" />
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${catColor}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5">
                    <h2 className="text-sm font-bold text-white/90 leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/6">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                        <Clock size={11} />
                        {post.readingTimeMin} min de lecture
                      </div>
                      <span className="text-[11px] text-white/25">{formatDate(post.publishedAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-3 text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire l&apos;article
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* CTA box */}
          <div className="mt-16 rounded-2xl p-[1px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.05) 50%, rgba(168,85,247,0.15) 100%)' }}
          >
            <div className="rounded-2xl px-8 py-10 text-center" style={{ background: 'linear-gradient(135deg, #0a1525 0%, #060c16 100%)' }}>
              <div className="inline-flex p-3 bg-brand/10 rounded-2xl border border-brand/20 mb-4">
                <Zap size={22} className="text-brand" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black mb-2">Prêt à automatiser votre recherche ?</h2>
              <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
                Rejoignez 2 400+ candidats qui utilisent JobSpeeder pour postuler à 100 offres pendant leur sommeil.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand text-black font-bold rounded-xl hover:bg-brand-dark transition-all text-sm active:scale-95"
              >
                Démarrer gratuitement
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
