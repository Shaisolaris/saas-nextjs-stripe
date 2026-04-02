import { NextRequest, NextResponse } from "next/server";
import { stripe, getPlanFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription) break;
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id ?? "";
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: session.customer as string, stripeSubscriptionId: subscription.id, stripePriceId: priceId, stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), status: subscription.status, plan: getPlanFromPriceId(priceId) },
        update: { stripeSubscriptionId: subscription.id, stripePriceId: priceId, stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), status: subscription.status, plan: getPlanFromPriceId(priceId) },
      });
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id ?? "";
      await prisma.subscription.updateMany({ where: { stripeSubscriptionId: sub.id }, data: { stripePriceId: priceId, stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000), status: sub.status, plan: getPlanFromPriceId(priceId), cancelAtPeriodEnd: sub.cancel_at_period_end } });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({ where: { stripeSubscriptionId: sub.id }, data: { status: "cancelled", plan: "free" } });
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      if (inv.subscription) await prisma.subscription.updateMany({ where: { stripeSubscriptionId: inv.subscription as string }, data: { status: "past_due" } });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
