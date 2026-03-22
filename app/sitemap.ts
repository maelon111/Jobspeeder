import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blog-posts'

const SITE_URL = 'https://jobspeeder.online'

// Pinned dates for stable, deterministic lastmod on static content.
// Update when page content actually changes — not on every deploy.
const DATES = {
  homepage:  '2026-03-22',
  pricing:   '2026-03-22',
  blog:      '2026-03-22',
  register:  '2026-01-15',
  login:     '2026-01-15',
  legal:     '2025-12-01',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    // ── Core landing / conversion pages (highest priority) ──────
    {
      url: SITE_URL,
      lastModified: DATES.homepage,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: DATES.pricing,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: DATES.register,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ── Blog (high SEO value) ────────────────────────────────────
    {
      url: `${SITE_URL}/blog`,
      lastModified: DATES.blog,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // ── Auth pages (indexed but lower value) ────────────────────
    {
      url: `${SITE_URL}/login`,
      lastModified: DATES.login,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    // ── Legal (crawlable, low value) ────────────────────────────
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: DATES.legal,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cgu`,
      lastModified: DATES.legal,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: DATES.legal,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // ── Blog posts (individual articles) ──────────────────────────
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...blogPages]
}
