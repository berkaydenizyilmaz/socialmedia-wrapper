"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ArrowLeft,
  ExternalLink,
  Hash,
  AtSign,
  MessageSquare,
  Calendar,
  Activity,
  Smartphone,
  Shield,
  Sparkles,
  TrendingUp,
  Clock,
  Globe,
  Mail,
  History,
  VolumeX,
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
  AreaChart,
  Area,
} from "recharts";
import { useData } from "@/context/DataContext";
import { StatCard } from "@/components/analyze/stat-card";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#22c55e", "#06b6d4"];

export default function TwitterAnalyzePage() {
  const router = useRouter();
  const { twitterData, twitterSummary, hasTwitterData } = useData();

  useEffect(() => {
    if (!hasTwitterData) {
      router.push("/");
    }
  }, [hasTwitterData, router]);

  if (!hasTwitterData || !twitterData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const { tweets, likes, followers, interests, account, blocks, ipAudit, screenNameChanges, directMessages } = twitterData;
  const summary = twitterSummary;

  // Account age text
  const accountAgeText = account?.accountAge
    ? `${account.accountAge.years} yıl ${account.accountAge.months} ay`
    : "Bilinmiyor";

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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-neutral-200 to-neutral-400">
                  <Image
                    src="/twitter.png"
                    alt="Twitter"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {account?.username ? `@${account.username}` : "Twitter / X"} Analizi
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Hesap yaşı: {accountAgeText}
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
                title="Toplam Tweet"
                value={summary.totalTweets.toLocaleString("tr-TR")}
                icon={MessageSquare}
                gradient="from-blue-400 to-blue-600"
              />
              <StatCard
                title="Toplam Beğeni"
                value={summary.totalLikes.toLocaleString("tr-TR")}
                icon={Heart}
                gradient="from-pink-500 to-rose-500"
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <StatCard
                title="Karşılıklı Takip"
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
                value={summary.interestCount.toLocaleString("tr-TR")}
                icon={Sparkles}
                gradient="from-yellow-500 to-orange-500"
              />
              <StatCard
                title="Engellenen"
                value={summary.blockedCount.toLocaleString("tr-TR")}
                icon={Shield}
                gradient="from-red-500 to-rose-600"
              />
              <StatCard
                title="En Çok Kaynak"
                value={summary.topSource}
                icon={Smartphone}
                gradient="from-cyan-500 to-blue-500"
              />
            </div>
          </section>

          {/* Tweet Timeline */}
          {tweets?.tweetTimeline && tweets.tweetTimeline.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tweet Zaman Çizelgesi
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={tweets.tweetTimeline.slice(-24)}>
                    <defs>
                      <linearGradient id="tweetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickFormatter={(val) => val.slice(2)}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#tweetGradient)"
                      name="Tweet"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Source Distribution & Tweet Types */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Source Distribution */}
            {tweets?.sourceDistribution && tweets.sourceDistribution.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Kaynak Dağılımı
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={tweets.sourceDistribution.slice(0, 6)}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percentage }) => `${name.split(' ')[2] || name.slice(0, 10)} (${percentage}%)`}
                    >
                      {tweets.sourceDistribution.slice(0, 6).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Tweet Types */}
            {tweets?.tweetTypes && (
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Tweet Türleri
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { name: "Orijinal", count: tweets.tweetTypes.original },
                      { name: "Yanıt", count: tweets.tweetTypes.replies },
                      { name: "Retweet", count: tweets.tweetTypes.retweets },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#9ca3af", fontSize: 12 }} width={70} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Top Hashtags & Mentions */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Top Hashtags */}
            {tweets?.topHashtags && tweets.topHashtags.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  En Çok Kullanılan Hashtag&apos;ler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tweets.topHashtags.slice(0, 15).map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                    >
                      #{item.tag}
                      <span className="text-xs text-blue-300/70">({item.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Mentions */}
            {tweets?.topMentions && tweets.topMentions.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                  <AtSign className="h-4 w-4" />
                  En Çok Mention Edilen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tweets.topMentions.slice(0, 15).map((item, i) => (
                    <a
                      key={i}
                      href={`https://twitter.com/${item.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm hover:bg-purple-500/20 transition-colors"
                    >
                      @{item.username}
                      <span className="text-xs text-purple-300/70">({item.count})</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Interests */}
          {interests?.categories && Object.keys(interests.categories).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                İlgi Alanların ({interests.totalCount})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(interests.categories).map(([category, items]) => (
                  <div
                    key={category}
                    className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4"
                  >
                    <h4 className="font-medium mb-2 text-sm">{category} ({items.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {items.slice(0, 8).map((item, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                      {items.length > 8 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                          +{items.length - 8} daha
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Top Tweets */}
          {tweets?.topTweets && tweets.topTweets.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                En Popüler Tweetlerin
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="space-y-4">
                  {tweets.topTweets.slice(0, 5).map((tweet, i) => (
                    <div
                      key={tweet.id || i}
                      className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm line-clamp-2 mb-2">{tweet.text}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-pink-500" />
                          {tweet.favoriteCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-green-500" />
                          {tweet.retweetCount} RT
                        </span>
                        {tweet.date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tweet.date}
                          </span>
                        )}
                        <a
                          href={`https://twitter.com/i/status/${tweet.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Görüntüle
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recent Likes */}
          {likes?.recentLikes && likes.recentLikes.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Son Beğenilen Tweetler
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="space-y-4">
                  {likes.recentLikes.slice(0, 8).map((like, i) => (
                    <div
                      key={like.tweetId || i}
                      className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm line-clamp-2">
                        {like.fullText || "Tweet içeriği mevcut değil"}
                      </p>
                      {like.url && (
                        <a
                          href={like.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Tweet&apos;i görüntüle
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Follower Lists */}
          {followers && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Takipçi Analizi
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Not Following Back */}
                {followers.notFollowingBack && followers.notFollowingBack.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                    <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                      <UserX className="h-4 w-4 text-orange-500" />
                      Seni Takip Etmeyenler ({followers.notFollowingBack.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {followers.notFollowingBack.slice(0, 20).map((user, i) => (
                        <a
                          key={i}
                          href={user.userLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Kullanıcı #{user.accountId?.slice(-6)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mutuals */}
                {followers.mutuals && followers.mutuals.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                    <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      Karşılıklı Takip ({followers.mutuals.length})
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {followers.mutuals.slice(0, 20).map((user, i) => (
                        <a
                          key={i}
                          href={user.userLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Kullanıcı #{user.accountId?.slice(-6)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Engagement Stats */}
          {tweets?.engagement && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Etkileşim İstatistikleri
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-pink-500">{tweets.engagement.totalFavorites.toLocaleString("tr-TR")}</p>
                  <p className="text-sm text-muted-foreground">Toplam Beğeni Alınan</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-green-500">{tweets.engagement.totalRetweets.toLocaleString("tr-TR")}</p>
                  <p className="text-sm text-muted-foreground">Toplam Retweet</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-blue-500">{tweets.engagement.avgFavorites}</p>
                  <p className="text-sm text-muted-foreground">Ort. Beğeni/Tweet</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-purple-500">{tweets.engagement.avgRetweets}</p>
                  <p className="text-sm text-muted-foreground">Ort. RT/Tweet</p>
                </div>
              </div>
            </section>
          )}

          {/* Login Activity Heatmap */}
          {ipAudit?.loginsByHour && ipAudit.loginsByHour.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Giriş Aktivitesi
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4">Saate Göre Giriş Dağılımı</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ipAudit.loginsByHour}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        tickFormatter={(val) => `${val}:00`}
                      />
                      <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "none", borderRadius: "8px" }}
                        labelFormatter={(val) => `${val}:00 - ${val}:59`}
                      />
                      <Bar dataKey="count" fill="#22c55e" radius={[2, 2, 0, 0]} name="Giriş" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-md font-semibold mb-4">Top IP Adresleri ({ipAudit.uniqueIps} farklı)</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {ipAudit.topIps?.slice(0, 8).map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 rounded bg-muted/30">
                        <span className="font-mono text-sm">{item.ip}</span>
                        <span className="text-xs text-muted-foreground">{item.count} giriş</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Username History */}
          {screenNameChanges?.history && screenNameChanges.history.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="h-5 w-5" />
                Kullanıcı Adı Geçmişi
              </h2>
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="space-y-4">
                  {screenNameChanges.history.map((change, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">@{change.from}</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                        <span className="text-sm font-medium">@{change.to}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {change.date?.toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* DM Stats */}
          {directMessages && directMessages.totalConversations > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Direkt Mesaj İstatistikleri
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-blue-500">{directMessages.totalConversations}</p>
                  <p className="text-sm text-muted-foreground">Toplam Konuşma</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-green-500">{directMessages.totalMessages}</p>
                  <p className="text-sm text-muted-foreground">Toplam Mesaj</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 text-center">
                  <p className="text-2xl font-bold text-purple-500">
                    {directMessages.totalConversations > 0 
                      ? (directMessages.totalMessages / directMessages.totalConversations).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Ort. Mesaj/Konuşma</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
