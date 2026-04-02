import Link from "next/link";
export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: 48 }}>SaaS Platform</h1>
      <p style={{ fontSize: 20, color: "#666", margin: "16px 0 32px" }}>Next.js 14 + Stripe + Prisma. Subscriptions, billing portal, webhooks.</p>
      <Link href="/dashboard/billing" style={{ padding: "12px 32px", background: "#000", color: "#fff", borderRadius: 8, textDecoration: "none" }}>View Pricing</Link>
    </main>
  );
}
