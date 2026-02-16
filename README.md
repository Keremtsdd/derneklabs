# Orhanpaşa Belediyesi Statik Site Yönetim Paneli (TR)

Bu proje, mevcut statik sitenin (`index.html`) içeriklerini yönetebilmek için basit bir Express tabanlı API ve Bootstrap tabanlı bir yönetim paneli (`/admin`) ekler. Aşağıda kurulum, çalışma ve entegrasyon adımları yer alır.

## Klasör Yapısı

- `server/` : Express API (JWT, basit dosya tabanlı kayıt).
- `server/data/db.json` : İçeriklerin tutulduğu JSON dosyası (otomatik oluşur).
- `server/env.example` : Ortam değişkeni örneği (kopyalayıp `.env` yapın).
- `admin/` : Yönetim paneli (Bootstrap + vanilla JS).
- `uploads/` : Medya yüklemeleri (sunucu çalışınca oluşur).

## Gerekli Ortam

- Node.js 18+ (Windows için **cmd** üzerinde çalıştırın; kullanıcı tercihi).

## Kurulum

1. `server/env.example` dosyasını kopyalayın, `.env` ismiyle `server/` içine koyun ve değerleri düzenleyin:
   - `PORT=4000`
   - `JWT_SECRET=...` (güçlü anahtar seçin)
   - `ADMIN_EMAIL` ve `ADMIN_PASSWORD` ilk admin için kullanılır (sunucu ilk açıldığında hash’lenip db’ye kaydedilir).
   - `CORS_ORIGIN` liste halinde izin verilen origin’ler.
   - `UPLOAD_DIR` varsayılan `../uploads`
   - `DATA_FILE` varsayılan `./data/db.json`

2. Bağımlılıkları yükleyin:
   ```cmd
   cd server
   npm install
   ```

3. Sunucuyu başlatın:
   ```cmd
   npm start
   ```
   veya geliştirme için otomatik yeniden başlatma:
   ```cmd
   npm run dev
   ```

4. Yönetim paneline tarayıcıdan gidin:
   - `http://localhost:4000/admin`
   - Giriş: `.env` içindeki `ADMIN_EMAIL` ve `ADMIN_PASSWORD`

## API Özet

- Kimlik doğrulama:
  - `POST /auth/login` (email, password) → `token`
  - `GET /auth/me`
- İçerik koleksiyonları (JWT gerekli):
  - `news`, `events`, `announcements`, `notices`, `documents`, `projects`, `banners`, `fast_links`, `videos`
  - Örnek: `GET /api/news`, `POST /api/news`, `PUT /api/news/:id`, `DELETE /api/news/:id`
- Ayarlar:
  - `GET /api/settings`
  - `PUT /api/settings`
- Medya yükleme:
  - `POST /api/media` (multipart, alan adı `file`) → `url`
- Public (JWT’siz, sadece okuma):
  - `GET /public/{collection}` (published != false olanlar)
  - `GET /public/settings`
- Statik servis:
  - `GET /uploads/...` yüklenen dosyalar
  - `GET /admin` yönetim arayüzü (server klasörüyle aynı düzeyde)

## Yönetim Paneli Özeti

- Sekmeler: Slider, Haberler, Etkinlikler, Duyurular, İlanlar, Belgeler, Projeler, Hızlı İşlemler, Videolar, Ayarlar.
- Her sekmede basit form + listeleme + silme butonu.
- Ayarlar sekmesinde: İletişim, Sosyal, Analitik alanları ve medya yükleme.
- Yükleme sonucu `uploads/` altında URL üretir; formlarda görsel URL olarak kullanabilirsiniz.

## Statik Site ile Entegrasyon (Sonraki Adımlar)

Bu commit yalnızca yönetim paneli + API katmanını ekler. Mevcut `index.html` hâlen statik içerik içerir. Dinamikleştirmek için önerilen adımlar:

1) Artık `index.html` sonunda eklediğimiz `js/cms-data.js`, `window.CMS_API_BASE` adresinden (`default: http://localhost:4000`) public API’yi çekip slider/haber/etkinlik/duyuru/ilan/belge/proje/hızlı işlemler/video bloklarını dinamik doldurur; veri yoksa mevcut statik içerik korunur.  
2) API adresini değiştirmek için `index.html`’deki `window.CMS_API_BASE` değerini güncelleyin.  
3) Alternatif: Node tarafında küçük bir render betiği ile `db.json` içeriğini kullanarak yeni bir `dist/index.html` üretin (EJS/Handlebars/Nunjucks).  
4) Önbellek/perf için Cloudflare/NGINX önbelleği veya build-time statik üretim tavsiye edilir.

## Güvenlik Notları

- `.env` dosyasını repo dışında tutun; yalnızca `.env` üzerinden gizli değerler verin.
- `JWT_SECRET` güçlü olmalı, token süresi 8 saat.
- Upload doğrulamasını ihtiyaç halinde MIME/size kontrolü ile genişletin.
- CORS whitelist’i dar tutun (panel domaini).

## Bilinen Eksikler / Yapılacaklar

- Frontend entegrasyonu (statik sayfanın API’den beslenmesi).
- Gelişmiş doğrulama ve rol yönetimi (editör/izleyici).
- Listeleme arama/sıralama ve güncelleme formu (şu an yalnızca ekle + sil).
- Belge/ilan tipleri için kategorilendirme.

## Hızlı Komutlar (cmd)

```cmd
cd server
npm install
npm start
```

## İletişim

- Bu panel, Orhanpaşa Belediyesi statik sitesinin içerik yönetimi için tasarlandı. Sorular için projeyi geliştiren ekibe ulaşabilirsiniz.
