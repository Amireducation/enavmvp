// Enterprise Knowledge Management Service
// Handles knowledge base, FAQs, search, and content management

const db = require('../db/connection');

class KnowledgeService {
  // ==================== ARTICLE MANAGEMENT ====================
  
  async createArticle(articleData, userId) {
    const { title, slug, content, summary, categoryId, language = 'en', tags = [] } = articleData;
    
    const query = `
      INSERT INTO knowledge_articles (title, slug, content, summary, category_id, author_id, language, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const result = await db.query(query, [title, slug, content, summary, categoryId, userId, language, tags]);
    return result.rows[0];
  }

  async publishArticle(articleId) {
    const query = `
      UPDATE knowledge_articles
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    
    const result = await db.query(query, [articleId]);
    return result.rows[0];
  }

  async getArticleBySlug(slug, language = 'en') {
    const query = `
      SELECT a.*, c.name as category_name, u.email as author_email
      FROM knowledge_articles a
      JOIN knowledge_categories c ON a.category_id = c.id
      JOIN users u ON a.author_id = u.id
      WHERE a.slug = $1 AND a.language = $2 AND a.status = 'published'
      LIMIT 1;
    `;
    
    const result = await db.query(query, [slug, language]);
    
    if (result.rows.length > 0) {
      await this.incrementViewCount(result.rows[0].id);
    }
    
    return result.rows[0];
  }

  async getFeaturedArticles(limit = 6, language = 'en') {
    const query = `
      SELECT id, title, slug, summary, category_id, view_count, helpful_count, language
      FROM knowledge_articles
      WHERE featured = TRUE AND status = 'published' AND language = $1
      ORDER BY view_count DESC, created_at DESC
      LIMIT $2;
    `;
    
    const result = await db.query(query, [language, limit]);
    return result.rows;
  }

  async getArticlesByCategory(categoryId, language = 'en', limit = 20, offset = 0) {
    const query = `
      SELECT id, title, slug, summary, view_count, helpful_count, created_at
      FROM knowledge_articles
      WHERE category_id = $1 AND status = 'published' AND language = $2
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4;
    `;
    
    const result = await db.query(query, [categoryId, language, limit, offset]);
    return result.rows;
  }

  async incrementViewCount(articleId) {
    const query = `
      UPDATE knowledge_articles
      SET view_count = view_count + 1
      WHERE id = $1;
    `;
    
    await db.query(query, [articleId]);
  }

  // ==================== SEARCH FUNCTIONALITY ====================
  
  async fullTextSearch(searchQuery, language = 'en', limit = 20) {
    const query = `
      SELECT 
        id, title, slug, summary, category_id, view_count, helpful_count,
        ts_rank(search_vector, query) as relevance
      FROM knowledge_articles, plainto_tsquery('english', $1) query
      WHERE search_vector @@ query 
        AND status = 'published' 
        AND language = $2
      ORDER BY relevance DESC, view_count DESC
      LIMIT $3;
    `;
    
    // Log search for analytics
    await this.logSearch(searchQuery, language, limit);
    
    const result = await db.query(query, [searchQuery, language, limit]);
    return result.rows;
  }

  async logSearch(searchQuery, language, resultsCount) {
    const query = `
      INSERT INTO search_history (search_query, results_count, language)
      VALUES ($1, $2, $3);
    `;
    
    await db.query(query, [searchQuery, resultsCount, language]);
    
    // Update trending keywords
    await this.updateTrendingKeywords(searchQuery, language);
  }

  async updateTrendingKeywords(keyword, language) {
    const query = `
      INSERT INTO search_keywords (keyword, search_count, language)
      VALUES ($1, 1, $2)
      ON CONFLICT (keyword) 
      DO UPDATE SET search_count = search_count + 1, last_searched = CURRENT_TIMESTAMP;
    `;
    
    await db.query(query, [keyword, language]);
  }

  async getSearchSuggestions(partial, language = 'en', limit = 10) {
    const query = `
      SELECT DISTINCT keyword
      FROM search_keywords
      WHERE keyword ILIKE $1 AND language = $2
      ORDER BY search_count DESC
      LIMIT $3;
    `;
    
    const result = await db.query(query, [`${partial}%`, language, limit]);
    return result.rows.map(r => r.keyword);
  }

  async getTrendingSearches(language = 'en', limit = 10) {
    const query = `
      SELECT keyword, search_count, trend_score
      FROM search_keywords
      WHERE language = $1 AND last_searched > NOW() - INTERVAL '30 days'
      ORDER BY search_count DESC, trend_score DESC
      LIMIT $2;
    `;
    
    const result = await db.query(query, [language, limit]);
    return result.rows;
  }

  // ==================== FAQ MANAGEMENT ====================
  
