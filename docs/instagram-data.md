# Instagram Veri Dosyaları ve Analizler

Kullanılan dosyalar ve her birinden üretilen analizler:

## 📥 Verilerini Nasıl Alırsın?

1. Instagram'da **Ayarlar** > **Hesaplar Merkezi**'ne git
2. **Bilgilerin ve izinlerin** > **Bilgilerini dışa aktar** seçeneğine tıkla
3. **Dışa aktarım oluştur**'a tıkla
4. İlgili profilini seç
5. **Cihaza aktar** seçeneğini seç
6. **Format** kısmından **JSON** formatını seç ⚠️ (HTML değil!)
7. **Dışa aktarımı başlat**'a tıkla
8. Bir süre sonra e-posta ile indirme linki gelecek

> 💡 **İpucu**: "Her zaman" seçeneğini seç, böylece tüm veriler dahil olur.

| Dosya                                                                   | Analiz Çıktıları                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `your_instagram_activity/likes/liked_posts.json`                        | Toplam beğeni, zaman serisi, en çok beğenilen hesaplar                                      |
| `your_instagram_activity/likes/liked_comments.json`                     | Beğenilen yorum sayısı                                                                      |
| `your_instagram_activity/comments/post_comments_1.json`                 | Yorum sayısı, zaman serisi, en çok yorum yapılan hesaplar                                   |
| `your_instagram_activity/comments/reels_comments.json`                  | Reels yorum sayısı                                                                          |
| `connections/followers_and_following/followers_1.json`                  | Takipçi listesi                                                                             |
| `connections/followers_and_following/following.json`                    | Takip edilenler, karşılıklı takip, geri takip etmeyenler                                    |
| `connections/followers_and_following/close_friends.json`                | Yakın arkadaşlar listesi                                                                 |
| `connections/followers_and_following/recently_unfollowed_profiles.json` | Son takip bırakılanlar                                                                      |
| `preferences/your_topics/recommended_topics.json`                       | 60+ ilgi alanı konusu, kategorize edilmiş                                                   |
| `your_instagram_activity/saved/saved_posts.json`                        | Kaydedilen içerik sayısı, top hesaplar                                                      |
| `your_instagram_activity/story_interactions/story_likes.json`           | Hikaye beğenileri, top hesaplar                                                          |
| `logged_information/recent_searches/word_or_phrase_searches.json`       | Arama geçmişi, en çok aranan 5, en çok geçen 5 kelime                                    |
| `your_instagram_activity/messages/inbox/**/message_1.json`              | DM istatistikleri: gönderilen/alınan, metin/paylaşım ayrımı, en çok mesajlaşılan kişiler |

## Analiz Sayfası Bölümleri

1. **Genel Bakış** - 8 stat card (Beğeni, Yorum, Takipçi, Takip, Karşılıklı, Geri Takip Etmiyor, İlgi Alanı, Kayıtlı)
2. **Aktivite Profilin** - 🦉 Gece Kuşu / 🌅 Sabahçı analizi, zaman dağılımı (hafta içi/sonu)
3. **Aktivite Zaman Çizelgesi** - Beğeni/yorum grafiği (son 90 gün)
4. **İlgi Alanları** - Kategorize edilmiş konular (genişletilebilir)
5. **Kayıtlı İçerikler** - Top kaydettiğin hesaplar
6. **Hikaye Beğenileri** - En çok hikayesini beğendiğin hesaplar
7. **Yakın Arkadaşlar** - 💚 Yakın arkadaş listesi
8. **Son Takip Bıraktıkların** - Son unfollow'lar ve tarihleri
9. **Arama Geçmişi** - En çok aranan aramalar + en çok geçen kelimeler
10. **Direkt Mesajlar** - 💬 DM istatistikleri:
    - Toplam sohbet & mesaj sayısı
    - Gönderilen/alınan metin mesaj ayrımı
    - En çok yazdığın kişiler
    - Sana en çok yazan kişiler
    - En çok reel/içerik paylaştığın/aldığın kişiler
11. **Hesap Analizleri** - Top beğenilen/yorum yapılan hesaplar
12. **Takipçi Detayları** - Karşılıklı/tek taraflı takipler
