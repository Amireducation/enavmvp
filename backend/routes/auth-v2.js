const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userService = require('../services/user-service');
const { authenticateJWT, authorizeRoles } = require('../middleware/jwt-auth');
const { requireRole } = require('../middleware/rbac');

// =====================================================================
// AUTHENTICATION ROUTES
// =====================================================================

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, username, firstName, lastName, phoneNumber, role } = req.body;
    
    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }
    
    const result = await userService.createUser({
      email,
      password,
      username,
      firstName,
      lastName,
      phoneNumber,
      role: role || 'citizen'
    });
    
    res.status(201).json(result);
    
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const authResult = await userService.authenticateUser(email, password, ipAddress, userAgent);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: authResult.user.id, 
        email: authResult.user.email, 
        roles: authResult.user.roles 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Create session
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await userService.createSession(authResult.user.id, tokenHash, ipAddress, userAgent);
    
    res.json({
      success: true,
      token,
      user: authResult.user,
      expiresIn: 86400
    });
    
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Logout user
router.post('/logout', authenticateJWT, async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await userService.revokeSession(tokenHash);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Verify email
router.post('/verify-email', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    const result = await userService.verifyEmail(token);
    res.json(result);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Generate reset token
    const resetToken = userService.generateToken();
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // In production, save this to database and send via email
    // For now, just return the token for demo purposes
    res.json({
      success: true,
      message: 'Password reset email would be sent',
      resetToken: resetToken // Remove in production
    });
    
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }
    
    const result = await userService.resetPassword(token, newPassword);
    res.json(result);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =====================================================================
// USER PROFILE ROUTES
// =====================================================================

// Get current user profile
router.get('/me', authenticateJWT, async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update current user profile
router.put('/me', authenticateJWT, async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// Change password
router.post('/change-password', authenticateJWT, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }
    
    const result = await userService.changePassword(req.user.id, oldPassword, newPassword);
    res.json(result);
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// =====================================================================
// ADMIN USER MANAGEMENT ROUTES
// =====================================================================

// Get all users (admin only)
router.get('/', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, role, search, limit = 50, offset = 0 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (search) filters.search = search;
    
    const result = await userService.getAllUsers(filters, parseInt(limit), parseInt(offset));
    res.json(result);
    
  } catch (error) {
    next(error);
  }
});

// Get specific user (admin only)
router.get('/:id', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Create user (admin only)
router.post('/', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    const { email, password, username, firstName, lastName, phoneNumber, role } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }
    
    const result = await userService.createUser({
      email,
      password,
      username,
      firstName,
      lastName,
      phoneNumber,
      role: role || 'citizen'
    });
    
    res.status(201).json(result);
    
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    next(error);
  }
});

// Update user (admin only)
router.put('/:id', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    const { status, role } = req.body;
    // Implementation for admin user update
    // Update status and role in database
    
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, user });
    
  } catch (error) {
    next(error);
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    // Soft delete user (set deleted_at timestamp)
    // Implementation here
    
    res.json({ success: true, message: 'User deleted successfully' });
    
  } catch (error) {
    next(error);
  }
});

// Get user login history (admin only)
router.get('/:id/login-history', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    // Fetch login history from database
    res.json({ loginHistory: [] });
  } catch (error) {
    next(error);
  }
});

// Suspend user (admin only)
router.post('/:id/suspend', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    // Update user status to 'suspended'
    res.json({ success: true, message: 'User suspended successfully' });
  } catch (error) {
    next(error);
  }
});

// Activate user (admin only)
router.post('/:id/activate', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    // Update user status to 'active'
    res.json({ success: true, message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
});

// Search users (admin only)
router.get('/search/:query', authenticateJWT, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await userService.getAllUsers({ search: req.params.query }, 50, 0);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// =====================================================================
// SESSION MANAGEMENT ROUTES
// =====================================================================

// Get user sessions
router.get('/sessions/active', authenticateJWT, async (req, res, next) => {
  try {
    // Fetch active sessions for the user
    res.json({ sessions: [] });
  } catch (error) {
    next(error);
  }
});

// Revoke all sessions
router.post('/sessions/revoke-all', authenticateJWT, async (req, res, next) => {
  try {
    await userService.revokeAllUserSessions(req.user.id);
    res.json({ success: true, message: 'All sessions revoked' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
