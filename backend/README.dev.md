# Backend developer quickstart

Run these steps in Windows PowerShell (copy/paste):

1. Install dependencies

\`\`\`powershell
cd backend
npm install
\`\`\`

1. Create `.env` from `.env.example` and set values

\`\`\`powershell
copy .env.example .env
# Edit .env as needed (POSTGRES_CONN_STRING, JWT_SECRET)
notepad .env
\`\`\`

1. Start backend (foreground, will show logs)

\`\`\`powershell
cd backend
npm run dev
\`\`\`

1. Start chatbot in a separate terminal (see ai-chatbot/README.md)

1. Run smoke tests (powershell script in scripts/)

\`\`\`powershell
cd backend
.\scripts\run-smoke-tests.ps1
\`\`\`
