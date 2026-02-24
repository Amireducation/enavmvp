# Frontend Onboarding Guide

## Prerequisites

- Node.js 18+
- Yarn or npm
- `.env` file for frontend (see `.env.example`)

## Setup Steps

1. **Navigate to frontend**
   \`\`\`bash
   cd ethiopian-navigator-mvp/frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. **Start dev server**
   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

4. **Portals**
   - `citizen-portal/App.jsx`
   - `admin-portal/App.jsx`
   - `employee-portal/App.jsx`
   - `partner-portal/App.jsx`
   - Shared UI in `shared-components/`

5. **API Integration**
   - All API calls use `REACT_APP_API_URL` from `.env`

## Tips

- Use `shared-components/` for Nav, Footer, etc.
- Use i18n (react-i18next) for multilingual support.
- Use environment variables for endpoints.
