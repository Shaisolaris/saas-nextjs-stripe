import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, createOrRetrieveCustomer } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { userId, email, priceId } = await req.json();
  if (!userId || !email || !priceId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    const customerId = await createOrRetrieveCustomer(userId, email);
    const session = await createCheckoutSession({
      customerId, priceId, userId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
