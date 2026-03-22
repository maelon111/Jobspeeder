import type { MetadataRoute } from 'next'

const SITE_URL = 'https://jobspeeder.online'

// Routes public bots may always crawl
const PUBLIC_ALLOW = [
  '/',
  '/blog/',
  '/pricing',
  '/register',
  '/login',
  '/llms.txt',
  '/llms-full.txt',
  '/confidentialite',
  '/cgu',
  '/cookies',
]

// Routes that should never be indexed (app, API, defensive WP paths)
const PRIVATE_DISALLOW = [
  // Authenticated app routes
  '/api/',
  '/dashboard',
  '/cv',
  '/applications',
  '/job-offers',
  '/settings',
  '/onboarding',
  // Defensive blocks — not present but probed by scanners
  '/wp-admin/',
  '/wp-login.php',
  '/xmlrpc.php',
  '/wp-json/',
  '/?s=',       // search result pages (thin content)
  '/staging/',
  '/test/',
  '/dev/',
]

// Explicit rules for AI training/retrieval bots + major search engines.
// Each gets its own block so it's unambiguous to the crawler.
const AI_AND_SEARCH_BOTS = [
  // OpenAI
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  // Anthropic
  'ClaudeBot', 'anthropic-ai', 'Claude-Web',
  // Perplexity
  'PerplexityBot',
  // Google
  'Googlebot', 'Googlebot-Image', 'Google-Extended',
  // Bing / Microsoft
  'Bingbot', 'BingPreview',
  // Other AI crawlers
  'cohere-ai', 'YouBot', 'Meta-ExternalAgent', 'Bytespider',
  // SEO crawlers
  'AhrefsBot', 'SemrushBot', 'DataForSeoBot',
]

export default function robots(): MetadataRoute.Robots {
  const botRules = AI_AND_SEARCH_BOTS.map((bot) => ({
    userAgent: bot,
    allow: PUBLIC_ALLOW,
    disallow: PRIVATE_DISALLOW,
  }))

  return {
    rules: [
      // ── Default rule for all crawlers ──────────────────────────
      {
        userAgent: '*',
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },
      // ── Explicit rules for AI & search bots ────────────────────
      ...botRules,
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
