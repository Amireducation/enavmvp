// Role-Based Access Control (RBAC) middleware and utilities

const ROLE_PERMISSIONS = {
  citizen: [
    'view_own_profile',
    'edit_own_profile',
    'browse_services',
    'create_service_request',
    'view_own_requests',
    'update_own_requests',
    'submit_feedback',
    'view_own_feedback',
    'use_chatbot'
  ],
  employee: [
    'view_citizens',
    'review_service_requests',
    'update_service_request_status',
    'create_applications',
    'view_all_requests',
    'view_statistics',
    'submit_feedback',
    'view_feedback',
    'manage_own_profile'
  ],
  admin: [
    'manage_users',
    'manage_services',
    'manage_service_categories',
    'manage_service_requests',
    'manage_applications',
    'manage_employees',
    'view_all_data',
    'view_analytics',
    'manage_feedback',
    'manage_notifications',
    'system_configuration'
  ],
  partner: [
    'view_own_partnerships',
    'view_services',
    'access_partner_dashboard',
    'generate_partner_reports',
    'view_partnership_analytics',
    'submit_feedback',
    'manage_own_profile'
  ]
};

// Check if user has permission
function hasPermission(user, requiredPermission) {
  if (!user) return false;
  if (!user.role) return false;
  
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(requiredPermission);
}

// Check if user has any of the permissions
function hasAnyPermission(user, requiredPermissions = []) {
  if (!user) return false;
  return requiredPermissions.some(perm => hasPermission(user, perm));
}

// Check if user has all permissions
function hasAllPermissions(user, requiredPermissions = []) {
  if (!user) return false;
  return requiredPermissions.every(perm => hasPermission(user, perm));
}

// Middleware factory: Check single permission
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ error: `Permission denied: ${permission} required` });
    }

    next();
  };
}

// Middleware factory: Check any of multiple permissions
function requireAnyPermission(permissions = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasAnyPermission(req.user, permissions)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Middleware factory: Check all permissions
function requireAllPermissions(permissions = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasAllPermissions(req.user, permissions)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Middleware factory: Check role
function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Invalid role for this operation' });
    }

    next();
  };
}

module.exports = {
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole
};
