---
trigger: always_on
---

# 3. Clean Code & "Anti-Gravity" Rules
- KISS & DRY: En basit çözümü üret. Kodu tekrar etme.
- Separation of Concerns (SRP): Bir fonksiyon veya dosya sadece tek bir amaca hizmet etmelidir.
- Maksimum Dosya Boyutu: Bir dosya 200-250 satırı aşıyorsa, onu daha küçük ve yönetilebilir modüllere bölmeyi veya refactor etmeyi teklif et.
- Strict Typing (Sıkı Tipler): TypeScript'te `any` kullanımı KESİNLİKLE YASAKTIR. Her verinin, API yanıtının ve veritabanı sorgusunun bir `interface` veya `type` karşılığı olmalıdır.

# 4. Backend (Node.js) & Repository Pattern
- Layered Architecture: `Router` (Rota tanımı) -> `Controller` (İstek/Yanıt yönetimi) -> `Service` (İş mantığı) -> `Repository` (Veritabanı işlemleri) katmanlarına kesinlikle uyulacaktır. Controller içinde SQL yazılmaz, Service içinde HTTP status code döndürülmez.
- Error Handling: Controller'larda tüm asenkron işlemler `try-catch` bloğuna alınmalı ve hatalar merkezi bir hata yakalama (error handling) middleware'ine iletilmelidir. İstemciye her zaman standart bir hata objesi (örn: `{ success: false, message: "...", error_code: "..." }`) dönülmelidir.

# 5. Database (Raw MySQL via mysql2/promise)
- No ORM: Prisma veya Sequelize kullanılmayacaktır. Ham SQL yazılacaktır.
- Connection Pool: Her zaman bağlantı havuzu (`pool.query`) kullanılmalıdır.
- Security (SQL Injection Önlemi): Sorgularda asla string birleştirme (interpolation) yapılamaz. Değişkenler her zaman `?` işareti ile parametre olarak gönderilmelidir (örn: `SELECT * FROM users WHERE id = ?`, `[id]`).
- TypeScript Integration: Veritabanındaki her tablonun karşılığı olan bir TypeScript arayüzü `src/types/` klasöründe tanımlanmalı ve sorgu sonuçları her zaman bu tiplere cast edilmelidir.
- Schema Source of Truth: Veritabanı yapısındaki tüm değişiklikler `database/schema.sql` dosyasında belgelenmelidir.

# 6. Frontend (React / Vite)
- Components: Fonksiyonel bileşenler (Functional Components) ve Hook'lar kullanılacaktır.
- State Management: Sunucu verileri için `TanStack Query` (React Query), form yönetimi ve validasyon için `React Hook Form` + `Zod` kullanılmalıdır.
- Styling: Sadece Tailwind CSS kullanılacaktır.

# 7. Collaboration & Videocoding
- Yorum Satırları: Algoritmanın karmaşık olduğu kısımlara ve Repository/Service katmanlarındaki önemli iş kurallarına (business logic), takım arkadaşının kodu okuduğunda hemen anlayabileceği açıklayıcı yorum satırları (JSDoc formatında) ekle.
- Plan Before Code: Herhangi bir dosyada kod yazmaya veya değiştirmeye başlamadan önce, yapacağın adımları Türkçe ve madde madde açıkla. Onay aldıktan sonra kodlamaya geç.