"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ArrowLeft,
  Instagram,
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { StatCard } from "@/components/analyze/stat-card";
import { AccountList } from "@/components/analyze/account-list";
import { TimelineChart } from "@/components/analyze/timeline-chart";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

export default function InstagramAnalyzePage() {
  const router = useRouter();
  const { instagramData, instagramSummary, hasData } = useData();

  // Redirect if no data
  useEffect(() => {
    if (!hasData) {
      router.push("/");
    }
  }, [hasData, router]);

  if (!hasData || !instagramData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const { likes, followers, comments } = instagramData;
  const summary = instagramSummary;

  return (
    <>
      <Background />

      <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-500">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Instagram Analizi</h1>
                  <p className="text-sm text-muted-foreground">
                    Verilerinin detaylı analizi
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Stat Cards */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Genel Bakış</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                title="Toplam Beğeni"
                value={summary.totalLikes.toLocaleString("tr-TR")}
                icon={Heart}
                gradient="from-pink-500 to-rose-500"
              />
              <StatCard
                title="Toplam Yorum"
                value={summary.totalComments.toLocaleString("tr-TR")}
                icon={MessageCircle}
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard
                title="Takipçi"
                value={summary.followersCount.toLocaleString("tr-TR")}
                icon={Users}
                gradient="from-purple-500 to-violet-500"
              />
              <StatCard
                title="Takip Edilen"
                value={summary.followingCount.toLocaleString("tr-TR")}
                icon={UserPlus}
                gradient="from-indigo-500 to-blue-500"
              />
              <StatCard
                title="Karşılıklı"
                value={summary.mutualsCount.toLocaleString("tr-TR")}
                icon={UserCheck}
                gradient="from-green-500 to-emerald-500"
              />
              <StatCard
                title="Seni Takip Etmiyor"
                value={summary.notFollowingBackCount.toLocaleString("tr-TR")}
                icon={UserX}
                gradient="from-orange-500 to-amber-500"
              />
            </div>
          </section>

          {/* Timeline Charts */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Aktivite Zaman Çizelgesi</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineChart
                title="Beğeni Aktivitesi"
                data={likes?.timeline || []}
                color="#ec4899"
                gradientId="likeGradient"
              />
              <TimelineChart
                title="Yorum Aktivitesi"
                data={comments?.timeline || []}
                color="#3b82f6"
                gradientId="commentGradient"
              />
            </div>
          </section>

          {/* Account Lists */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Hesap Analizleri</h2>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <AccountList
                title="En Çok Beğendiğin Hesaplar"
                accounts={likes?.topAccounts || []}
                maxVisible={10}
              />
              <AccountList
                title="En Çok Yorum Yaptığın Hesaplar"
                accounts={comments?.topCommentedAccounts || []}
                maxVisible={10}
              />
              <AccountList
                title="Seni Takip Etmeyenler"
                accounts={followers?.notFollowingBack?.map(f => ({ 
                  username: f.username, 
                  count: null 
                })) || []}
                maxVisible={10}
                showCount={false}
                emptyMessage="Herkes seni takip ediyor! 🎉"
              />
            </div>
          </section>

          {/* Additional Stats */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Takipçi Detayları</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <AccountList
                title="Karşılıklı Takipler"
                accounts={followers?.mutuals?.slice(0, 50).map(f => ({ 
                  username: f.username, 
                  count: null 
                })) || []}
                maxVisible={10}
                showCount={false}
              />
              <AccountList
                title="Seni Takip Edip Takip Etmediğin"
                accounts={followers?.youDontFollow?.slice(0, 50).map(f => ({ 
                  username: f.username, 
                  count: null 
                })) || []}
                maxVisible={10}
                showCount={false}
                emptyMessage="Takipçilerinin hepsini takip ediyorsun"
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Tüm veriler cihazında işlendi. Hiçbir veri sunucuya gönderilmedi.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
