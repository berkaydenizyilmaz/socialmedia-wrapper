export function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 transition-colors hover:bg-zinc-900">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
