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
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { StatCard } from "@/components/analyze/stat-card";
import { Button } from "@/components/ui/button";
import { Background } from "@/components/background";

export default function TwitterAnalyzePage() {
  const router = useRouter();
  const { twitterData, twitterSummary, hasTwitterData } = useData();

  // Redirect if no data
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

  const { likes, followers } = twitterData;
  const summary = twitterSummary;

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
                  <h1 className="text-2xl font-bold">Twitter / X Analizi</h1>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                gradient="from-blue-400 to-blue-600"
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

          {/* Recent Likes */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Son Beğenilen Tweetler</h2>
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
              {likes?.recentLikes && likes.recentLikes.length > 0 ? (
                <div className="space-y-4">
                  {likes.recentLikes.slice(0, 10).map((like, index) => (
                    <div
                      key={like.tweetId || index}
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
              ) : (
                <p className="text-sm text-muted-foreground">Beğenilen tweet bulunamadı</p>
              )}
            </div>
          </section>

          {/* Follower Lists */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Takipçi Analizi</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Not Following Back */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Seni Takip Etmeyenler</h3>
                  <span className="text-sm text-muted-foreground">
                    {followers?.notFollowingBack?.length || 0} hesap
                  </span>
                </div>
                {followers?.notFollowingBack && followers.notFollowingBack.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {followers.notFollowingBack.slice(0, 20).map((account, index) => (
                      <a
                        key={account.accountId}
                        href={account.userLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium text-sm">ID: {account.accountId}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Herkes seni takip ediyor! 🎉</p>
                )}
              </div>

              {/* Mutuals */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Karşılıklı Takipler</h3>
                  <span className="text-sm text-muted-foreground">
                    {followers?.mutuals?.length || 0} hesap
                  </span>
                </div>
                {followers?.mutuals && followers.mutuals.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {followers.mutuals.slice(0, 20).map((account, index) => (
                      <a
                        key={account.accountId}
                        href={account.userLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium text-sm">ID: {account.accountId}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Karşılıklı takip bulunamadı</p>
                )}
              </div>
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
