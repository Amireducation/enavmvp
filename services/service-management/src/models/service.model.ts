// File: services/service-management/src/models/service.model.ts
// Purpose: TypeScript interfaces for Service Management

export interface Service {
  id: string;
  name: string;
  description: string;
  category_id: string;
  sector_id: string;
  status: 'active' | 'inactive' | 'archived';
  estimated_processing_days: number;
  service_fee: number;
  online_available: boolean;
  requires_eligibility_check: boolean;
  is_renewable: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  service_id: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'completed';
  tracking_number: string;
  form_data: Record<string, any>;
  documents: string[];
  priority: 'low' | 'normal' | 'high';
  urgency_level: 'normal' | 'urgent';
  payment_status: 'pending' | 'partial' | 'paid';
  total_fees: number;
  paid_amount: number;
  workflow_state: string;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface CreateServiceRequestData {
  service_id: string;
  form_data: Record<string, any>;
  documents?: string[];
  priority?: string;
  urgency_level?: string;
}

export interface ServiceFilter {
  category_id?: string;
  sector_id?: string;
  status?: string;
  online_only?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface RequestFilter {
  user_id?: string;
  service_id?: string;
  status?: string;
  from_date?: Date;
  to_date?: Date;
  limit?: number;
  offset?: number;
}

export interface ServiceWorkflow {
  id: string;
  service_id: string;
  workflow_name: string;
  initial_state: string;
  states: string[];
  transitions: Record<string, string[]>;
}

export interface WorkflowTransition {
  request_id: string;
  from_state: string;
  to_state: string;
  action: string;
  notes?: string;
  performed_by: string;
}
