// File: services/user-service/src/service/user.service.ts
// Purpose: User business logic and operations

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { connectionPool } from '../../../libs/database/connection-pool';
import { logger } from '../../../libs/logging/logger';
import { environmentConfig } from '../../../config/environment';
import {
  User,
  UserProfile,
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  JWTPayload,
} from '../models/user.model';

export class UserService {
  private readonly saltRounds = environmentConfig.auth.bcryptSaltRounds;
  private readonly jwtSecret = environmentConfig.auth.jwtSecret;
  private readonly jwtExpiration = environmentConfig.auth.jwtExpiration;

  // Authentication & Registration
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const userId = uuidv4();

    try {
      return await connectionPool.executeTransaction(async (client) => {
        // Check if email exists
        const existingUser = await client.query(
          'SELECT id FROM user_service.users WHERE email = $1',
          [data.email]
        );

        if (existingUser.rows.length > 0) {
          throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

        // Create user
        const result = await client.query(
          `INSERT INTO user_service.users 
           (id, email, password_hash, full_name, phone, status, role)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [userId, data.email, passwordHash, data.full_name, data.phone, 'active', 'user']
        );

        const user = result.rows[0] as User;
        logger.info('User registered successfully', { userId, email: data.email });

        // Generate tokens
        const tokens = this.generateTokens(user);

        return {
          user: user as UserProfile,
          ...tokens,
        };
      }, 'user-service');
    } catch (error) {
      logger.error('Registration failed', error as Error, { email: data.email });
      throw error;
    }
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    try {
      const result = await connectionPool.executeQuery<User>(
        'SELECT * FROM user_service.users WHERE email = $1 AND status = $2',
        [data.email, 'active'],
        'user-service'
      );

      if (result.length === 0) {
        throw new Error('Invalid credentials');
      }

      const user = result[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password_hash as any);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      logger.info('User logged in', { userId: user.id });

      // Generate tokens
      const tokens = this.generateTokens(user);

      return {
        user: user as UserProfile,
        ...tokens,
      };
    } catch (error) {
      logger.error('Login failed', error as Error, { email: data.email });
      throw error;
    }
  }

  // Token Management
  async validateToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      logger.warn('Token validation failed', { error: (error as Error).message });
      throw new Error('Invalid token');
    }
  }

  // User Management
  async getUser(userId: string): Promise<UserProfile> {
    try {
      const result = await connectionPool.executeQuery<UserProfile>(
        'SELECT * FROM user_service.users WHERE id = $1',
        [userId],
        'user-service'
      );

      if (result.length === 0) {
        throw new Error('User not found');
      }

      return result[0];
    } catch (error) {
      logger.error('Failed to get user', error as Error, { userId });
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updates: string[] = [];
      const values: any[] = [userId];
      let paramCount = 2;

      if (data.full_name) {
        updates.push(`full_name = $${paramCount++}`);
        values.push(data.full_name);
      }
      if (data.phone) {
        updates.push(`phone = $${paramCount++}`);
        values.push(data.phone);
      }
      if (data.avatar_url) {
        updates.push(`avatar_url = $${paramCount++}`);
        values.push(data.avatar_url);
      }

      if (updates.length === 0) {
        return this.getUser(userId);
      }

      updates.push('updated_at = NOW()');

      const query = `
        UPDATE user_service.users 
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `;

      const result = await connectionPool.executeQuery<UserProfile>(
        query,
        values,
        'user-service'
      );

      logger.info('Profile updated', { userId });
      return result[0];
    } catch (error) {
      logger.error('Failed to update profile', error as Error, { userId });
      throw error;
    }
  }

  async changePassword(userId: string, data: ChangePasswordRequest): Promise<void> {
    try {
      // Get current user
      const user = await this.getUser(userId);
      const userWithPassword = user as any;

      // Verify current password
      const isValid = await bcrypt.compare(data.currentPassword, userWithPassword.password_hash);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(data.newPassword, this.saltRounds);

      // Update password
      await connectionPool.executeQuery(
        'UPDATE user_service.users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
        [newPasswordHash, userId],
        'user-service'
      );

      logger.info('Password changed', { userId });
    } catch (error) {
      logger.error('Failed to change password', error as Error, { userId });
      throw error;
    }
  }

  // Admin Operations
  async createUser(data: CreateUserRequest): Promise<User> {
    const userId = uuidv4();

    try {
      const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

      const result = await connectionPool.executeQuery<User>(
        `INSERT INTO user_service.users 
         (id, email, password_hash, full_name, phone, role, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, data.email, passwordHash, data.full_name, data.phone, data.role, 'active'],
        'user-service'
      );

      logger.info('User created (admin)', { userId, email: data.email });
      return result[0];
    } catch (error) {
      logger.error('Failed to create user', error as Error);
      throw error;
    }
  }

  async listUsers(filter?: { role?: string; status?: string }): Promise<User[]> {
    try {
      let query = 'SELECT * FROM user_service.users WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (filter?.role) {
        query += ` AND role = $${paramCount++}`;
        params.push(filter.role);
      }

      if (filter?.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filter.status);
      }

      query += ' ORDER BY created_at DESC';

      return await connectionPool.executeQuery<User>(query, params, 'user-service');
    } catch (error) {
      logger.error('Failed to list users', error as Error);
      throw error;
    }
  }

  // Private Methods
  private generateTokens(user: User): { token: string; refreshToken: string; expiresIn: number } {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    };

    const token = jwt.sign(payload, this.jwtSecret);
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      expiresIn: 86400,
    };
  }
}

export default new UserService();
