const express = require('express');
const router = express.Router();
const { query } = require('../db/connection');
const { authenticate, authorize } = require('../middleware/jwt-auth');

// GET all service requests for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, serviceId, page = 1, limit = 10 } = req.query;
    
    let q = 'SELECT * FROM service_requests WHERE user_id = $1';
    let params = [userId];
    let paramIndex = 2;

    if (status) {
      q += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (serviceId) {
      q += ` AND service_id = $${paramIndex}`;
      params.push(serviceId);
      paramIndex++;
    }

    q += ' ORDER BY created_at DESC LIMIT $' + paramIndex + ' OFFSET $' + (paramIndex + 1);
    params.push(limit, (page - 1) * limit);

    const result = await query(q, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ error: 'Failed to fetch service requests' });
  }
});

// GET single service request by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM service_requests WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ error: 'Failed to fetch service request' });
  }
});

// POST create new service request
router.post('/', authenticate, async (req, res) => {
  try {
    const { serviceId, description, requiredDocuments, preferredLanguage } = req.body;
    const userId = req.user.id;

    if (!serviceId || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO service_requests (user_id, service_id, description, required_documents, preferred_language, status, priority, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', 'normal', NOW(), NOW())
       RETURNING *`,
      [userId, serviceId, description, JSON.stringify(requiredDocuments || []), preferredLanguage || 'english']
    );

    // Create workflow log entry
    await query(
      `INSERT INTO service_request_workflow_logs (request_id, action, actor_type, actor_id, status_before, status_after, notes)
       VALUES ($1, 'created', 'citizen', $2, NULL, 'pending', 'Service request created')`,
      [result.rows[0].id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ error: 'Failed to create service request' });
  }
});

// PUT update service request status (admin/employee only)
router.put('/:id/status', authenticate, authorize(['admin', 'employee']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['pending', 'in_progress', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get current status
    const current = await query('SELECT status FROM service_requests WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    const oldStatus = current.rows[0].status;

    // Update request
    const result = await query(
      'UPDATE service_requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Log workflow change
    await query(
      `INSERT INTO service_request_workflow_logs (request_id, action, actor_type, actor_id, status_before, status_after, notes)
       VALUES ($1, 'status_updated', 'employee', $2, $3, $4, $5)`,
      [id, req.user.id, oldStatus, status, notes || '']
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({ error: 'Failed to update service request' });
  }
});

// POST convert service request to application
router.post('/:id/convert', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationData } = req.body;

    // Verify request exists
    const req_check = await query('SELECT * FROM service_requests WHERE id = $1', [id]);
    if (req_check.rows.length === 0) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    const serviceRequest = req_check.rows[0];

    // Create application
    const application = await query(
      `INSERT INTO applications (user_id, service_id, request_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, 'approved', NOW(), NOW())
       RETURNING *`,
      [serviceRequest.user_id, serviceRequest.service_id, id]
    );

    // Update request status
    await query('UPDATE service_requests SET status = $1 WHERE id = $2', ['completed', id]);

    res.status(201).json({
      message: 'Service request converted to application',
      application: application.rows[0]
    });
  } catch (error) {
    console.error('Error converting service request:', error);
    res.status(500).json({ error: 'Failed to convert service request' });
  }
});

module.exports = router;
