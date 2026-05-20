# RCM Billing — AgentPay Labs

Healthcare Revenue Cycle Management. Next.js SaaS dashboard.

## Features

- **Claims** — Submit, track, and manage the full claims lifecycle
- **Denials** — Queue, categorise, and bulk-resubmit denied claims with ANSI X12 reason codes
- **ERA 835** — Upload and auto-match electronic remittance advice files
- **Dashboard** — Revenue trends, AR aging buckets, collection rates, denial KPIs

## Quick Start

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe (subscription billing)

## Pricing

- **Starter**: $99/mo — up to 100 claims
- **Professional**: $499/mo — up to 1,000 claims  
- **Enterprise**: Custom — unlimited, dedicated payer connections

## License

MIT — © 2026 AgentPay Labs
