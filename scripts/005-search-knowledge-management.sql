-- Search and Knowledge Management Enterprise Schema
-- Complete system for full-text search, knowledge base, FAQs, and documentation

-- 1. Knowledge Base Articles Table
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  category_id UUID NOT NULL REFERENCES knowledge_categories(id),
  author_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  language VARCHAR(10) DEFAULT 'en',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE
);

-- 2. Knowledge Categories Table
CREATE TABLE IF NOT EXISTS knowledge_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER,
  parent_category_id UUID REFERENCES knowledge_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES knowledge_categories(id),
  language VARCHAR(10) DEFAULT 'en',
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  display_order INTEGER,
  status VARCHAR(20) DEFAULT 'published',
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Search History Table (for analytics)
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  search_query VARCHAR(500) NOT NULL,
  results_count INTEGER,
  language VARCHAR(10),
  device_type VARCHAR(50),
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Article Feedback Table
CREATE TABLE IF NOT EXISTS article_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  feedback_type VARCHAR(20) CHECK (feedback_type IN ('helpful', 'unhelpful')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Search Keywords Table (for analytics)
CREATE TABLE IF NOT EXISTS search_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword VARCHAR(255) NOT NULL UNIQUE,
  search_count INTEGER DEFAULT 1,
  language VARCHAR(10),
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  trend_score DECIMAL(5,2) DEFAULT 0
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_status ON knowledge_articles(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_language ON knowledge_articles(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_search_vector ON knowledge_articles USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_slug ON knowledge_articles(slug);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_language ON faqs(language);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_article_feedback_article ON article_feedback(article_id);
CREATE INDEX IF NOT EXISTS idx_search_keywords_keyword ON search_keywords(keyword);

-- Triggers for Updated Timestamps
CREATE OR REPLACE FUNCTION update_knowledge_articles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_articles_timestamp
BEFORE UPDATE ON knowledge_articles
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_articles_timestamp();

-- Trigger for Full-Text Search Vector
CREATE OR REPLACE FUNCTION update_knowledge_articles_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.content, '') || ' ' || COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER knowledge_articles_search_vector
BEFORE INSERT OR UPDATE ON knowledge_articles
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_articles_search_vector();

-- Seed Initial Categories
INSERT INTO knowledge_categories (name, slug, description, icon, display_order) VALUES
('Getting Started', 'getting-started', 'Quick start guides and tutorials', 'rocket', 1),
('Service FAQs', 'service-faqs', 'Frequently asked questions about services', 'help-circle', 2),
('How-to Guides', 'how-to', 'Step-by-step guides for common tasks', 'book-open', 3),
('Troubleshooting', 'troubleshooting', 'Solutions for common problems', 'alert-circle', 4),
('Account & Security', 'account-security', 'Account management and security information', 'lock', 5),
('Payments & Billing', 'payments-billing', 'Payment and billing related questions', 'credit-card', 6),
('Legal & Privacy', 'legal-privacy', 'Legal notices and privacy information', 'file-text', 7),
('Contact & Support', 'contact-support', 'How to reach support', 'phone', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed Sample FAQs
INSERT INTO faqs (question, answer, category_id, language, created_by, updated_by) 
SELECT 
  'How do I create an account?',
  'To create an account, click the "Register" button on the home page. Fill in your email, password, and personal information. Verify your email to activate your account.',
  (SELECT id FROM knowledge_categories WHERE slug = 'getting-started'),
  'en',
  (SELECT id FROM users WHERE email = 'admin@demo.com' LIMIT 1),
  (SELECT id FROM users WHERE email = 'admin@demo.com' LIMIT 1)
WHERE EXISTS (SELECT id FROM users WHERE email = 'admin@demo.com')
ON CONFLICT DO NOTHING;
