# TrueChoice — AI-Powered Product Recommendation Tool

## Overview
TrueChoice is an AI-powered recommendation engine that asks users a few smart questions and returns the top 3 Amazon product recommendations with affiliate links embedded.

**Tech Stack:** React + Tailwind CSS · Vercel Serverless Functions · Claude Haiku AI · Supabase (PostgreSQL) · Upstash Redis

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- Accounts: GitHub, Vercel, Supabase, Upstash, Anthropic

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your credentials
cp .env.example .env.local

# Fill in all environment variables from:
# - Anthropic API (console.anthropic.com)
# - Supabase (Database Settings → API)
# - Upstash (Redis Database)

# Run locally with Vercel CLI
npm install -g vercel
vercel dev

# Visit http://localhost:3000
```

### Project Structure
```
truechoice/
├── src/
│   ├── pages/          # Home, Questionnaire, Loading, Results, Admin
│   ├── components/     # Reusable UI components
│   ├── services/       # API calls and integrations
│   └── utils/          # Helpers (caching, formatting)
├── api/                # Vercel Serverless Functions
│   ├── recommend.js    # Main recommendation endpoint
│   └── admin/          # Admin CRUD operations
└── public/             # Static assets
```

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Visit your domain

For detailed deployment instructions, see the requirements document.

## Features

- **Landing Page:** Hero section with how-it-works flow
- **Questionnaire:** 5 smart questions, one at a time
- **Loading Screen:** Animated processing indicator
- **Results:** 3 personalized product recommendations
- **Admin Console:** Manage products via UI (no code editing needed)
- **Caching:** 7-day Redis cache for cost optimization
- **Affiliate Links:** Embedded Amazon affiliate links with commissions

## Cost Optimization

- Claude Haiku API: ~$0.001 per query
- Upstash Redis: Free tier (10,000 commands/day)
- Supabase: Free tier (500MB database)
- Vercel: Free tier (serverless functions included)

**Target:** Under $0.10/month per user after cache warming

## Admin Console

Access at `/admin` with password from `VITE_ADMIN_PASSWORD`

- Add new products
- Edit existing products
- Delete products
- Filter by category
- Toggle active/inactive status

---

*Ready to build. All components, services, and functions are scaffolded. Add your Supabase products and you're live.*
