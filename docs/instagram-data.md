# Instagram Veri Dosyaları ve Analizler

Kullanılan dosyalar ve her birinden üretilen analizler:

## ✅ İmplemente Edilenler

| Dosya                                                                           | Analiz Çıktıları                                           |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `your_instagram_activity/likes/liked_posts.json`                                | Toplam beğeni, zaman serisi, en çok beğenilen hesaplar     |
| `your_instagram_activity/likes/liked_comments.json`                             | Beğenilen yorum sayısı                                     |
| `your_instagram_activity/comments/post_comments_1.json`                         | Yorum sayısı, zaman serisi, en çok yorum yapılan hesaplar  |
| `your_instagram_activity/comments/reels_comments.json`                          | Reels yorum sayısı                                         |
| `connections/followers_and_following/followers_1.json`                          | Takipçi listesi                                            |
| `connections/followers_and_following/following.json`                            | Takip edilenler, karşılıklı takip, geri takip etmeyenler   |
| `preferences/your_topics/recommended_topics.json`                               | 60+ ilgi alanı konusu, kategorize edilmiş                  |
| `your_instagram_activity/saved/saved_posts.json`                                | Kaydedilen içerik sayısı, top hesaplar, reel/post dağılımı |
| `security_and_login_information/login_and_profile_creation/login_activity.json` | Giriş sayısı, saatlik heatmap, cihaz dağılımı, top IP'ler  |

## 📋 Gelecekte Eklenebilecekler

| Dosya                                                         | Potansiyel Analiz               |
| ------------------------------------------------------------- | ------------------------------- |
| `your_instagram_activity/story_interactions/story_likes.json` | Hikaye beğenileri, top hesaplar |
| `your_instagram_activity/story_interactions/polls.json`       | Anket katılımları               |
| `your_instagram_activity/messages/**`                         | DM istatistikleri               |
| `logged_information/recent_searches/`                         | Arama geçmişi                   |
| `ads_information/`                                            | Reklam etkileşimleri            |

## Analiz Sayfası Bölümleri

1. **Genel Bakış** - 9 stat card
2. **Aktivite Zaman Çizelgesi** - Beğeni/yorum grafiği
3. **İlgi Alanları** - Kategorize edilmiş konular
4. **Kayıtlı İçerikler** - Top hesaplar + reel/post pie chart
5. **Giriş Aktivitesi** - Saatlik heatmap + cihaz dağılımı
6. **Hesap Analizleri** - Top beğenilen/yorum yapılan hesaplar
7. **Takipçi Detayları** - Karşılıklı/tek taraflı takipler
