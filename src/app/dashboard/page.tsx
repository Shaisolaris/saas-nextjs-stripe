import { isDemoMode, DEMO_STATS, DEMO_PLANS, DEMO_ACTIVITY } from "@/lib/demo-data";

export default function DashboardPage() {
  const stats = DEMO_STATS;
  const activity = DEMO_ACTIVITY;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      {isDemoMode() && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <strong>Demo Mode</strong> — Running with sample data. Connect your database to use real data.
        </div>
      )}
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-6"><p className="text-sm text-gray-500">Users</p><p className="text-3xl font-bold">{stats.users}</p></div>
        <div className="rounded-lg border p-6"><p className="text-sm text-gray-500">Revenue</p><p className="text-3xl font-bold">${stats.revenue.toLocaleString()}</p></div>
        <div className="rounded-lg border p-6"><p className="text-sm text-gray-500">Projects</p><p className="text-3xl font-bold">{stats.projects}</p></div>
        <div className="rounded-lg border p-6"><p className="text-sm text-gray-500">Growth</p><p className="text-3xl font-bold text-green-600">+{stats.growth}%</p></div>
      </div>
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <span><strong>{a.user}</strong> {a.action} <strong>{a.target}</strong></span>
              <span className="text-sm text-gray-500">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
