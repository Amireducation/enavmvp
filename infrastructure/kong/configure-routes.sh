#!/bin/bash
# File: infrastructure/kong/configure-routes.sh
# Purpose: Configure Kong routes and services

set -e

KONG_ADMIN_URL=${KONG_ADMIN_URL:-http://localhost:8001}
USER_SERVICE_URL=${USER_SERVICE_URL:-http://user-service:3001}
SERVICE_MGMT_URL=${SERVICE_MGMT_URL:-http://service-management:3002}

echo "🔧 Configuring Kong API Gateway..."

# Function to add Kong service
add_kong_service() {
  local name=$1
  local url=$2
  
  echo "📝 Adding service: $name"
  curl -X POST $KONG_ADMIN_URL/services \
    -H "Content-Type: application/json" \
    -d @- <<EOF
{
  "name": "$name",
  "url": "$url"
}
EOF
  echo ""
}

# Function to add Kong route
add_kong_route() {
  local service_name=$1
  local path=$2
  
  echo "🛣️  Adding route: $path -> $service_name"
  curl -X POST $KONG_ADMIN_URL/services/$service_name/routes \
    -H "Content-Type: application/json" \
    -d @- <<EOF
{
  "paths": ["$path"]
}
EOF
  echo ""
}

# Function to add rate limiting plugin
add_rate_limiting() {
  local service_name=$1
  local minute_limit=${2:-100}
  
  echo "⚡ Adding rate limiting to $service_name: $minute_limit req/min"
  curl -X POST $KONG_ADMIN_URL/services/$service_name/plugins \
    -H "Content-Type: application/json" \
    -d @- <<EOF
{
  "name": "rate-limiting",
  "config": {
    "minute": $minute_limit,
    "policy": "local"
  }
}
EOF
  echo ""
}

# Configure User Service
add_kong_service "user-service" "$USER_SERVICE_URL"
add_kong_route "user-service" "/api/auth"
add_kong_route "user-service" "/api/users"
add_kong_route "user-service" "/api/profile"
add_rate_limiting "user-service" 200

# Configure Service Management
add_kong_service "service-management" "$SERVICE_MGMT_URL"
add_kong_route "service-management" "/api/services"
add_kong_route "service-management" "/api/requests"
add_rate_limiting "service-management" 150

echo "✅ Kong API Gateway configuration complete!"
echo ""
echo "📊 Gateway Info:"
echo "   Admin UI: http://localhost:1337"
echo "   Kong Admin API: http://localhost:8001"
echo "   Gateway Proxy: http://localhost:8000"
echo ""
echo "🧪 Test endpoints:"
echo "   curl http://localhost:8000/api/services"
echo "   curl http://localhost:8000/api/auth/login"
