# Twitter Veri Dosyaları ve Analizler

Kullanılan dosyalar ve her birinden üretilen analizler:

| Dosya                         | Analiz Çıktıları                                                                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tweets.js`                   | Zaman serisi (aylık), kaynak dağılımı (Android/Web), tweet türleri (orijinal/yanıt/RT), top hashtag/mention, en popüler tweetler, engagement stats |
| `like.js`                     | Toplam beğeni sayısı, son beğenilen tweetler listesi                                                                                               |
| `follower.js`, `following.js` | Takipçi/takip edilen sayıları, karşılıklı takip, geri takip etmeyenler                                                                             |
| `personalization.js`          | İlgi alanları kategoriye göre gruplandırılmış (Spor, Teknoloji, Eğlence vb.), cinsiyet, dil                                                        |
| `account.js`                  | Kullanıcı adı, hesap yaşı (yıl/ay olarak)                                                                                                          |
| `block.js`                    | Engellenen hesap sayısı                                                                                                                            |
| `ip-audit.js`                 | Saate göre giriş dağılımı (heatmap), top IP adresleri, toplam giriş sayısı, farklı IP sayısı                                                       |
| `screen-name-change.js`       | Kullanıcı adı değişiklik geçmişi (tarih, eski → yeni)                                                                                              |
| `mute.js`                     | Sessize alınan hesap sayısı                                                                                                                        |
| `direct-messages.js`          | Toplam konuşma, toplam mesaj, ortalama mesaj/konuşma                                                                                               |

## 📋 Gelecekte Eklenebilecekler

| Dosya                                    | Potansiyel Analiz                            |
| ---------------------------------------- | -------------------------------------------- |
| `direct-messages-group.js`               | Grup DM istatistikleri, grup boyutu dağılımı |
| `device-token.js`, `ni-devices.js`       | Kullanılan cihaz/platform türleri            |
| `account-timezone.js`                    | Zaman dilimi değişiklik geçmişi              |
| `spaces-metadata.js`                     | Spaces oturum bilgileri                      |
| `community-tweet.js`                     | Topluluk tweet'leri analizi                  |
| `saved-search.js`                        | Kayıtlı arama başlıkları                     |
| `deleted-tweets.js`                      | Silinen tweet istatistikleri                 |
| `lists-created.js`, `lists-member.js`    | Liste kullanım özeti                         |
| `ad-engagements.js`, `ad-impressions.js` | Reklam etkileşim analizi                     |
| `grok-chat-item.js`                      | Grok sohbet geçmişi                          |

## Analiz Sayfası Bölümleri

1. **Genel Bakış** - 9 stat card (tweet, beğeni, takipçi, takip, karşılıklı, geri takip etmiyor, ilgi alanı, engellenen, kaynak)
2. **Tweet Zaman Çizelgesi** - Son 24 ay area chart
3. **Kaynak & Tweet Türleri** - Pie chart + bar chart
4. **Top Hashtag/Mention** - Tag cloud
5. **İlgi Alanları** - Kategorize edilmiş listeler
6. **En Popüler Tweetler** - Engagement'a göre sıralı
7. **Son Beğenilenler** - Son beğenilen tweet listesi
8. **Takipçi Analizi** - Geri takip etmiyor + karşılıklı listeler
9. **Etkileşim İstatistikleri** - Toplam/ortalama beğeni/RT
10. **Giriş Aktivitesi** - Saatlik heatmap + top IP'ler
11. **Kullanıcı Adı Geçmişi** - Değişiklik timeline'ı
12. **DM İstatistikleri** - Konuşma/mesaj sayıları
