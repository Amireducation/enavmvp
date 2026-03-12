import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { validateAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = validateAuth(request);
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const body = await request.json();
    const { businessName, registrationNumber, taxId, businessType, contactEmail, contactPhone, address } = body;

    if (!businessName || !registrationNumber) {
      return errorResponse('INVALID_REQUEST', 'Missing required fields', 400);
    }

    // Check if business profile already exists
    const existing = await sql.unsafe(
      `SELECT id FROM business_profiles WHERE registration_number = '${registrationNumber}'`
    );

    if (existing.length > 0) {
      return errorResponse('DUPLICATE_BUSINESS', 'Business profile already exists', 409);
    }

    // Create new business profile
    const result = await sql.unsafe(
      `INSERT INTO business_profiles 
       (user_id, business_name, registration_number, tax_id, business_type, contact_email, contact_phone, address, status, created_at)
       VALUES ('${user.id}', '${businessName}', '${registrationNumber}', '${taxId}', '${businessType}', '${contactEmail}', '${contactPhone}', '${address}', 'pending_verification', NOW())
       RETURNING id, status, created_at`
    );

    if (result.length === 0) {
      return errorResponse('CREATION_FAILED', 'Failed to create business profile', 500);
    }

    // Send notification for verification
    await sql.unsafe(
      `INSERT INTO notifications (user_id, type, title, message, created_at)
       VALUES ('${user.id}', 'info', 'Business Profile Created', 'Your business profile has been submitted for verification. We will review it within 2-3 business days.', NOW())`
    );

    return successResponse({
      businessProfile: {
        id: result[0].id,
        businessName,
        status: result[0].status,
        createdAt: result[0].created_at
      }
    }, 201);
  } catch (error: any) {
    console.error('Error creating business profile:', error);
    return errorResponse('SERVER_ERROR', 'Failed to create business profile', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = validateAuth(request);
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const profiles = await sql.unsafe(
      `SELECT id, business_name, registration_number, tax_id, business_type, status, created_at, updated_at
       FROM business_profiles
       WHERE user_id = '${user.id}'
       ORDER BY created_at DESC`
    );

    return successResponse({ businesses: profiles });
  } catch (error: any) {
    console.error('Error fetching business profiles:', error);
    return errorResponse('SERVER_ERROR', 'Failed to fetch business profiles', 500);
  }
}
