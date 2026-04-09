import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowRight, ArrowLeft, Zap, Tag } from 'lucide-react'
import { JsonLd } from '@/components/JsonLd'
import { formatDate, type ContentBlock } from '@/lib/blog-posts'
import { getPostBySlug, getRelatedPosts } from '@/lib/blog-db'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://jobspeeder.online'

/* ─── Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const postUrl = `${SITE_URL}/blog/${post.slug}`
  return {
    title: `${post.title} — Blog JobSpeeder`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: `${SITE_URL}/logo-v2.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

/* ─── Content renderer ─── */
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4 leading-tight">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 className="text-base md:text-lg font-semibold text-white/90 mt-7 mb-3">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p className="text-white/60 leading-relaxed mb-5 text-[15px]">
          {block.text}
        </p>
      )
    case 'ul':
      return (
        <ul className="space-y-2 mb-5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-white/55">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="space-y-3 mb-5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[14px] text-white/55">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand/15 border border-brand/30 text-brand text-[11px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <div className="my-7 rounded-2xl border border-brand/20 bg-brand/5 px-6 py-5">
          <p className="text-sm text-white/75 leading-relaxed italic">{block.text}</p>
        </div>
      )
    case 'tip':
      return (
        <div className="my-7 rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">{block.label}</div>
          <p className="text-sm text-white/70 leading-relaxed">{block.text}</p>
        </div>
      )
    default:
      return null
  }
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

/* ─── Page ─── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post.slug)
  const postUrl = `${SITE_URL}/blog/${post.slug}`
  const catColor = getCategoryColor(post.categorySlug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'JobSpeeder',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo-v2.png` },
    },
    image: { '@type': 'ImageObject', url: `${SITE_URL}/logo-v2.png` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags.join(', '),
    inLanguage: 'fr-FR',
    timeRequired: `PT${post.readingTimeMin}M`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <article className="pt-28 pb-24 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            Retour au blog
          </Link>

          {/* Cover gradient hero */}
          <div className={`relative h-52 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br ${post.gradient} mb-8`}>
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
              <Zap size={96} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#060c16]/80 to-transparent" />
            <div className="absolute bottom-5 left-6">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${catColor}`}>
                {post.category}
              </span>
            </div>
          </div>

          {/* Title & meta */}
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-[10px] font-bold text-brand">
                JS
              </div>
              <div>
                <div className="text-xs font-medium text-white/70">{post.author}</div>
                <div className="text-[10px] text-white/30">{post.authorRole}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Clock size={12} />
              {post.readingTimeMin} min de lecture
            </div>
            <span className="text-xs text-white/25">
              Publié le {formatDate(post.publishedAt)}
            </span>
            {post.updatedAt !== post.publishedAt && (
              <span className="text-xs text-white/20">
                · Mis à jour le {formatDate(post.updatedAt)}
              </span>
            )}
          </div>

          {/* Article body */}
          <div className="mb-12">
            {post.content.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pb-8 border-b border-white/8">
            <Tag size={13} className="text-white/25 mt-0.5" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-white/4 border border-white/8 rounded-full text-white/35">
                {tag}
              </span>
            ))}
          </div>

          {/* In-article CTA */}
          <div className="my-10 rounded-2xl p-[1px] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.05) 60%, rgba(168,85,247,0.15) 100%)' }}
          >
            <div className="rounded-2xl px-7 py-8 flex flex-col sm:flex-row items-center gap-5"
              style={{ background: 'linear-gradient(135deg, #0a1525 0%, #060c16 100%)' }}
            >
              <div className="flex-shrink-0 p-3 bg-brand/10 rounded-2xl border border-brand/20">
                <Zap size={24} className="text-brand" fill="currentColor" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="font-bold text-white mb-1 text-sm">Passez à l&apos;action maintenant</div>
                <p className="text-white/40 text-xs leading-relaxed">
                  Automatisez vos candidatures avec JobSpeeder. Setup en 3 minutes, premier résultat en 48h.
                </p>
              </div>
              <Link
                href="/register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-black font-bold rounded-xl hover:bg-brand-dark transition-all text-sm active:scale-95 whitespace-nowrap"
              >
                Essayer gratuitement
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-5">Articles similaires</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((rel) => {
                  const relCatColor = getCategoryColor(rel.categorySlug)
                  return (
                    <Link
                      key={rel.slug}
                      href={`/blog/${rel.slug}`}
                      className="group glass rounded-xl p-4 border border-white/8 hover:border-white/15 transition-all"
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mb-2 ${relCatColor}`}>
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-snug mb-2 line-clamp-2">
                        {rel.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-white/25">
                        <Clock size={10} />
                        {rel.readingTimeMin} min
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </article>
    </>
  )
}
