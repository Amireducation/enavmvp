import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { validateAuth, successResponse, errorResponse } from '@/lib/api-utils';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = validateAuth(request);
    if (!user) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const body = await request.json();
    const { action, comments } = body; // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return errorResponse('INVALID_REQUEST', 'Invalid action', 400);
    }

    const workflowId = params.id;

    // Get workflow details
    const workflow = await sql.unsafe(
      `SELECT id, from_agency, to_agency, status FROM g2g_workflows WHERE id = '${workflowId}'`
    );

    if (workflow.length === 0) {
      return errorResponse('NOT_FOUND', 'Workflow not found', 404);
    }

    const workflowRecord = workflow[0];

    // Check authorization
    const userAgency = await sql.unsafe(
      `SELECT agency FROM users WHERE id = '${user.id}'`
    );

    if (userAgency.length === 0 || userAgency[0].agency !== workflowRecord.to_agency) {
      return errorResponse('FORBIDDEN', 'You are not authorized to approve this workflow', 403);
    }

    // Update workflow status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const approvedAt = action === 'approve' ? 'NOW()' : 'NULL';

    await sql.unsafe(
      `UPDATE g2g_workflows 
       SET status = '${newStatus}', 
           approved_by = '${user.id}', 
           approval_comments = ${comments ? `'${comments}'` : 'NULL'},
           approved_at = ${approvedAt},
           updated_at = NOW()
       WHERE id = '${workflowId}'`
    );

    // Update related tasks
    await sql.unsafe(
      `UPDATE workflow_tasks 
       SET status = '${newStatus}', 
           completed_by = '${user.id}',
           completed_at = NOW()
       WHERE workflow_id = '${workflowId}'`
    );

    // Send notifications
    const creators = await sql.unsafe(
      `SELECT created_by FROM g2g_workflows WHERE id = '${workflowId}'`
    );

    if (creators.length > 0) {
      const message = action === 'approve' 
        ? 'Your G2G workflow has been approved'
        : `Your G2G workflow has been rejected${comments ? `: ${comments}` : ''}`;

      await sql.unsafe(
        `INSERT INTO notifications (user_id, type, title, message, reference_type, reference_id, created_at)
         VALUES ('${creators[0].created_by}', 'workflow', 
                 '${action === 'approve' ? 'Workflow Approved' : 'Workflow Rejected'}', 
                 '${message}', 'workflow', '${workflowId}', NOW())`
      );
    }

    return successResponse({
      workflow: {
        id: workflowId,
        status: newStatus,
        approvedAt: action === 'approve' ? new Date() : null
      }
    });
  } catch (error: any) {
    console.error('Error updating workflow:', error);
    return errorResponse('SERVER_ERROR', 'Failed to update workflow', 500);
  }
}
