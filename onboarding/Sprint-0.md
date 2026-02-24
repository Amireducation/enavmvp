# Sprint 0 — Project Kickoff & Infrastructure Checklist

This checklist contains the minimum deliverables for Sprint 0 (foundation work).

Local dev readiness (Windows PowerShell)

1. Install required tools

\`\`\`powershell
# Node.js (recommended 18.x)
# https://nodejs.org/
# Python (3.10+)
# https://www.python.org/
# Azure CLI
winget install Microsoft.AzureCLI
# Git
winget install Git.Git
# Postgres client (psql) or GUI (DBeaver)
\`\`\`

2. Quick environment setup

\`\`\`powershell
# Backend
cd backend
npm install
# Chatbot
cd ..\ai-chatbot
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
\`\`\`

3. Secrets / Key Vault
- Create an Azure Key Vault or use the one deployed by `infrastructure/main.bicep`.
- Recommended secret names (documented in `infrastructure/README.md`): `DB_CONN`, `DB_ADMIN_USER`, `JWT_SECRET`, `AZ_OPENAI_KEY`, `COSMOS_CONN`.
- Use `scripts/setup-keyvault.ps1` as a template to populate secrets locally (requires `az` authenticated session).

4. Infra deploy (developer)

\`\`\`powershell
# ensure you are logged in
az login
az account set --subscription <your-subscription-id>
# deploy infra (example)
az group create --name ethiopian-navigator-rg --location eastus
az deployment group create --resource-group ethiopian-navigator-rg --template-file infrastructure/main.bicep --parameters prefix=ethionav
\`\`\`

5. Verify local services
- Backend: `npm run dev` (from `backend/`) and confirm `GET /api/status` returns 200.
- Chatbot: run `python app.py` in `ai-chatbot` virtualenv and call `POST http://127.0.0.1:8000/query`.

6. CI secrets needed (GitHub repo):
- `AZURE_CREDENTIALS` (service principal JSON)
- `AZURE_RG` (resource group name)
- `RESOURCE_PREFIX` (naming prefix)

7. Next steps (after Sprint 0)
- Add DB migrations and sample data importer (`backend/scripts/`)
- Add Supertest coverage for API contracts
- Implement CI gate to require infra deployment approvals for main

If you want, I can fill in the DB migration template and a sample data loader next.
