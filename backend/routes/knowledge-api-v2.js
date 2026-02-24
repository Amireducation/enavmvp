// Search and Knowledge Management API Routes
// Full-text search, knowledge base, FAQs, and documentation endpoints

const express = require('express');
const router = express.Router();
const knowledgeService = require('../services/knowledge-service');
const { authenticate, authorize } = require('../middleware/jwt-auth');

// ==================== PUBLIC ENDPOINTS ====================

// Full-text search
router.get('/search', async (req, res) => {
  try {
    const { q, language = 'en', limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }
    
    const results = await knowledgeService.fullTextSearch(q, language, parseInt(limit));
    res.json({ success: true, results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Get search suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { partial, language = 'en' } = req.query;
    
    if (!partial || partial.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const suggestions = await knowledgeService.getSearchSuggestions(partial, language);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get trending searches
router.get('/search/trending', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const trending = await knowledgeService.getTrendingSearches(language);
    res.json({ success: true, trending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get trending searches' });
  }
});

// Get article by slug
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = 'en' } = req.query;
    
    const article = await knowledgeService.getArticleBySlug(slug, language);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Get related articles
    const related = await knowledgeService.getRelatedArticles(article.id, 5);
    
    res.json({ success: true, article, related });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get featured articles
router.get('/articles/featured/:language?', async (req, res) => {
  try {
    const { language = 'en' } = req.params;
    const featured = await knowledgeService.getFeaturedArticles(6, language);
    res.json({ success: true, featured });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured articles' });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await knowledgeService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get articles by category
router.get('/categories/:categoryId/articles', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { language = 'en', limit = 20, offset = 0 } = req.query;
    
    const articles = await knowledgeService.getArticlesByCategory(
      categoryId,
      language,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({ success: true, articles, count: articles.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const { language = 'en', limit = 50, offset = 0 } = req.query;
    
    const faqs = await knowledgeService.getAllFAQs(language, parseInt(limit), parseInt(offset));
    res.json({ success: true, faqs, count: faqs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get FAQs by category
router.get('/categories/:categoryId/faqs', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { language = 'en' } = req.query;
    
    const faqs = await knowledgeService.getFAQsByCategory(categoryId, language);
    res.json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Mark FAQ as helpful/unhelpful
router.post('/faqs/:faqId/helpful', async (req, res) => {
  try {
    const { faqId } = req.params;
    const { isHelpful } = req.body;
    
    const result = await knowledgeService.markFAQHelpful(faqId, isHelpful);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ rating' });
  }
});

// Submit article feedback
router.post('/articles/:articleId/feedback', authenticate, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { feedbackType, comment } = req.body;
    
    if (!['helpful', 'unhelpful'].includes(feedbackType)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }
    
    await knowledgeService.submitArticleFeedback(articleId, { feedbackType, comment }, req.user.id);
    res.json({ success: true, message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get most viewed articles
router.get('/articles/popular/top', async (req, res) => {
  try {
    const { language = 'en', limit = 10 } = req.query;
    
    const articles = await knowledgeService.getMostViewedArticles(parseInt(limit), language);
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular articles' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Create article (admin only)
router.post('/articles', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const article = await knowledgeService.createArticle(req.body, req.user.id);
    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create article', message: error.message });
  }
});

// Publish article (admin only)
router.post('/articles/:articleId/publish', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await knowledgeService.publishArticle(articleId);
    res.json({ success: true, article });
  } catch (error) {
    res.status(400).json({ error: 'Failed to publish article' });
  }
});

// Create FAQ (admin only)
router.post('/faqs', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const faq = await knowledgeService.createFAQ(req.body, req.user.id);
    res.status(201).json({ success: true, faq });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create FAQ' });
  }
});

// Get search analytics (admin only)
router.get('/analytics/search', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const analytics = await knowledgeService.getSearchAnalytics(parseInt(days));
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get article statistics (admin only)
router.get('/analytics/articles', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await knowledgeService.getArticleStats(parseInt(days));
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article statistics' });
  }
});

// Get category stats (admin only)
router.get('/categories/:categoryId/stats', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { categoryId } = req.params;
    const stats = await knowledgeService.getCategoryStats(categoryId);
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

module.exports = router;
