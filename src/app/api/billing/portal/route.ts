import { NextRequest, NextResponse } from "next/server";
import { createPortalSession } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { customerId } = await req.json();
  if (!customerId) return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  try {
    const session = await createPortalSession(customerId, `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Portal failed" }, { status: 500 });
  }
}
