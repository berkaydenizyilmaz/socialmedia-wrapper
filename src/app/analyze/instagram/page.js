"use client";

import { useEffect, useState } from "react";
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
  Bookmark,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useData } from "@/context/DataContext";
import { StatCard } from "@/components/analyze/stat-card";
import { AccountList } from "@/components/analyze/account-list";
import { TimelineChart } from "@/components/analyze/timeline-chart";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e"];

// Expandable topic card component
function TopicCard({ category, items }) {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, 8);
  const hasMore = items.length > 8;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4">
      <h4 className="font-medium mb-2 text-sm">
        {category} ({items.length})
      </h4>
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground"
          >
            {item}
          </span>
        ))}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Daralt
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> +{items.length - 8} daha
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

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

  const { likes, followers, comments, topics, savedPosts } = instagramData;
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

          {/* Stat Cards - Row 1 */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Genel Bakış</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            </div>
          </section>

          {/* Stat Cards - Row 2 */}
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Karşılıklı"
                value={summary.mutualsCount.toLocaleString("tr-TR")}
                icon={UserCheck}
                gradient="from-green-500 to-emerald-500"
              />
              <StatCard
                title="Geri Takip Etmiyor"
                value={summary.notFollowingBackCount.toLocaleString("tr-TR")}
                icon={UserX}
                gradient="from-orange-500 to-amber-500"
              />
              <StatCard
                title="İlgi Alanı"
                value={(summary.topicsCount || 0).toLocaleString("tr-TR")}
                icon={Sparkles}
                gradient="from-yellow-500 to-orange-500"
              />
              <StatCard
                title="Kayıtlı İçerik"
                value={(summary.savedPostsCount || 0).toLocaleString("tr-TR")}
                icon={Bookmark}
                gradient="from-teal-500 to-cyan-500"
              />
            </div>
          </section>

          {/* Timeline Charts */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Aktivite Zaman Çizelgesi
            </h2>
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

          {/* Topics/Interests */}
          {topics?.categories && Object.keys(topics.categories).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                İlgi Alanların ({topics.total})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(topics.categories).map(([category, items]) => (
                  <TopicCard key={category} category={category} items={items} />
                ))}
              </div>
            </section>
          )}

          {/* Saved Posts */}
          {savedPosts?.topAccounts && savedPosts.topAccounts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Kayıtlı İçerikler
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4">
                  En Çok Kaydettiğin Hesaplar
                </h3>
                <div className="space-y-2">
                  {savedPosts.topAccounts.slice(0, 10).map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 rounded bg-muted/30"
                    >
                      <a
                        href={`https://instagram.com/${item.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        @{item.account}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {item.count} kayıt
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

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
                accounts={
                  followers?.notFollowingBack?.map((f) => ({
                    username: f.username,
                    count: null,
                  })) || []
                }
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
                accounts={
                  followers?.mutuals?.slice(0, 50).map((f) => ({
                    username: f.username,
                    count: null,
                  })) || []
                }
                maxVisible={10}
                showCount={false}
              />
              <AccountList
                title="Seni Takip Edip Takip Etmediğin"
                accounts={
                  followers?.youDontFollow?.slice(0, 50).map((f) => ({
                    username: f.username,
                    count: null,
                  })) || []
                }
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
