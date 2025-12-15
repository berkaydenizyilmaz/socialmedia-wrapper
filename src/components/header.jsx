export function Header() {
  return (
    <header className="text-center space-y-4 sm:space-y-6">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm text-primary">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        Tüm veriler cihazında kalır
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
        <span className="block">Sosyal Medya</span>
        <span className="block mt-1 sm:mt-2 bg-linear-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Geçmişini Keşfet
        </span>
      </h1>

      <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
        Instagram ve Twitter verilerini analiz et, istatistiklerini gör.
      </p>
    </header>
  );
}
