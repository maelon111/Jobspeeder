-- =====================
-- BLOG POSTS
-- =====================
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  excerpt       TEXT        NOT NULL,
  category      TEXT        NOT NULL,
  category_slug TEXT        NOT NULL,
  author        TEXT        NOT NULL DEFAULT 'Équipe JobSpeeder',
  author_role   TEXT        NOT NULL DEFAULT 'Experts en recrutement IA',
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reading_time_min INTEGER  NOT NULL DEFAULT 5,
  gradient      TEXT        NOT NULL DEFAULT 'from-brand/20 via-blue-500/10 to-purple-500/10',
  tags          TEXT[]      NOT NULL DEFAULT '{}',
  content       JSONB       NOT NULL DEFAULT '[]',
  published     BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Public read access (blog is public)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts" ON blog_posts
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Service role can manage blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug         ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_slug ON blog_posts(category_slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at  ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published     ON blog_posts(published);
