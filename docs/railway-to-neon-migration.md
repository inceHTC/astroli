# Railway PostgreSQL → Neon Taşıma Rehberi

Railway’i geçici ödeyerek açıp eski veritabanını Neon’a taşıyacaksınız.

---

## 1. Railway’i tekrar açın

- [Railway Dashboard](https://railway.app/dashboard) → Projenizi bulun
- Ödeme bilgisi ekleyip projeyi / PostgreSQL servisini tekrar **aktif** edin
- Proje → PostgreSQL servisi → **Variables** veya **Connect** kısmından `DATABASE_URL` değerini kopyalayın (veya connection bilgilerini not alın)

Örnek format:
```
postgresql://postgres:SIFRE@containers-us-west-xxx.railway.app:5432/railway
```

---

## 2. Neon’da yeni veritabanı oluşturun

1. [neon.tech](https://neon.tech) → Sign up / Login
2. **New Project** → Proje adı (örn. `astroli`) → Region seçin (örn. Europe)
3. Oluşan projede **Connection string** gösterilir. **URI** formatını kopyalayın:
   ```
   postgresql://kullanici:sifre@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Bu adresi saklayın; `.env` dosyasında kullanacaksınız.

---

## 3. Bilgisayarınızda PostgreSQL istemcisi

Dump almak ve yüklemek için `psql` ve `pg_dump` gerekir.

- **Windows:** [PostgreSQL indir](https://www.postgresql.org/download/windows/) (Installer ile “Command Line Tools” seçin)  
  veya **WSL** içinde: `sudo apt install postgresql-client`
- **Mac:** `brew install libpq` sonra `brew link --force libpq` (veya `psql` zaten kurulu olabilir)

Kontrol: Terminalde `pg_dump --version` yazın, sürüm görünmeli.

---

## 4. Railway’den tam yedek (dump) alın

Terminalde (şifrede özel karakter varsa tırnak içinde kullanın):

```bash
# RAILWAY_DATABASE_URL = Railway’den kopyaladığınız connection string
pg_dump "RAILWAY_DATABASE_URL" --no-owner --no-acl -F p -f railway_backup.sql
```

- `-F p` = plain SQL dosyası (okunabilir)
- `--no-owner --no-acl` = Neon’da farklı kullanıcı olduğu için sahip/izin hatalarını azaltır

Dosya: `railway_backup.sql` (proje klasöründe veya komutu çalıştırdığınız yerde)

---

## 5. Neon’a şemayı Prisma ile kurun (önerilen)

Neon’da tabloları Prisma migration’larınızla oluşturmak en temiz yöntem:

1. Proje kökünde `.env` dosyasını açın.
2. `DATABASE_URL` satırını **geçici olarak** Neon connection string ile değiştirin:
   ```env
   DATABASE_URL="postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
3. Migration’ları Neon’a uygulayın:
   ```bash
   npx prisma migrate deploy
   ```
4. Böylece Neon’da tablolar boş ama şema hazır olur.

---

## 6. Sadece veriyi taşıyın (data-only dump)

Şimdi Railway’den **sadece veri** dump’ı alıp Neon’a yükleyeceğiz:

```bash
# Sadece veri, INSERT formatında (Railway URL’inizi yazın)
pg_dump "RAILWAY_DATABASE_URL" --data-only --no-owner --no-acl -F p -f railway_data_only.sql
```

Sonra Neon’a bağlanıp bu SQL’i çalıştırın:

```bash
# NEON_DATABASE_URL = Neon’dan aldığınız connection string
psql "NEON_DATABASE_URL" -f railway_data_only.sql
```

**Not:** Bazı tablolarda foreign key sırası uyarı verebilir. Genelde `prisma migrate deploy` ile oluşan sıra doğruysa sorun olmaz. Hata alırsanız `railway_data_only.sql` içinde INSERT sırasını değiştirmek gerekebilir; gerekirse söyleyin, sıra önerisi yazarım.

---

## Alternatif: Tek komutla tam kopya (schema + data)

Neon’da önce hiç migration çalıştırmadan, doğrudan Railway dump’ını yüklemek isterseniz:

1. Neon’da **boş** bir proje oluşturun (yeni oluşturduğunuz zaten boş).
2. Railway’den **tam** dump:
   ```bash
   pg_dump "RAILWAY_DATABASE_URL" --no-owner --no-acl -F p -f railway_full.sql
   ```
3. Neon’a yükle:
   ```bash
   psql "NEON_DATABASE_URL" -f railway_full.sql
   ```
4. Projede `.env` içinde `DATABASE_URL`’i Neon connection string yapın.
5. `npx prisma generate` çalıştırın (Prisma client güncellenir).

Bu yöntemde Prisma migration geçmişi Neon’da olmaz; ileride migration kullanacaksanız 5. ve 6. adımları (önce migrate, sonra data-only) kullanmak daha iyi.

---

## 7. Uygulamayı Neon’a bağlayın

1. `.env` dosyasında **kalıcı** olarak:
   ```env
   DATABASE_URL="postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
2. Test:
   ```bash
   npx prisma db pull
   ```
   (İsteğe bağlı; şemayı kontrol eder.)
3. Uygulamayı çalıştırın:
   ```bash
   npm run dev
   ```
4. Admin panelden bir makale / burç yorumuna bakarak verilerin geldiğini doğrulayın.

---

## 8. Railway’i kapatın

- Veriler Neon’da çalışıyor ve yedek dosyalarınız (`railway_backup.sql` / `railway_data_only.sql`) duruyorsa
- Railway’de ödeme bilgisini kaldırıp veya projeyi durdurup denemeyi sonlandırabilirsiniz.

---

## Özet komutlar (kendi URL’lerinizi yazın)

```bash
# 1) Neon’da migration ile şema
DATABASE_URL="NEON_URL" npx prisma migrate deploy

# 2) Railway’den sadece veri
pg_dump "RAILWAY_URL" --data-only --no-owner --no-acl -F p -f railway_data_only.sql

# 3) Veriyi Neon’a yükle
psql "NEON_URL" -f railway_data_only.sql

# 4) .env = NEON_URL, sonra
npm run dev
```

Sorun olursa (ör. “relation does not exist”, FK hatası) aldığınız hata mesajını paylaşırsanız adım adım çözebiliriz.
