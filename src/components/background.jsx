export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-background" />

      {/* Gradient orbs - responsive sizes */}
      <div className="absolute -top-20 -left-20 sm:top-0 sm:-left-40 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] rounded-full bg-purple-500/20 blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse" />
      <div className="absolute top-1/4 -right-20 sm:top-1/3 sm:-right-40 h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] lg:h-[400px] lg:w-[400px] rounded-full bg-pink-500/20 blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute -bottom-10 left-1/4 sm:-bottom-20 sm:left-1/3 h-[200px] w-[200px] sm:h-[280px] sm:w-[280px] lg:h-[350px] lg:w-[350px] rounded-full bg-orange-500/15 blur-[60px] sm:blur-[80px] lg:blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
}
