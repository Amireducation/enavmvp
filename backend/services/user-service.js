const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getPool } = require('../db/connection');

class UserService {
  // ============================================================
  // USER CREATION & REGISTRATION
  // ============================================================
  
  async createUser(userData) {
    const pool = await getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { email, password, username, firstName, lastName, phoneNumber, role = 'citizen' } = userData;
      
      // Validate input
      this.validateEmail(email);
      this.validatePassword(password);
      this.validateUsername(username);
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);
      
      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, username, first_name, last_name, phone_number, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, username, first_name, last_name, created_at`,
        [email, passwordHash, username, firstName, lastName, phoneNumber, 'pending']
      );
      
      const user = userResult.rows[0];
      
      // Assign role
      const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', [role]);
      if (roleResult.rows.length > 0) {
        await client.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [user.id, roleResult.rows[0].id]
        );
      }
      
      // Create user profile
      await client.query(
        `INSERT INTO user_profiles (user_id, language_preference, time_zone)
         VALUES ($1, 'en', 'Africa/Addis_Ababa')`,[user.id]
      );
      
      // Create verification token
      const verificationToken = this.generateToken();
      const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
      const verificationCode = this.generateVerificationCode();
      
      await client.query(
        `INSERT INTO user_verification (user_id, email, verification_token_hash, verification_code, expires_at)
         VALUES ($1, $2, $3, $4, NOW() + INTERVAL '24 hours')`,
        [user.id, email, tokenHash, verificationCode]
      );
      
      await client.query('COMMIT');
      
      return {
        success: true,
        user: user,
        verificationToken: verificationToken,
        verificationCode: verificationCode,
        message: 'User created successfully. Please verify your email.'
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============================================================
  // AUTHENTICATION
  // ============================================================
  
  async authenticateUser(email, password, ipAddress, userAgent) {
    const pool = await getPool();
    
    try {
      // Find user
      const userResult = await pool.query(
        `SELECT u.id, u.email, u.password_hash, u.status, u.is_email_verified,
                array_agg(r.name) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         WHERE u.email = $1 AND u.deleted_at IS NULL
         GROUP BY u.id, u.email, u.password_hash, u.status, u.is_email_verified`,
        [email]
      );
      
      if (userResult.rows.length === 0) {
        await this.logLoginAttempt(null, email, 'failed', 'User not found', ipAddress, userAgent);
        throw new Error('Invalid email or password');
      }
      
      const user = userResult.rows[0];
      
      // Check account status
      if (user.status === 'suspended') {
        await this.logLoginAttempt(user.id, email, 'locked', 'Account suspended', ipAddress, userAgent);
        throw new Error('Account is suspended');
      }
      
      if (user.status === 'deactivated' || user.status === 'archived') {
        await this.logLoginAttempt(user.id, email, 'failed', 'Account inactive', ipAddress, userAgent);
        throw new Error('Account is not active');
      }
      
      // Check if account is locked
      const accountLockResult = await pool.query(
        'SELECT account_locked_until FROM users WHERE id = $1',
        [user.id]
      );
      
      if (accountLockResult.rows[0].account_locked_until && 
          accountLockResult.rows[0].account_locked_until > new Date()) {
        await this.logLoginAttempt(user.id, email, 'locked', 'Account locked', ipAddress, userAgent);
        throw new Error('Account is temporarily locked. Try again later.');
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!passwordMatch) {
        // Increment failed login attempts
        const failedAttempts = await pool.query(
          `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 
           WHERE id = $1 RETURNING failed_login_attempts`,
          [user.id]
        );
        
        // Lock account after 5 failed attempts
        if (failedAttempts.rows[0].failed_login_attempts >= 5) {
          await pool.query(
            `UPDATE users SET account_locked_until = NOW() + INTERVAL '30 minutes'
             WHERE id = $1`,
            [user.id]
          );
          await this.logLoginAttempt(user.id, email, 'locked', 'Too many failed attempts', ipAddress, userAgent);
          throw new Error('Account locked due to too many failed attempts');
        }
        
        await this.logLoginAttempt(user.id, email, 'failed', 'Invalid password', ipAddress, userAgent);
        throw new Error('Invalid email or password');
      }
      
      // Check if email is verified
      if (!user.is_email_verified) {
        await this.logLoginAttempt(user.id, email, 'failed', 'Email not verified', ipAddress, userAgent);
        throw new Error('Please verify your email before logging in');
      }
      
      // Reset failed login attempts and update last login
      await pool.query(
        `UPDATE users 
         SET failed_login_attempts = 0, last_login_at = NOW(), account_locked_until = NULL
         WHERE id = $1`,
        [user.id]
      );
      
      // Log successful login
      await this.logLoginAttempt(user.id, email, 'success', null, ipAddress, userAgent, 'password', false);
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles
        }
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // ============================================================
  // USER MANAGEMENT
  // ============================================================
  
  async getUserById(userId) {
    const pool = await getPool();
    
    const result = await pool.query(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name, u.phone_number,
              u.status, u.is_email_verified, u.last_login_at, u.created_at,
              up.profile_picture_url, up.bio, up.language_preference, up.city, up.region,
              array_agg(r.name) as roles
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1 AND u.deleted_at IS NULL
       GROUP BY u.id, u.email, u.username, u.first_name, u.last_name, u.phone_number,
                u.status, u.is_email_verified, u.last_login_at, u.created_at,
                up.profile_picture_url, up.bio, up.language_preference, up.city, up.region`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  }
  
  async getAllUsers(filters = {}, limit = 50, offset = 0) {
    const pool = await getPool();
    
    let whereClause = 'WHERE u.deleted_at IS NULL';
    const params = [];
    let paramIndex = 1;
    
    if (filters.status) {
      whereClause += ` AND u.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    
    if (filters.role) {
      whereClause += ` AND r.name = $${paramIndex}`;
      params.push(filters.role);
      paramIndex++;
    }
    
    if (filters.search) {
      whereClause += ` AND (u.email ILIKE $${paramIndex} OR u.username ILIKE $${paramIndex} OR u.first_name ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }
    
    params.push(limit);
    params.push(offset);
    
    const result = await pool.query(
      `SELECT u.id, u.email, u.username, u.first_name, u.last_name, u.status,
              u.is_email_verified, u.last_login_at, u.created_at,
              array_agg(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       ${whereClause}
       GROUP BY u.id, u.email, u.username, u.first_name, u.last_name, u.status,
                u.is_email_verified, u.last_login_at, u.created_at
       ORDER BY u.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );
    
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       ${whereClause}`,
      params.slice(0, -2)
    );
    
    return {
      users: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset
    };
  }
  
  async updateUserProfile(userId, profileData) {
    const pool = await getPool();
    
    const {
      firstName, lastName, phoneNumber, bio, language, city, region,
      profilePictureUrl, dateOfBirth, gender, occupation
    } = profileData;
    
    // Update user basic info
    if (firstName || lastName || phoneNumber) {
      await pool.query(
        `UPDATE users SET
         first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         phone_number = COALESCE($3, phone_number),
         updated_at = NOW()
         WHERE id = $4`,
        [firstName, lastName, phoneNumber, userId]
      );
    }
    
    // Update user profile info
    await pool.query(
      `UPDATE user_profiles SET
       bio = COALESCE($1, bio),
       language_preference = COALESCE($2, language_preference),
       city = COALESCE($3, city),
       region = COALESCE($4, region),
       profile_picture_url = COALESCE($5, profile_picture_url),
       date_of_birth = COALESCE($6, date_of_birth),
       gender = COALESCE($7, gender),
       occupation = COALESCE($8, occupation),
       updated_at = NOW()
       WHERE user_id = $9`,
      [bio, language, city, region, profilePictureUrl, dateOfBirth, gender, occupation, userId]
    );
    
    return this.getUserById(userId);
  }
  
  async changePassword(userId, oldPassword, newPassword) {
    const pool = await getPool();
    
    // Validate new password
    this.validatePassword(newPassword);
    
    // Get current password hash
    const userResult = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
    if (!passwordMatch) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    
    // Update password
    await pool.query(
      `UPDATE users SET password_hash = $1, last_password_change = NOW()
       WHERE id = $2`,
      [newPasswordHash, userId]
    );
    
    return { success: true, message: 'Password changed successfully' };
  }
  
  async resetPassword(token, newPassword) {
    const pool = await getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Validate new password
      this.validatePassword(newPassword);
      
      // Hash token and find reset record
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      const resetResult = await client.query(
        `SELECT user_id, expires_at, is_used FROM password_reset_tokens
         WHERE token_hash = $1`,
        [tokenHash]
      );
      
      if (resetResult.rows.length === 0) {
        throw new Error('Invalid reset token');
      }
      
      const resetToken = resetResult.rows[0];
      
      if (resetToken.is_used) {
        throw new Error('Reset token has already been used');
      }
      
      if (new Date(resetToken.expires_at) < new Date()) {
        throw new Error('Reset token has expired');
      }
      
      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 12);
      
      // Update password
      await client.query(
        `UPDATE users SET password_hash = $1, last_password_change = NOW()
         WHERE id = $2`,
        [passwordHash, resetToken.user_id]
      );
      
      // Mark token as used
      await client.query(
        `UPDATE password_reset_tokens SET is_used = true, used_at = NOW()
         WHERE token_hash = $1`,
        [tokenHash]
      );
      
      await client.query('COMMIT');
      
      return { success: true, message: 'Password reset successfully' };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============================================================
  // EMAIL VERIFICATION
  // ============================================================
  
  async verifyEmail(token) {
    const pool = await getPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Hash token
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      // Find verification record
      const verifyResult = await client.query(
        `SELECT user_id, expires_at, is_verified FROM user_verification
         WHERE verification_token_hash = $1`,
        [tokenHash]
      );
      
      if (verifyResult.rows.length === 0) {
        throw new Error('Invalid verification token');
      }
      
      const verifyRecord = verifyResult.rows[0];
      
      if (verifyRecord.is_verified) {
        throw new Error('Email already verified');
      }
      
      if (new Date(verifyRecord.expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }
      
      // Update user email verification
      await client.query(
        `UPDATE users SET is_email_verified = true, email_verified_at = NOW()
         WHERE id = $1`,
        [verifyRecord.user_id]
      );
      
      // Mark verification as used
      await client.query(
        `UPDATE user_verification SET is_verified = true, verified_at = NOW()
         WHERE verification_token_hash = $1`,
        [tokenHash]
      );
      
      await client.query('COMMIT');
      
      return { success: true, message: 'Email verified successfully' };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============================================================
  // SESSIONS & TOKENS
  // ============================================================
  
  async createSession(userId, tokenHash, ipAddress, userAgent) {
    const pool = await getPool();
    
    // Extract device info from user agent
    const deviceInfo = this.parseUserAgent(userAgent);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await pool.query(
      `INSERT INTO user_sessions 
       (user_id, token_hash, ip_address, user_agent, device_name, device_os, device_browser, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, tokenHash, ipAddress, userAgent, deviceInfo.name, deviceInfo.os, deviceInfo.browser, expiresAt]
    );
    
    return { success: true };
  }
  
  async revokeSession(tokenHash) {
    const pool = await getPool();
    
    await pool.query(
      `UPDATE user_sessions SET is_active = false, revoked_at = NOW()
       WHERE token_hash = $1`,
      [tokenHash]
    );
    
    return { success: true };
  }
  
  async revokeAllUserSessions(userId) {
    const pool = await getPool();
    
    await pool.query(
      `UPDATE user_sessions SET is_active = false, revoked_at = NOW()
       WHERE user_id = $1`,
      [userId]
    );
    
    return { success: true };
  }
  
  // ============================================================
  // LOGGING & HISTORY
  // ============================================================
  
  async logLoginAttempt(userId, email, status, failureReason, ipAddress, userAgent, method = 'password', twoFactorUsed = false) {
    const pool = await getPool();
    
    const locationInfo = await this.getLocationFromIP(ipAddress);
    
    await pool.query(
      `INSERT INTO user_login_history 
       (user_id, email, login_status, failure_reason, ip_address, user_agent, 
        device_fingerprint, country, city, login_method, two_factor_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [userId, email, status, failureReason, ipAddress, userAgent, null, 
       locationInfo.country, locationInfo.city, method, twoFactorUsed]
    );
  }
  
  // ============================================================
  // VALIDATION
  // ============================================================
  
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
  
  validatePassword(password) {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }
  }
  
  validateUsername(username) {
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      throw new Error('Username can only contain letters, numbers, hyphens, and underscores');
    }
  }
  
  // ============================================================
  // UTILITIES
  // ============================================================
  
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
  
  generateVerificationCode(length = 6) {
    return Math.random().toString().substring(2, 2 + length).padStart(length, '0');
  }
  
  parseUserAgent(userAgent) {
    // Simple user agent parsing - in production use a library like 'ua-parser-js'
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|IE)/);
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/);
    
    return {
      name: userAgent.substring(0, 50),
      browser: browserMatch ? browserMatch[1] : 'Unknown',
      os: osMatch ? osMatch[1] : 'Unknown'
    };
  }
  
  async getLocationFromIP(ipAddress) {
    // In production, integrate with IP geolocation service
    // For now, return generic info
    return {
      country: 'Ethiopia',
      city: 'Unknown'
    };
  }
}

module.exports = new UserService();
