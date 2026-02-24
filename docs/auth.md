# Authentication API

This document describes the authentication endpoints for the Ethiopian Navigator backend.

Base URL (local): `http://127.0.0.1:5000/api`

## Register

POST `/api/auth/register`

Request body (application/json):

\`\`\`json
{ "email": "user@example.com", "password": "P@ssw0rd", "role": "user" }
\`\`\`

Responses:

- 201: `{"message": "User registered"}`
- 400: `{"error": "email and password required"}`
- 409: `{"error": "User already exists"}`

## Login

POST `/api/auth/login`

Request body (application/json):

\`\`\`json
{ "email": "user@example.com", "password": "P@ssw0rd" }
\`\`\`

Responses:

- 200: `{"token": "<JWT>"}`
- 400: `{"error": "email and password required"}`
- 401: `{"error": "Invalid credentials"}`

## Token details

- JWT payload includes: `id`, `email`, `role`.
- Expires: 7 days (configured in `backend/routes/auth.js`).
- Use the token as an Authorization header: `Authorization: Bearer <token>`.

## Protected profile

GET `/api/profile`

Headers: `Authorization: Bearer <token>`

Returns the decoded token payload:

\`\`\`json
{ "user": { "id": "...", "email": "...", "role": "...", "iat": 0, "exp": 0 } }
\`\`\`

## RBAC

Use the `role` claim in the JWT payload to gate access to admin endpoints. Example middleware: `authorizeRoles('admin')`.

## Examples (PowerShell)

\`\`\`powershell
# Register
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/auth/register" -Method POST -Body (@{ email='a@a.com'; password='P@ss' } | ConvertTo-Json) -ContentType 'application/json'

# Login
$resp = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/auth/login" -Method POST -Body (@{ email='a@a.com'; password='P@ss' } | ConvertTo-Json) -ContentType 'application/json'
$token = $resp.token

# Profile
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/profile" -Headers @{ Authorization = "Bearer $token" }
\`\`\`
