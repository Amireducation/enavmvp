import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserFromRequest } from '@/lib/api-utils'

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'
    const serviceId = url.searchParams.get('serviceId')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    let query = `
      SELECT 
        sr.id, sr.service_id, sr.user_id, sr.status, sr.workflow_state,
        sr.created_at, sr.updated_at, sr.documents, sr.notes,
        s.name as service_name, s.name_am, s.name_or,
        u.full_name, u.email, u.phone,
        sv.variation_name,
        MAX(sc.name) as category,
        AVG(EXTRACT(DAY FROM (NOW() - sr.created_at))) as days_pending
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN users u ON sr.user_id = u.id
      LEFT JOIN service_variations sv ON sr.variation_id = sv.id
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE sr.status = '${status}'
    `

    if (serviceId) {
      query += ` AND sr.service_id = '${serviceId}'`
    }

    query += ` GROUP BY sr.id, s.name, s.name_am, s.name_or, u.full_name, u.email, u.phone, sv.variation_name
      ORDER BY sr.created_at ASC
      LIMIT ${limit}`

    const requests = await sql(query)

    // Calculate SLA breach
    const breached = requests.filter((r: any) => r.days_pending > 10)

    return NextResponse.json({
      requests,
      summary: {
        total: requests.length,
        breached: breached.length,
        avgDaysPending: requests.reduce((sum: number, r: any) => sum + (r.days_pending || 0), 0) / requests.length
      }
    })
  } catch (error) {
    console.error('Admin queue error:', error)
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
  }
}
