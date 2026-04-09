# JobSpeeder — Claude Context

## Description
SaaS qui automatise les candidatures d'emploi via IA (GPT-4o). Les utilisateurs soumettent leur CV + préférences, la plateforme postule automatiquement via n8n + Playwright.

## Stack
- Next.js 14, React 18, TypeScript 5
- Tailwind CSS, Framer Motion
- Supabase (auth SSR + PostgreSQL)
- Stripe (abonnements)
- OpenAI, Google APIs, @react-pdf/renderer

## Lancer en dev
```bash
cd /opt/jobspeeder
npm run dev        # port 3000
npm run build && npm start   # prod
```

## Déploiement
Hébergé sur Vercel. Config dans `.vercel/`.
```bash
npx vercel deploy --prod
```
URL prod : https://jobspeeder.online

## Variables d'environnement
Fichier : `/opt/jobspeeder/.env.local`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_JOBSPEEDER_WEBHOOK` (webhook n8n)
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_GOLD_MONTHLY/ANNUAL`, `PLATINUM_*`, `ELITE_*`
- `NEXT_PUBLIC_APP_URL` = https://jobspeeder.online

## Fichiers clés
- `middleware.ts` — protection des routes (dashboard, cv, applications, settings, onboarding)
- `app/api/preferences/` — CV + préférences utilisateur
- `app/api/job-offers/` — offres depuis Google Sheets
- `app/api/webhook/stripe/` — lifecycle abonnements Stripe
- `app/api/webhook/n8n/` — reçoit les updates de candidatures depuis n8n
- `app/api/checkout/` — création session Stripe
- `supabase/` — migrations + types générés

## Règles
- Ne pas casser l'auth SSR Supabase (middleware.ts est critique)
- Les types Supabase sont générés — ne pas éditer manuellement `types/supabase.ts`
