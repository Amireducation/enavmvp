const { query } = require('../db/connection');

class AnalyticsService {
  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(period = '7days') {
    try {
      const dateFilter = this.getDateFilter(period);

      // Get user counts
      const userStats = await query(
        `SELECT 
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'citizen' THEN 1 ELSE 0 END) as citizens,
          SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) as employees,
          SUM(CASE WHEN role = 'partner' THEN 1 ELSE 0 END) as partners
         FROM users`
      );

      // Get request stats
      const requestStats = await query(
        `SELECT 
          COUNT(*) as total_requests,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          AVG(EXTRACT(DAY FROM (updated_at - created_at))) as avg_processing_time
         FROM service_requests
         WHERE created_at >= NOW() - INTERVAL '${this.getPeriodInterval(period)}'`
      );

      // Calculate metrics
      const completed = requestStats.rows[0]?.completed || 0;
      const total = requestStats.rows[0]?.total_requests || 1;
      const completionRate = ((completed / total) * 100).toFixed(2);

      return {
        totalUsers: userStats.rows[0]?.total_users || 0,
        citizens: userStats.rows[0]?.citizens || 0,
        employees: userStats.rows[0]?.employees || 0,
        partners: userStats.rows[0]?.partners || 0,
        totalRequests: total,
        completedRequests: completed,
        pendingRequests: requestStats.rows[0]?.pending || 0,
        inProgressRequests: requestStats.rows[0]?.in_progress || 0,
        rejectedRequests: requestStats.rows[0]?.rejected || 0,
        averageProcessingTime: parseFloat(requestStats.rows[0]?.avg_processing_time || 0).toFixed(1),
        completionRate: parseFloat(completionRate),
        period
      };
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  /**
   * Get service performance stats
   */
  async getServicePerformance(period = '30days') {
    try {
      const result = await query(
        `SELECT 
          service_id,
          COUNT(*) as total_requests,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          AVG(EXTRACT(DAY FROM (updated_at - created_at))) as avg_time,
          MAX(created_at) as last_request
         FROM service_requests
         WHERE created_at >= NOW() - INTERVAL '${this.getPeriodInterval(period)}'
         GROUP BY service_id
         ORDER BY total_requests DESC`
      );

      return result.rows.map(row => ({
        serviceId: row.service_id,
        totalRequests: row.total_requests,
        completed: row.completed,
        pending: row.pending,
        inProgress: row.in_progress,
        completionRate: ((row.completed / row.total_requests) * 100).toFixed(2),
        averageProcessingTime: parseFloat(row.avg_time || 0).toFixed(1),
        lastRequest: row.last_request
      }));
    } catch (error) {
      console.error('Error getting service performance:', error);
      throw error;
    }
  }

  /**
   * Get user growth trend
   */
  async getUserGrowthTrend(period = '30days') {
    try {
      const result = await query(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as new_users,
          SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
         FROM users
         WHERE created_at >= NOW() - INTERVAL '${this.getPeriodInterval(period)}'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting user growth trend:', error);
      throw error;
    }
  }

  /**
   * Get request volume by day
   */
  async getRequestVolumeTrend(period = '30days') {
    try {
      const result = await query(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as requests,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
         FROM service_requests
         WHERE created_at >= NOW() - INTERVAL '${this.getPeriodInterval(period)}'
         GROUP BY DATE(created_at)
         ORDER BY date ASC`
      );

      return result.rows;
    } catch (error) {
      console.error('Error getting request volume trend:', error);
      throw error;
    }
  }

  /**
   * Get feedback analysis
   */
  async getFeedbackAnalysis(period = '30days') {
    try {
      const result = await query(
        `SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_feedback,
          SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positive,
          SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as neutral,
          SUM(CASE WHEN rating < 3 THEN 1 ELSE 0 END) as negative
         FROM service_feedback
         WHERE created_at >= NOW() - INTERVAL '${this.getPeriodInterval(period)}'`
      );

      const row = result.rows[0];
      return {
        averageRating: parseFloat(row.average_rating || 0).toFixed(2),
        totalFeedback: row.total_feedback || 0,
        positive: row.positive || 0,
        neutral: row.neutral || 0,
        negative: row.negative || 0,
        sentimentScore: row.total_feedback > 0
          ? (((row.positive - row.negative) / row.total_feedback) * 100).toFixed(2)
          : 0
      };
    } catch (error) {
      console.error('Error getting feedback analysis:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive report
   */
  async generateReport(period = '30days') {
    try {
      const [metrics, servicePerf, userGrowth, requestVolume, feedback] = await Promise.all([
        this.getDashboardMetrics(period),
        this.getServicePerformance(period),
        this.getUserGrowthTrend(period),
        this.getRequestVolumeTrend(period),
        this.getFeedbackAnalysis(period)
      ]);

      return {
        generatedAt: new Date(),
        period,
        metrics,
        servicePerformance: servicePerf,
        userGrowth,
        requestVolume,
        feedback,
        summary: {
          totalActivities: metrics.totalRequests + metrics.totalUsers,
          systemHealth: this.calculateSystemHealth(metrics),
          topService: servicePerf[0]?.serviceId || 'N/A',
          avgSatisfaction: feedback.averageRating
        }
      };
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  /**
   * Export data in CSV format
   */
  async exportToCsv(reportData) {
    try {
      let csv = 'Ethiopian Navigator Analytics Report\n';
      csv += `Generated: ${new Date().toISOString()}\n`;
      csv += `Period: ${reportData.period}\n\n`;

      // Metrics section
      csv += 'SYSTEM METRICS\n';
      csv += 'Metric,Value\n';
      csv += `Total Users,${reportData.metrics.totalUsers}\n`;
      csv += `Total Requests,${reportData.metrics.totalRequests}\n`;
      csv += `Completion Rate,${reportData.metrics.completionRate}%\n`;
      csv += `Average Processing Time,${reportData.metrics.averageProcessingTime} days\n\n`;

      // Service Performance
      csv += 'SERVICE PERFORMANCE\n';
      csv += 'Service,Total Requests,Completed,Pending,Completion Rate\n';
      reportData.servicePerformance.forEach(service => {
        csv += `${service.serviceId},${service.totalRequests},${service.completed},${service.pending},${service.completionRate}%\n`;
      });
      csv += '\n';

      // Feedback
      csv += 'USER FEEDBACK\n';
      csv += 'Metric,Value\n';
      csv += `Average Rating,${reportData.feedback.averageRating}\n`;
      csv += `Total Feedback,${reportData.feedback.totalFeedback}\n`;
      csv += `Positive,${reportData.feedback.positive}\n`;
      csv += `Neutral,${reportData.feedback.neutral}\n`;
      csv += `Negative,${reportData.feedback.negative}\n`;

      return csv;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  /**
   * Helper: Get date filter based on period
   */
  getDateFilter(period) {
    const now = new Date();
    let startDate;

    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return startDate.toISOString();
  }

  /**
   * Helper: Get PostgreSQL interval string
   */
  getPeriodInterval(period) {
    switch (period) {
      case '7days':
        return "7 days";
      case '30days':
        return "30 days";
      case '90days':
        return "90 days";
      case 'yearly':
        return "1 year";
      default:
        return "30 days";
    }
  }

  /**
   * Calculate system health score
   */
  calculateSystemHealth(metrics) {
    const completionScore = metrics.completionRate;
    const volumeScore = Math.min((metrics.totalRequests / 1000) * 100, 100);
    const timeScore = Math.max(100 - (metrics.averageProcessingTime * 10), 0);

    return ((completionScore + volumeScore + timeScore) / 3).toFixed(1);
  }
}

module.exports = new AnalyticsService();
