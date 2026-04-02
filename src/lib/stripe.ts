import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export const PLANS = {
  free: { name: "Free", price: 0, stripePriceId: null, features: ["1 project", "100 API calls/day", "Community support"] },
  pro: { name: "Pro", price: 19, stripePriceId: "price_pro_monthly", features: ["10 projects", "10K API calls/day", "Priority support", "Custom domain", "Analytics"] },
  business: { name: "Business", price: 49, stripePriceId: "price_business_monthly", features: ["Unlimited projects", "100K API calls/day", "Dedicated support", "SSO", "Audit logs", "SLA"] },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createOrRetrieveCustomer(userId: string, email: string): Promise<string> {
  // In production, check DB first for existing customer ID
  const customer = await stripe.customers.create({ email, metadata: { userId } });
  return customer.id;
}

export async function createCheckoutSession(params: {
  customerId: string; priceId: string; userId: string; successUrl: string; cancelUrl: string;
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: { metadata: { userId: params.userId }, trial_period_days: 14 },
    allow_promotion_codes: true,
  });
}

export async function createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
}

export async function resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false });
}

export async function getUpcomingInvoice(customerId: string) {
  try {
    return await stripe.invoices.retrieveUpcoming({ customer: customerId });
  } catch { return null; }
}

export async function getInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
  const { data } = await stripe.invoices.list({ customer: customerId, limit });
  return data;
}

export function getPlanFromPriceId(priceId: string): PlanId {
  for (const [key, plan] of Object.entries(PLANS)) {
    if ("stripePriceId" in plan && plan.stripePriceId === priceId) return key as PlanId;
  }
  return "free";
}
