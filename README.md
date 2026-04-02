# saas-nextjs-stripe

Next.js 14 SaaS with deep Stripe integration: subscription management, checkout sessions, customer portal, webhook handling (5 events), 3-tier pricing, Prisma for subscription persistence, invoice retrieval, and subscription lifecycle management (upgrade, cancel, resume).

## Stack

- **Framework:** Next.js 14 App Router, TypeScript
- **Database:** Prisma (PostgreSQL)
- **Billing:** Stripe (Checkout, Portal, Webhooks, Invoices)
- **Auth:** NextAuth.js ready

## Stripe Integration

### Checkout Flow
1. User selects plan on billing page
2. POST `/api/billing/checkout` creates Stripe Checkout session with 14-day trial
3. User completes payment on Stripe-hosted page
4. `checkout.session.completed` webhook creates/updates Subscription in database

### Webhook Events Handled
| Event | Action |
|---|---|
| `checkout.session.completed` | Create subscription record, set plan |
| `customer.subscription.updated` | Sync plan, status, period end, cancel flag |
| `customer.subscription.deleted` | Downgrade to free, mark cancelled |
| `invoice.payment_succeeded` | Update period end, confirm active status |
| `invoice.payment_failed` | Mark subscription as past_due |

### Subscription Management
- `createCheckoutSession` — New subscription with trial
- `createPortalSession` — Self-service billing portal
- `cancelSubscription` — Cancel at period end
- `resumeSubscription` — Undo pending cancellation
- `getUpcomingInvoice` — Preview next charge
- `getInvoices` — Invoice history

## Pricing

| Plan | Price | Features |
|---|---|---|
| Free | $0/mo | 1 project, 100 API calls/day, Community support |
| Pro | $19/mo | 10 projects, 10K API calls/day, Priority support, Custom domain, Analytics |
| Business | $49/mo | Unlimited projects, 100K API calls/day, Dedicated support, SSO, Audit logs, SLA |

## Database Schema (Prisma)

```
User → id, name, email, accounts, sessions, subscription
Account → OAuth provider accounts (NextAuth)
Session → Auth sessions
Subscription → stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd, status, plan, cancelAtPeriodEnd
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/billing/checkout` | Create Stripe Checkout session |
| POST | `/api/billing/portal` | Create Stripe Customer Portal session |
| POST | `/api/webhooks/stripe` | Handle Stripe webhook events |

## Setup

```bash
git clone https://github.com/Shaisolaris/saas-nextjs-stripe.git
cd saas-nextjs-stripe
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## License

MIT
