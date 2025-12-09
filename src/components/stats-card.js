export function StatsCard({ label, value, trend, color = "blue" }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <span className="text-sm text-zinc-400">{trend}</span>
        )}
      </div>
    </div>
  );
}
