# Backend Onboarding Guide

## Prerequisites

- Node.js 18+
- PostgreSQL client (e.g., DBeaver, psql)
- Azure access (if deploying)
- `.env` file (see `.env.example`)

## Setup Steps

1. **Clone the repo:**
   \`\`\`bash
   git clone https://github.com/ethiopian-navigator1/ethiopian-navigator-mvp.git
   cd ethiopian-navigator-mvp/backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Create `.env` file:**
\`\`\`bash
cp ../.env.example .env
# Fill in values from Azure Key Vault (see infrastructure/README.md for Key Vault secret names)
\`\`\`

4. **Test database connection:**
   \`\`\`bash
   node test-db.js
   \`\`\`

5. **Run backend locally:**
\`\`\`bash
npm start
# or
node server.js
\`\`\`

## CI / CD

This repository includes a GitHub Actions scaffold at `.github/workflows/deploy.yml` that runs tests for Node and Python and can deploy infra (requires Azure service principal secrets in repo settings). See `CONTRIBUTING.md` for local dev commands.

### CI database secret

The deploy workflow supports running DB migrations during CI if you add a repository secret named `STAGING_DATABASE_URL` (a Postgres connection string / DSN). To add it:

1. Go to your repository Settings > Secrets and variables > Actions.
2. Click "New repository secret" and name it `STAGING_DATABASE_URL`.
3. Paste the full Postgres connection string (for example, `postgres://user:pass@host:5432/dbname?sslmode=require`).

When present, the workflow will run `npm run migrate` in the `backend/` folder before the infra deploy step.

6) **API endpoints:**
   - POST `/api/auth/register`
   - POST `/api/auth/login`
   - GET `/api/status`

## Troubleshooting

- **SSL errors:** Ensure `sslmode=require` in DB URI.
- **Port in use:** Change `PORT` in `.env`.
- **DB auth errors:** Check username and password; your username should be like `enavadmin@ethionav-postgres`.

## Tests


- Add tests in `__tests__` folder, run with `npm test`.
