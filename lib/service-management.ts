import { sql } from '@/lib/db'

export interface ServiceRequest {
  id: string
  service_id: string
  user_id: string
  status: string
  variation_id?: string
  documents?: Record<string, string>
  workflow_state?: string
  created_at: Date
  updated_at: Date
}

export async function createServiceRequest(
  userId: string,
  serviceId: string,
  variationId?: string,
  documents?: Record<string, string>
): Promise<ServiceRequest> {
  const result = await sql`
    INSERT INTO service_requests (user_id, service_id, variation_id, documents, workflow_state, status)
    VALUES (${userId}, ${serviceId}, ${variationId || null}, ${JSON.stringify(documents || {})}, 'submitted', 'pending')
    RETURNING *
  `
  return result[0]
}

export async function getServiceRequest(requestId: string, userId: string): Promise<ServiceRequest> {
  const result = await sql`
    SELECT * FROM service_requests WHERE id = ${requestId} AND user_id = ${userId}
  `
  return result[0]
}

export async function updateWorkflowState(
  requestId: string,
  newState: string,
  adminId: string
): Promise<ServiceRequest> {
  const result = await sql`
    UPDATE service_requests 
    SET workflow_state = ${newState}, updated_at = NOW()
    WHERE id = ${requestId}
    RETURNING *
  `
  return result[0]
}

export async function checkEligibility(
  userId: string,
  serviceId: string,
  userProfile: Record<string, any>
): Promise<{ eligible: boolean; failedRules: string[] }> {
  const rules = await sql`
    SELECT * FROM eligibility_rules 
    WHERE service_id = ${serviceId} AND is_active = TRUE
    ORDER BY priority DESC
  `
  
  const failedRules: string[] = []
  
  for (const rule of rules) {
    const value = userProfile[rule.rule_type]
    const ruleValues = rule.value_json
    
    let passes = false
    switch (rule.operator) {
      case 'equals':
        passes = value === ruleValues.value
        break
      case 'greater_than':
        passes = value > ruleValues.min
        break
      case 'between':
        passes = value >= ruleValues.min && value <= ruleValues.max
        break
      case 'in_list':
        passes = ruleValues.list.includes(value)
        break
    }
    
    if (!passes && rule.condition_type === 'required') {
      failedRules.push(rule.rule_name)
    }
  }
  
  return {
    eligible: failedRules.length === 0,
    failedRules
  }
}

export async function getServiceVariations(serviceId: string) {
  return await sql`
    SELECT * FROM service_variations
    WHERE service_id = ${serviceId} AND is_available = TRUE
  `
}

export async function getServiceRequirements(serviceId: string) {
  return await sql`
    SELECT * FROM service_requirements
    WHERE service_id = ${serviceId} AND is_active = TRUE
  `
}