  async createFAQ(faqData, userId) {
    const { question, answer, categoryId, language = 'en' } = faqData;
    
    const query = `
      INSERT INTO faqs (question, answer, category_id, language, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    
    const result = await db.query(query, [question, answer, categoryId, language, userId, userId]);
    return result.rows[0];
  }

  async getFAQsByCategory(categoryId, language = 'en') {
    const query = `
      SELECT id, question, answer, helpful_count, unhelpful_count
      FROM faqs
      WHERE category_id = $1 AND language = $2 AND status = 'published'
      ORDER BY display_order, helpful_count DESC;
    `;
    
    const result = await db.query(query, [categoryId, language]);
    return result.rows;
  }

  async getAllFAQs(language = 'en', limit = 50, offset = 0) {
    const query = `
      SELECT f.id, f.question, f.answer, f.category_id, c.name as category_name, f.helpful_count
      FROM faqs f
      JOIN knowledge_categories c ON f.category_id = c.id
      WHERE f.language = $1 AND f.status = 'published'
      ORDER BY f.helpful_count DESC, f.display_order
      LIMIT $2 OFFSET $3;
    `;
    
    const result = await db.query(query, [language, limit, offset]);
    return result.rows;
  }

  async markFAQHelpful(faqId, isHelpful) {
    const column = isHelpful ? 'helpful_count' : 'unhelpful_count';
    
    const query = `
      UPDATE faqs
      SET ${column} = ${column} + 1
      WHERE id = $1
      RETURNING helpful_count, unhelpful_count;
    `;
    
    const result = await db.query(query, [faqId]);
    return result.rows[0];
  }

  // ==================== FEEDBACK & RATINGS ====================
  
  async submitArticleFeedback(articleId, feedbackData, userId = null) {
    const { feedbackType, comment } = feedbackData;
    
    const query = `
      INSERT INTO article_feedback (article_id, user_id, feedback_type, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    await db.query(query, [articleId, userId, feedbackType, comment]);
    
    // Update article helpful count
    const updateQuery = `
      UPDATE knowledge_articles
      SET ${feedbackType}_count = ${feedbackType}_count + 1
      WHERE id = $1;
    `;
    
    await db.query(updateQuery, [articleId]);
  }

  // ==================== CATEGORY MANAGEMENT ====================
  
  async getCategories(language = 'en') {
    const query = `
      SELECT id, name, slug, description, icon, display_order
      FROM knowledge_categories
      WHERE parent_category_id IS NULL
      ORDER BY display_order;
    `;
    
    const result = await db.query(query);
    
    // Fetch subcategories for each category
    for (let category of result.rows) {
      const subQuery = `
        SELECT id, name, slug, description
        FROM knowledge_categories
        WHERE parent_category_id = $1
        ORDER BY display_order;
      `;
      
      const subResult = await db.query(subQuery, [category.id]);
      category.subcategories = subResult.rows;
    }
    
    return result.rows;
  }

  async getCategoryStats(categoryId) {
    const query = `
      SELECT 
        COUNT(*) as article_count,
        SUM(view_count) as total_views,
        AVG(helpful_count) as avg_helpful
      FROM knowledge_articles
      WHERE category_id = $1 AND status = 'published';
    `;
    
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
  }

  // ==================== ANALYTICS ====================
  
  async getSearchAnalytics(days = 30) {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as search_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM search_history
      WHERE created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC;
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  async getArticleStats(days = 30) {
    const query = `
      SELECT 
        id, title, view_count, helpful_count, unhelpful_count,
        ROUND(100.0 * helpful_count / NULLIF(helpful_count + unhelpful_count, 0), 2) as helpful_rate
      FROM knowledge_articles
      WHERE status = 'published' AND created_at > NOW() - INTERVAL '${days} days'
      ORDER BY view_count DESC
      LIMIT 20;
    `;
    
    const result = await db.query(query);
    return result.rows;
  }

  async getMostViewedArticles(limit = 10, language = 'en') {
    const query = `
      SELECT id, title, slug, view_count, helpful_count, category_id
      FROM knowledge_articles
      WHERE status = 'published' AND language = $1
      ORDER BY view_count DESC
      LIMIT $2;
    `;
    
    const result = await db.query(query, [language, limit]);
    return result.rows;
  }

  async getRelatedArticles(articleId, limit = 5) {
    const query = `
      SELECT a2.id, a2.title, a2.slug, a2.summary
      FROM knowledge_articles a1
      JOIN knowledge_articles a2 ON (
        a1.category_id = a2.category_id 
        OR a1.tags && a2.tags
      )
      WHERE a1.id = $1 AND a2.id != $1 AND a2.status = 'published'
      ORDER BY 
        CASE WHEN a1.tags && a2.tags THEN 0 ELSE 1 END,
        a2.view_count DESC
      LIMIT $2;
    `;
    
    const result = await db.query(query, [articleId, limit]);
    return result.rows;
  }
}

module.exports = new KnowledgeService();
