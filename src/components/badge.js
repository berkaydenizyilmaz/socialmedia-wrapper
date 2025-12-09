export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    primary: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
