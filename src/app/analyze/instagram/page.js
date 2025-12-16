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
  Moon,
  Sun,
  Calendar,
  Search,
  UserMinus,
  Mail,
  Send,
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

  const { likes, followers, comments, topics, savedPosts, activityPatterns, storyLikes, closeFriends, unfollowed, searches, directMessages } = instagramData;
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

          {/* Activity Patterns - Night Owl vs Early Bird */}
          {activityPatterns && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {activityPatterns.dominant.emoji === "🦉" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                Aktivite Profilin
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Main Result Card */}
                <div className="rounded-2xl border border-border/50 bg-linear-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm p-6">
                  <div className="text-center">
                    <span className="text-6xl">{activityPatterns.dominant.emoji}</span>
                    <h3 className="text-2xl font-bold mt-4">
                      Sen bir {activityPatterns.dominant.type}sun!
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Etkileşimlerinin <span className="text-primary font-semibold">%{activityPatterns.dominant.percentage}</span>&apos;i {activityPatterns.dominant.type.toLowerCase()} saatlerinde
                    </p>
                  </div>
                </div>

                {/* Period Distribution */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Zaman Dağılımı
                  </h3>
                  <div className="space-y-3">
                    {activityPatterns.periods.map((period) => (
                      <div key={period.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{period.emoji} {period.name} ({period.range})</span>
                          <span className="text-muted-foreground">%{period.percentage}</span>
                        </div>
                        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                            style={{ width: `${period.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-sm">
                    <span>Hafta içi: %{activityPatterns.weekdayVsWeekend.weekday}</span>
                    <span>Hafta sonu: %{activityPatterns.weekdayVsWeekend.weekend}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

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

          {/* Story Likes */}
          {storyLikes?.topAccounts && storyLikes.topAccounts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Hikaye Beğenileri ({storyLikes.total})
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4">
                  En Çok Hikayesini Beğendiğin Hesaplar
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {storyLikes.topAccounts.slice(0, 12).map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 rounded bg-muted/30"
                    >
                      <a
                        href={`https://instagram.com/${item.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        @{item.username}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {item.count} ❤️
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Close Friends */}
          {closeFriends?.friends && closeFriends.friends.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💚 Yakın Arkadaşların ({closeFriends.total})
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex flex-wrap gap-2">
                  {closeFriends.friends.map((friend, i) => (
                    <a
                      key={i}
                      href={friend.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm hover:bg-green-500/20 transition-colors"
                    >
                      @{friend.username}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recently Unfollowed */}
          {unfollowed?.profiles && unfollowed.profiles.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserMinus className="h-5 w-5" />
                Son Takip Bıraktıkların ({unfollowed.total})
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="space-y-2">
                  {unfollowed.profiles.map((profile, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 rounded bg-muted/30"
                    >
                      <a
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                      >
                        @{profile.username}
                      </a>
                      {profile.unfollowedAt && (
                        <span className="text-xs text-muted-foreground">
                          {profile.unfollowedAt.toLocaleDateString("tr-TR")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Search History */}
          {searches && (searches.topSearches?.length > 0 || searches.topWords?.length > 0) && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5" />
                Arama Geçmişin
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {searches.topSearches?.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                    <h3 className="text-md font-semibold mb-4">En Çok Aranan 5 Arama</h3>
                    <div className="space-y-2">
                      {searches.topSearches.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-2 rounded bg-muted/30"
                        >
                          <span className="text-sm">{item.query}</span>
                          <span className="text-xs text-muted-foreground">{item.count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {searches.topWords?.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                    <h3 className="text-md font-semibold mb-4">En Çok Geçen 5 Kelime</h3>
                    <div className="flex flex-wrap gap-2">
                      {searches.topWords.map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                        >
                          {item.word} ({item.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Direct Messages */}
          {directMessages && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Direkt Mesajlar
              </h2>
              <div className="grid gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold">{directMessages.totals.conversations}</p>
                  <p className="text-xs text-muted-foreground">Sohbet</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold">{directMessages.totals.totalMessages.toLocaleString("tr-TR")}</p>
                  <p className="text-xs text-muted-foreground">Toplam Mesaj</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{directMessages.totals.totalSentText.toLocaleString("tr-TR")}</p>
                  <p className="text-xs text-muted-foreground">Gönderilen (Metin)</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{directMessages.totals.totalReceivedText.toLocaleString("tr-TR")}</p>
                  <p className="text-xs text-muted-foreground">Alınan (Metin)</p>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Top by text sent */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                    <Send className="h-4 w-4 text-green-400" />
                    En Çok Yazdığın Kişiler
                  </h3>
                  <div className="space-y-2">
                    {directMessages.topBySentText.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="text-sm">{c.partner}</span>
                        <span className="text-xs text-muted-foreground">{c.sent.text} mesaj</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Top by text received */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    Sana En Çok Yazan Kişiler
                  </h3>
                  <div className="space-y-2">
                    {directMessages.topByReceivedText.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="text-sm">{c.partner}</span>
                        <span className="text-xs text-muted-foreground">{c.received.text} mesaj</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Top by shares received */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                    🎬 Sana En Çok Reel/İçerik Atan
                  </h3>
                  <div className="space-y-2">
                    {directMessages.topByReceivedShares.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="text-sm">{c.partner}</span>
                        <span className="text-xs text-muted-foreground">{c.received.shares} paylaşım</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Top by shares sent */}
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                    📤 En Çok Reel/İçerik Attığın
                  </h3>
                  <div className="space-y-2">
                    {directMessages.topBySentShares.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="text-sm">{c.partner}</span>
                        <span className="text-xs text-muted-foreground">{c.sent.shares} paylaşım</span>
                      </div>
                    ))}
                  </div>
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
