// File: services/user-service/src/models/user.model.ts
// Purpose: TypeScript interfaces for User Service

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  email_verified: boolean;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile extends User {
  address?: string;
  city?: string;
  region?: string;
  preferred_language?: string;
  notification_preferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  full_name: string;
  phone?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  status?: string;
  role?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
