import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { validateAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = validateAuth(request);
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const body = await request.json();
    const { workflowType, fromAgency, toAgency, serviceId, description, documents, priority } = body;

    if (!workflowType || !fromAgency || !toAgency) {
      return errorResponse('INVALID_REQUEST', 'Missing required fields', 400);
    }

    // Create collaboration workflow
    const result = await sql.unsafe(
      `INSERT INTO g2g_workflows 
       (workflow_type, from_agency, to_agency, service_id, description, documents, priority, status, created_by, created_at)
       VALUES ('${workflowType}', '${fromAgency}', '${toAgency}', ${serviceId ? `'${serviceId}'` : 'NULL'}, '${description}', '${JSON.stringify(documents || [])}', '${priority || 'normal'}', 'pending_review', '${user.id}', NOW())
       RETURNING id, status, created_at`
    );

    if (result.length === 0) {
      return errorResponse('CREATION_FAILED', 'Failed to create workflow', 500);
    }

    const workflowId = result[0].id;

    // Create workflow task for approver
    await sql.unsafe(
      `INSERT INTO workflow_tasks (workflow_id, task_type, assigned_to_role, status, priority, created_at)
       VALUES ('${workflowId}', 'review', 'manager', 'pending', '${priority || 'normal'}', NOW())`
    );

    // Send notifications to relevant parties
    const agencyUsers = await sql.unsafe(
      `SELECT id FROM users WHERE agency = '${toAgency}' AND role IN ('manager', 'admin')`
    );

    for (const agencyUser of agencyUsers) {
      await sql.unsafe(
        `INSERT INTO notifications (user_id, type, title, message, reference_type, reference_id, created_at)
         VALUES ('${agencyUser.id}', 'workflow', 'New G2G Workflow', 'A new inter-agency collaboration request requires your review', 'workflow', '${workflowId}', NOW())`
      );
    }

    return successResponse({
      workflow: {
        id: workflowId,
        workflowType,
        status: result[0].status,
        createdAt: result[0].created_at
      }
    }, 201);
  } catch (error: any) {
    console.error('Error creating G2G workflow:', error);
    return errorResponse('SERVER_ERROR', 'Failed to create workflow', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = validateAuth(request);
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let query = `
      SELECT id, workflow_type, from_agency, to_agency, service_id, description, priority, status, created_at
      FROM g2g_workflows
      WHERE (from_agency IN (SELECT agency FROM users WHERE id = '${user.id}') 
        OR to_agency IN (SELECT agency FROM users WHERE id = '${user.id}'))
    `;

    if (status !== 'all') {
      query += ` AND status = '${status}'`;
    }

    query += ` ORDER BY created_at DESC LIMIT ${limit}`;

    const workflows = await sql.unsafe(query);

    return successResponse({ workflows });
  } catch (error: any) {
    console.error('Error fetching G2G workflows:', error);
    return errorResponse('SERVER_ERROR', 'Failed to fetch workflows', 500);
  }
}
