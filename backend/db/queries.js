/**
 * Common Database Queries for Ethiopian Navigator
 * Reusable query functions for CRUD operations
 */

import { query } from './connection.js';

// ============================================================================
// USERS QUERIES
// ============================================================================

export const Users = {
  async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findByRole(role, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [role, limit, offset]
    );
    return result.rows;
  },

  async create(userData) {
    const { email, password, role, full_name, phone } = userData;
    const result = await query(
      `INSERT INTO users (email, password, role, full_name, phone, is_active) 
       VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
      [email, password, role, full_name, phone]
    );
    return result.rows[0];
  },

  async update(id, updates) {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = [...Object.values(updates), id];
    
    const result = await query(
      `UPDATE users SET ${fields}, updated_at = now() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async delete(id) {
    await query('DELETE FROM users WHERE id = $1', [id]);
  },

  async getAllActive(limit = 100, offset = 0) {
    const result = await query(
      'SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async updateLastLogin(id) {
    await query('UPDATE users SET last_login = now() WHERE id = $1', [id]);
  },
};

// ============================================================================
// SERVICES QUERIES
// ============================================================================

export const Services = {
  async findById(id) {
    const result = await query('SELECT * FROM services WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByCategory(category, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM services WHERE category = $1 AND is_active = true ORDER BY featured DESC, rating DESC LIMIT $2 OFFSET $3',
      [category, limit, offset]
    );
    return result.rows;
  },

  async findFeatured(limit = 10) {
    const result = await query(
      'SELECT * FROM services WHERE featured = true AND is_active = true ORDER BY rating DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async search(searchTerm, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM services 
       WHERE (name ILIKE $1 OR description ILIKE $1) AND is_active = true
       ORDER BY featured DESC, rating DESC
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    );
    return result.rows;
  },

  async getAll(limit = 100, offset = 0) {
    const result = await query(
      'SELECT * FROM services WHERE is_active = true ORDER BY featured DESC, rating DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async create(serviceData) {
    const { name, description, category, requirements, processing_time, icon_url, featured } = serviceData;
    const result = await query(
      `INSERT INTO services (name, description, category, requirements, processing_time, icon_url, featured, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
      [name, description, category, requirements, processing_time, icon_url, featured || false]
    );
    return result.rows[0];
  },

  async update(id, updates) {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = [...Object.values(updates), id];
    
    const result = await query(
      `UPDATE services SET ${fields}, updated_at = now() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async updateRating(id, rating, reviewCount) {
    await query(
      'UPDATE services SET rating = $1, review_count = $2, updated_at = now() WHERE id = $3',
      [rating, reviewCount, id]
    );
  },
};

// ============================================================================
// APPLICATIONS QUERIES
// ============================================================================

export const Applications = {
  async findById(id) {
    const result = await query('SELECT * FROM applications WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUserId(userId, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  },

  async findByReferenceNumber(referenceNumber) {
    const result = await query(
      'SELECT * FROM applications WHERE reference_number = $1',
      [referenceNumber]
    );
    return result.rows[0];
  },

  async findByStatus(status, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [status, limit, offset]
    );
    return result.rows;
  },

  async create(applicationData) {
    const { user_id, service_id, status, reference_number } = applicationData;
    const result = await query(
      `INSERT INTO applications (user_id, service_id, status, reference_number, submitted_at) 
       VALUES ($1, $2, $3, $4, now()) RETURNING *`,
      [user_id, service_id, status || 'pending', reference_number]
    );
    return result.rows[0];
  },

  async update(id, updates) {
    const fields = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = [...Object.values(updates), id];
    
    const result = await query(
      `UPDATE applications SET ${fields}, updated_at = now() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  },

  async getStatistics() {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, now()) - submitted_at))/86400) as avg_days
      FROM applications
      WHERE submitted_at IS NOT NULL
      GROUP BY status
    `);
    return result.rows;
  },
};

// ============================================================================
// FEEDBACK QUERIES
// ============================================================================

export const Feedback = {
  async findById(id) {
    const result = await query('SELECT * FROM feedback WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByServiceId(serviceId, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM feedback WHERE service_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [serviceId, limit, offset]
    );
    return result.rows;
  },

  async findByUserId(userId, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM feedback WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  },

  async create(feedbackData) {
    const { user_id, application_id, service_id, rating, comment, feedback_type, is_anonymous } = feedbackData;
    const result = await query(
      `INSERT INTO feedback (user_id, application_id, service_id, rating, comment, feedback_type, is_anonymous) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, application_id, service_id, rating, comment, feedback_type, is_anonymous || false]
    );
    return result.rows[0];
  },

  async getAverageRating(serviceId) {
    const result = await query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM feedback WHERE service_id = $1',
      [serviceId]
    );
    return result.rows[0];
  },
};

// ============================================================================
// NOTIFICATIONS QUERIES
// ============================================================================

export const Notifications = {
  async findByUserId(userId, limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  },

  async findUnread(userId, limit = 50) {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },

  async create(notificationData) {
    const { user_id, title, message, notification_type, related_application_id } = notificationData;
    const result = await query(
      `INSERT INTO notifications (user_id, title, message, notification_type, related_application_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, message, notification_type, related_application_id]
    );
    return result.rows[0];
  },

  async markAsRead(id) {
    await query('UPDATE notifications SET is_read = true, read_at = now() WHERE id = $1', [id]);
  },

  async markAllAsRead(userId) {
    await query('UPDATE notifications SET is_read = true, read_at = now() WHERE user_id = $1', [userId]);
  },

  async deleteOldNotifications(daysOld = 30) {
    await query(
      'DELETE FROM notifications WHERE created_at < now() - INTERVAL $1',
      [`${daysOld} days`]
    );
  },
};

// ============================================================================
// STATISTICS QUERIES
// ============================================================================

export const Statistics = {
  async getTotalUsers() {
    const result = await query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count);
  },

  async getTotalApplications() {
    const result = await query('SELECT COUNT(*) as count FROM applications');
    return parseInt(result.rows[0].count);
  },

  async getTotalServices() {
    const result = await query('SELECT COUNT(*) as count FROM services WHERE is_active = true');
    return parseInt(result.rows[0].count);
  },

  async getApplicationsByStatus() {
    const result = await query(
      'SELECT status, COUNT(*) as count FROM applications GROUP BY status'
    );
    return result.rows;
  },

  async getUsersByRole() {
    const result = await query(
      'SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role'
    );
    return result.rows;
  },

  async getTopServices(limit = 5) {
    const result = await query(
      'SELECT id, name, rating, review_count FROM services WHERE is_active = true ORDER BY rating DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async getDashboardStats() {
    return {
      totalUsers: await this.getTotalUsers(),
      totalApplications: await this.getTotalApplications(),
      totalServices: await this.getTotalServices(),
      applicationsByStatus: await this.getApplicationsByStatus(),
      usersByRole: await this.getUsersByRole(),
      topServices: await this.getTopServices(),
    };
  },
};

export default {
  Users,
  Services,
  Applications,
  Feedback,
  Notifications,
  Statistics,
};
