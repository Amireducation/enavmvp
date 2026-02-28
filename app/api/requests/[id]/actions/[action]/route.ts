import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromRequest } from '@/lib/api-utils'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params
    const user = getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notes, documents, adminId } = body

    // Verify admin access if needed
    if (['approve', 'reject', 'request_clarification'].includes(action)) {
      const admin = await sql`
        SELECT role FROM users WHERE id = ${user.id}
      `
      if (!admin[0] || admin[0].role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    let newStatus = 'pending'
    let newState = 'submitted'

    switch (action) {
      case 'submit':
        newStatus = 'pending'
        newState = 'submitted'
        break
      case 'approve':
        newStatus = 'approved'
        newState = 'approved'
        break
      case 'reject':
        newStatus = 'rejected'
        newState = 'rejected'
        break
      case 'request_clarification':
        newStatus = 'pending_clarification'
        newState = 'pending_clarification'
        break
      case 'resubmit':
        newStatus = 'pending'
        newState = 'resubmitted'
        break
      case 'issue':
        newStatus = 'issued'
        newState = 'issued'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const result = await sql`
      UPDATE service_requests
      SET 
        status = ${newStatus},
        workflow_state = ${newState},
        documents = CASE WHEN ${documents ? 'true' : 'false'}::boolean 
          THEN jsonb_set(documents, '{last_update}', to_jsonb(NOW()))
          ELSE documents 
        END,
        notes = CASE WHEN ${notes} IS NOT NULL 
          THEN jsonb_set(notes, '{${action}}', to_jsonb(${notes}))
          ELSE notes 
        END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, service_id, status, workflow_state, updated_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    return NextResponse.json({ request: result[0] })
  } catch (error) {
    console.error('Workflow transition error:', error)
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 })
  }
}
