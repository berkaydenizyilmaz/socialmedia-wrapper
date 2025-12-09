"use client";

import { useMemo, useState } from "react";
import { ProviderCard } from "@/components/provider-card";
import { ProviderModal } from "@/components/provider-modal";
import { AnimatedBackground } from "@/components/animated-background";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Shield, Zap, MessageSquare, BarChart3 } from "lucide-react";

const providers = [
  {
    slug: "twitter",
    name: "Twitter / X",
    icon: "𝕏",
    accent: "from-sky-400 via-blue-500 to-blue-600",
    summary: "Arşivini yükle, tweet ve DM aktivitelerini doğrudan tarayıcı üzerinde analiz et.",
    highlights: ["Etkileşim özetleri", "Kelime/emoji analizi", "DM özetleri"],
    steps: [
      "Twitter/X → Ayarlar ve gizlilik → Hesabınız → Verilerinizi indirin",
      "Zip dosyasını indirip açmadan yükleyin (veya arşiv klasörünü seçin)",
      "Yükleme sonrası İşle ile parse ve özet hazırla",
    ],
    accepted: ".zip,.json,.js",
  },
  {
    slug: "instagram",
    name: "Instagram",
    icon: "📷",
    accent: "from-pink-500 via-rose-500 to-orange-500",
    summary: "Instagram verilerinden beğeni, hikâye ve DM özetlerini çıkar.",
    highlights: ["Beğeni/yorum zaman çizelgesi", "Hikâye etkileşimleri", "DM hacmi"],
    steps: [
      "Instagram → Ayarlar → Hesap merkezi → Bilgilerin ve izinlerin → Bilgileri indirme",
      "JSON formatında indirdiğin paketi zip halinde (veya açılmış klasör) yükle",
      "Yükleme sonrası İşle ile parse ve özet hazırla",
    ],
    accepted: ".zip,.json",
  },
];

const features = [
  {
    icon: Shield,
    title: "Gizliliğin Önce",
    description: "Verileriniz sadece bilgisayarınızda işlenir. Kimseyle paylaşılmaz, hiçbir yere gönderilmez.",
  },
  {
    icon: BarChart3,
    title: "Anlaşılır Grafikler",
    description: "Karmaşık veriler yerine basit grafikler ve özet bilgiler. Hangi gün daha aktifsin, ne zaman paylaşım yapıyorsun?",
  },
  {
    icon: MessageSquare,
    title: "Mesaj Analizi",
    description: "Kimlerle en çok konuşuyorsun? Hangi kelimeleri sık kullanıyorsun? DM'lerini keşfet.",
  },
  {
    icon: Zap,
    title: "Kolay ve Hızlı",
    description: "Dosyayı seç, yükle, analiz et. Karmaşık ayar yok, birkaç saniye içinde sonuçlar hazır.",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [fileName, setFileName] = useState("");

  const provider = useMemo(
    () => providers.find((p) => p.slug === selected),
    [selected]
  );

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50">
      <AnimatedBackground />
      
      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-20 px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <header className="flex flex-col items-center gap-8 text-center">
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              🔒 Verileriniz güvende, hiçbir yere gönderilmez
            </div>
            
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-white">
              Sosyal Medya Geçmişini<br />
              <span className="text-blue-400">Yeniden Keşfet</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-400">
              Instagram ve Twitter'dan indirdiğin verileri bilgisayarında analiz et.<br />
              Hangi gün daha aktifsin? En çok hangi kelimeleri kullanıyorsun? Kimlerle daha çok konuşuyorsun?
            </p>
          </div>

          {/* Simple Stats */}
          <div className="grid w-full gap-4 sm:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="transition-colors hover:bg-zinc-900 hover:border-zinc-700">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">📱</div>
                <div className="text-2xl font-bold text-white mb-1">Instagram</div>
                <div className="text-sm text-zinc-400">Beğeni, yorum, mesaj</div>
              </CardContent>
            </Card>
            <Card className="transition-colors hover:bg-zinc-900 hover:border-zinc-700">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">🐦</div>
                <div className="text-2xl font-bold text-white mb-1">Twitter</div>
                <div className="text-sm text-zinc-400">Tweet, DM, etkileşim</div>
              </CardContent>
            </Card>
            <Card className="transition-colors hover:bg-zinc-900 hover:border-zinc-700">
              <CardContent className="p-5 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-bold text-white mb-1">Hızlı</div>
                <div className="text-sm text-zinc-400">Saniyeler içinde hazır</div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Provider Cards */}
        <section className="space-y-6">
          <div className="text-center space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl font-bold">Hangi Platformu Analiz Etmek İstersin?</h2>
            <p className="text-zinc-400">Instagram veya Twitter verilerini yükle, anında sonuçları gör</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {providers.map((p) => (
              <ProviderCard
                key={p.slug}
                provider={p}
                onSelect={(slug) => {
                  setSelected(slug);
                  setFileName("");
                }}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Neden Kullanmalısın?</h2>
            <p className="text-zinc-400">Sosyal medya geçmişini keşfetmenin en güvenli yolu</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  style={{ animationDelay: `${0.1 * index}s` }}
                  className="animate-slide-up transition-colors hover:bg-zinc-900 hover:border-zinc-700"
                >
                  <CardContent className="pt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-500" />
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Çok Basit</h2>
            <p className="text-zinc-400">3 adımda tamamla</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
                  📥
                </div>
                <h3 className="font-semibold text-lg">Veri İndir</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Instagram ya da Twitter ayarlarından "Verilerimi İndir" seçeneğini kullan. ZIP dosyası sana gelecek.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-2xl">
                  📤
                </div>
                <h3 className="font-semibold text-lg">Dosyayı Yükle</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yukarıdan platformu seç ve indirdiğin ZIP dosyasını yükle. Hepsi bu!
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-2xl">
                  ✨
                </div>
                <h3 className="font-semibold text-lg">Sonuçları İncele</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Birkaç saniye sonra tüm analizler hazır. Grafiklerle geçmişini keşfet.
              </p>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          <p>
            Verileriniz güvende 🔒 · Tamamen ücretsiz
          </p>
        </footer>
      </main>

      <ProviderModal
        provider={provider}
        fileName={fileName}
        onFileSelect={(file) => setFileName(file ? file.name : "")}
        onClose={() => setSelected(null)}
        onProcess={() => {}}
      />
    </div>
  );
}
