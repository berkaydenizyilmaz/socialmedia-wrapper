export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-zinc-900 via-zinc-950 to-black" />
      
      {/* Simple grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
    </div>
  );
}
