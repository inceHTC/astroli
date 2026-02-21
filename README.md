# Astroli 🌌

Modern, mobil öncelikli astroloji kişilik platformu.

## Özellikler

- **Burç Hesaplayıcı** – Güneş, yükselen ve ay burcu
- **Kişilik Testleri** – Element keşif testi (veri tabanlı, ölçeklenebilir)
- **Burç Uyumluluğu** – İki doğum tarihi ile uyum skoru
- **Zodyak Kütüphanesi** – 12 burç için SEO optimize sayfalar
- **Dergi** – Magazin tarzı içerikler
- **Paylaşım Kartları** – 1080x1920 story formatında indirme/paylaşım

## Teknoloji

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **html-to-image** – Share kartı oluşturma

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## Proje Yapısı

```
src/
├── app/              # Next.js App Router sayfaları
│   ├── burc-hesapla/
│   ├── burc/[sign]/  # Burç detay sayfaları
│   ├── burclar/
│   ├── dergi/        # Magazine içerikleri
│   ├── test/[slug]/  # Kişilik testleri
│   ├── testler/
│   └── uyumluluk/
├── components/
│   ├── layout/
│   ├── share/
│   └── ui/
├── data/             # Zodiac, test verileri
└── lib/              # Astroloji hesaplamaları
```

## Sonraki Adımlar (Phase 2)

- [ ] Admin paneli (test/burç/içerik yönetimi)
- [ ] Veritabanı entegrasyonu
- [ ] Kullanıcı hesapları (opsiyonel)
- [ ] Tam doğum haritası (ephemeris)

## Tasarım

- Derin lacivert arka plan (#0a0e1a)
- Violet/fuchsia gradient aksanlar
- Mobil öncelikli, single column
- Premium app hissi
