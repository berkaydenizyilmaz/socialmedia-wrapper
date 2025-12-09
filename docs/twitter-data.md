# Twitter veri dosyalari ve cikarmalar

Kullanilacak dosyalar ve her birinden üretilecek analizler:

- `tweets.js` — Zaman serisi (gun/ay/saat bazinda tweet sayisi), kaynak dagilimi (Android/Web vb.), en cok etkileşim alan tweetler, mention/hashtag frekansi, link/medya oranlari, yanitlanmis tweet oranı.
- `like.js` — Begeni zaman serisi, en cok begenilen hesaplar, kendi tweet aktivitesi ile korelasyon.
- `direct-messages.js`, `direct-messages-group.js`, `direct-message-headers.js`, `direct-message-group-headers.js` — DM hacmi zaman serisi, en cok iletisime gecilen kisiler, grup boyutu dagilimi, medya iceren mesaj orani.
- `follower.js`, `following.js` — Takipci/takip edilen sayilari, fark dengesi, takip listesi ozetleri.
- `ip-audit.js` — Giris lokasyon/cihaz dagilimi, saat bazli giris yogunlugu (heatmap), alisilmadik IP/konum sinyalleri.
- `personalization.js` — Infer edilen ilgi alanlari ve kategori dagilimlari.
- `device-token.js`, `ni-devices.js` — Kullanilan cihaz/platform turleri; ip-audit ile eslestirilerek cihaz/lokasyon korelasyonu.
- `screen-name-change.js`, `account.js`, `account-timezone.js`, `profile.js` — Hesap ve profil degisiklik zaman cizelgesi (kullanici adi degisikligi, zaman dilimi, biyografi vs.).
- `spaces-metadata.js` — Spaces oturum sayisi, zamanlari, varsa sure/katilim bilgisi.
- `community-tweet.js` — Topluluk icindeki tweet payi (community vs genel).
- `saved-search.js` — Kayitli arama basliklari; ilgi alanlarini destekleyici sinyal.
- `deleted-tweets.js`, `deleted-tweet-headers.js` — Silme zaman serisi; toplam aktiviteyle karsilastirma.
- `block.js`, `mute.js` — Engellenen/sessize alinan hesap sayilari ve listeleri.
- `lists-created.js`, `lists-member.js`, `lists-subscribed.js` — Olusturulan listeler, uyesi olundugu listeler, takip edilen listeler; liste kullanimi ozetleri.
