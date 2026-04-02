import { PLANS } from "@/lib/stripe";

export default function BillingPage() {
  const plans = Object.entries(PLANS);
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <h1>Billing & Plans</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 24 }}>
        {plans.map(([id, plan]) => (
          <div key={id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 24, background: id === "pro" ? "#f8f9ff" : "#fff" }}>
            {id === "pro" && <div style={{ background: "#4f46e5", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, display: "inline-block", marginBottom: 12 }}>Popular</div>}
            <h2 style={{ margin: 0 }}>{plan.name}</h2>
            <div style={{ fontSize: 36, fontWeight: 700, margin: "12px 0" }}>${plan.price}<span style={{ fontSize: 16, fontWeight: 400, color: "#666" }}>/mo</span></div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {plan.features.map((f: string) => <li key={f} style={{ padding: "6px 0", color: "#374151" }}>✓ {f}</li>)}
            </ul>
            <button style={{ width: "100%", padding: 12, marginTop: 16, background: id === "pro" ? "#4f46e5" : "#f3f4f6", color: id === "pro" ? "#fff" : "#000", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              {plan.price === 0 ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
