// File: services/service-management/src/service/service.service.ts
// Purpose: Service catalog business logic

import { v4 as uuidv4 } from 'uuid';
import { connectionPool } from '../../../libs/database/connection-pool';
import { logger } from '../../../libs/logging/logger';
import {
  Service,
  ServiceFilter,
  ServiceCategory,
  CreateServiceRequestData,
  ServiceRequest,
  RequestFilter,
} from '../models/service.model';
import axios from 'axios';
import { environmentConfig } from '../../../config/environment';

export class ServiceManagementService {
  // Service Operations
  async listServices(filter?: ServiceFilter): Promise<Service[]> {
    try {
      let query = 'SELECT * FROM service_management.services WHERE 1=1';
      const params: any[] = [];
      let paramCount = 1;

      if (filter?.category_id) {
        query += ` AND category_id = $${paramCount++}`;
        params.push(filter.category_id);
      }

      if (filter?.sector_id) {
        query += ` AND sector_id = $${paramCount++}`;
        params.push(filter.sector_id);
      }

      if (filter?.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filter.status);
      } else {
        query += ` AND status = 'active'`;
      }

      if (filter?.online_only) {
        query += ` AND online_available = true`;
      }

      if (filter?.search) {
        query += ` AND (name ILIKE $${paramCount++} OR description ILIKE $${paramCount++})`;
        const searchTerm = `%${filter.search}%`;
        params.push(searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      if (filter?.limit) {
        query += ` LIMIT $${paramCount++}`;
        params.push(filter.limit);
      }

      if (filter?.offset) {
        query += ` OFFSET $${paramCount++}`;
        params.push(filter.offset);
      }

      return await connectionPool.executeQuery<Service>(query, params, 'service-management');
    } catch (error) {
      logger.error('Failed to list services', error as Error);
      throw error;
    }
  }

  async getService(serviceId: string): Promise<Service> {
    try {
      const result = await connectionPool.executeQuery<Service>(
        'SELECT * FROM service_management.services WHERE id = $1',
        [serviceId],
        'service-management'
      );

      if (result.length === 0) {
        throw new Error('Service not found');
      }

      return result[0];
    } catch (error) {
      logger.error('Failed to get service', error as Error, { serviceId });
      throw error;
    }
  }

  async getCategories(): Promise<ServiceCategory[]> {
    try {
      return await connectionPool.executeQuery<ServiceCategory>(
        'SELECT * FROM service_management.service_categories WHERE is_active = true ORDER BY sort_order',
        [],
        'service-management'
      );
    } catch (error) {
      logger.error('Failed to get categories', error as Error);
      throw error;
    }
  }

  // Service Request Operations
  async createRequest(userId: string, data: CreateServiceRequestData): Promise<ServiceRequest> {
    const requestId = uuidv4();
    const trackingNumber = `SVC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      return await connectionPool.executeTransaction(async (client) => {
        // Verify service exists
        const serviceResult = await client.query(
          'SELECT * FROM service_management.services WHERE id = $1',
          [data.service_id]
        );

        if (serviceResult.rows.length === 0) {
          throw new Error('Service not found');
        }

        const service = serviceResult.rows[0];

        // Create request
        const result = await client.query(
          `INSERT INTO service_management.service_requests 
           (id, user_id, service_id, status, tracking_number, form_data, workflow_state, total_fees)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [
            requestId,
            userId,
            data.service_id,
            'submitted',
            trackingNumber,
            JSON.stringify(data.form_data),
            'initial',
            service.service_fee,
          ]
        );

        const request = result.rows[0] as ServiceRequest;
        logger.info('Service request created', { requestId, userId, serviceId: data.service_id });

        // Publish event to event log
        await client.query(
          `INSERT INTO shared_infrastructure.event_log 
           (event_type, aggregate_id, aggregate_type, source_service, payload)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            'service_request.created',
            requestId,
            'ServiceRequest',
            'service-management',
            JSON.stringify({ userId, serviceId: data.service_id }),
          ]
        );

        return request;
      }, 'service-management');
    } catch (error) {
      logger.error('Failed to create service request', error as Error, { userId });
      throw error;
    }
  }

  async getRequest(requestId: string): Promise<ServiceRequest> {
    try {
      const result = await connectionPool.executeQuery<ServiceRequest>(
        'SELECT * FROM service_management.service_requests WHERE id = $1',
        [requestId],
        'service-management'
      );

      if (result.length === 0) {
        throw new Error('Request not found');
      }

      return result[0];
    } catch (error) {
      logger.error('Failed to get request', error as Error, { requestId });
      throw error;
    }
  }

  async listRequests(userId: string, filter?: RequestFilter): Promise<ServiceRequest[]> {
    try {
      let query = 'SELECT * FROM service_management.service_requests WHERE user_id = $1';
      const params: any[] = [userId];
      let paramCount = 2;

      if (filter?.status) {
        query += ` AND status = $${paramCount++}`;
        params.push(filter.status);
      }

      if (filter?.service_id) {
        query += ` AND service_id = $${paramCount++}`;
        params.push(filter.service_id);
      }

      query += ' ORDER BY created_at DESC';

      if (filter?.limit) {
        query += ` LIMIT $${paramCount++}`;
        params.push(filter.limit);
      }

      return await connectionPool.executeQuery<ServiceRequest>(query, params, 'service-management');
    } catch (error) {
      logger.error('Failed to list requests', error as Error, { userId });
      throw error;
    }
  }

  // Cross-Service Communication
  async verifyUserExists(userId: string, token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `${environmentConfig.services.userService.url}/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: environmentConfig.services.userService.timeout,
        }
      );

      return response.status === 200;
    } catch (error) {
      logger.warn('User verification failed', { userId });
      return false;
    }
  }
}

export default new ServiceManagementService();
