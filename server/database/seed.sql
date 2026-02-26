-- =============================================
-- Çukurca Bel CMS — Seed Data (db.json'dan aktarım)
-- =============================================

USE cukurca_bel;

-- Admin kullanıcı (şifre: admin123)
INSERT INTO
    users (
        id,
        name,
        email,
        password,
        role
    )
VALUES (
        'd24f3b1e-67d0-42af-bac2-a4e8f747c590',
        'Yönetici',
        'admin@bayrampasa.bel.tr',
        '$2a$10$McyHGqrayhiMgxDBm2PFGe6jhCO34CtGZip8mx23XCZyADRAvm/kK',
        'admin'
    );

-- Haberler
INSERT INTO
    news (
        id,
        title,
        summary,
        date,
        image,
        link,
        published,
        created_at,
        updated_at
    )
VALUES (
        'a132224f-0bc7-4aad-bdb5-eb76c38b8d47',
        'Orhanpaşa Metrosu Açılıyor',
        'Orhanpaşa Metrosu Açılıyor hakkında kısa bilgilendirme.',
        '2026-01-29',
        '/uploads/1769971718207-Gemini_Generated_Image_6ayct6ayct6ayct6.png',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-02-01 18:48:38'
    ),
    (
        '6f02cf4e-1481-4ac5-a0c9-5da739028482',
        'Dijital Belediye Uygulaması Yayında',
        'Dijital Belediye Uygulaması Yayında hakkında kısa bilgilendirme.',
        '2026-01-29',
        '/uploads/1769971739278-Gemini_Generated_Image_vl886svl886svl88.png',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-02-01 18:48:59'
    ),
    (
        '3a12d805-9e2e-45bd-9fd0-5d862cc5e64f',
        'Orhanpaşa Yaz Spor Okulları Başladı',
        'Orhanpaşa Yaz Spor Okulları Başladı hakkında kısa bilgilendirme.',
        '2026-01-29',
        'https://placehold.co/600x400?text=Haber+Gorseli',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    ),
    (
        'e1e1700c-7e6b-4cdc-9079-2abe1184a82f',
        'Akıllı Atık Toplama Sistemi Devrede',
        'Akıllı Atık Toplama Sistemi Devrede hakkında kısa bilgilendirme.',
        '2026-01-29',
        'https://placehold.co/600x400?text=Haber+Gorseli',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    ),
    (
        '87ec2cb5-67ed-4b20-8288-957500d414c4',
        'Kültür ve Sanat Günleri Başlıyor',
        'Kültür ve Sanat Günleri Başlıyor hakkında kısa bilgilendirme.',
        '2026-01-29',
        'https://placehold.co/600x400?text=Haber+Gorseli',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    ),
    (
        'f9169bdf-ab2d-4687-9923-341a90067143',
        'Yeni Nesil Kütüphane Hizmete Girdi',
        'Yeni Nesil Kütüphane Hizmete Girdi hakkında kısa bilgilendirme.',
        '2026-01-29',
        'https://placehold.co/600x400?text=Haber+Gorseli',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    );

-- Etkinlikler
INSERT INTO
    events (
        id,
        title,
        summary,
        date,
        image,
        link,
        published,
        created_at,
        updated_at
    )
VALUES (
        '7c5a17cc-1da0-4976-bd3a-5e9a81b4463c',
        'PİŞİRİCİLER | ÇOCUK SİNEMA',
        '',
        '',
        '/uploads/1769971759629-Gemini_Generated_Image_i0i831i0i831i0i8.png',
        'pisiriciler-cocuk-sinema-5975',
        1,
        '2026-01-25 12:32:09',
        '2026-02-01 18:49:19'
    ),
    (
        '38643107-ed47-4a94-86ab-786330c5605e',
        'GULİVER\'İN GEZİLERİ | ÇOCUK TİYATRO',
        '',
        '26 Ocak 2026 Pazartesi',
        'images/crop_is_7964.jpg',
        'guliver-in-gezileri-cocuk-tiyatro',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '86d47de6-9ed0-46e5-92d6-12a4a567700d',
        'DEDEKTİF İZ PEŞİNDE | ÇOCUK TİYATRO',
        '',
        '28 Ocak 2026 Çarşamba',
        'images/crop_is_9884.jpg',
        'dedektif-iz-pesinde-cocuk-tiyatro-5977',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '5a425c23-1008-47e2-8957-3f25e3fb2a28',
        'TATLI DÜŞLER | ÇOCUK TİYATRO',
        '',
        '31 Ocak 2026 Cumartesi',
        'images/crop_is_9346.jpg',
        'tatli-dusler-cocuk-tiyatro-5978',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    );

-- Duyurular
INSERT INTO
    announcements (
        id,
        title,
        summary,
        date,
        link,
        published,
        created_at,
        updated_at
    )
VALUES (
        '88625f73-ee12-41fb-8eec-d6c29e291da8',
        'Su Kesintisi Hakkında',
        NULL,
        '2026-01-29',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    ),
    (
        '1bbb4f90-423b-4b75-9e5a-64f5b51210a8',
        'Vergi Ödemeleri Hatırlatması',
        NULL,
        '2026-01-29',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    ),
    (
        'f155d782-2b67-4c2a-b029-fe7b638375bf',
        'Park Bakım Çalışmaları Duyurusu',
        NULL,
        '2026-01-29',
        '',
        1,
        '2026-01-29 18:18:29',
        '2026-01-29 18:18:29'
    );

-- Belgeler
INSERT INTO
    documents (
        id,
        title,
        link,
        date,
        published,
        created_at,
        updated_at
    )
VALUES (
        '6a1848e5-f82b-492f-8004-01c486872f3f',
        'Bayrampaşa Afet Toplanma Alanları',
        'bayrampasa-afet-toplanma-alanlari-5750',
        '28/04/2025',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '1daae1cc-ebc0-453b-8958-344bb10d176e',
        'Atık Toplama Alanları (PDF)',
        'https://bayrampasa.bel.tr/isDosyalar/2022/12/geri-donusum-atik-noktalari4032.pdf',
        '16/12/2022',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '4ede7613-e889-412c-b308-2d2ace25d2f0',
        'Nikah Randevu İptal (Docx)',
        'https://www.bayrampasa.bel.tr/isDosyalar/2022/02/08/is_4289.docx',
        '16/12/2022',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '0307d81b-a37b-48e9-8653-9c437e818dde',
        'Nikah Randevu Değiştirme (Docx)',
        'https://bayrampasa.bel.tr/isDosyalar/2022/02/08/is_6273.docx',
        '16/12/2022',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'fd32d7af-9692-4164-bf73-78e4b09e1557',
        'Gezi Muvafakatname (PDF)',
        'https://bayrampasa.bel.tr/belgeler/uploads/gezi-muvafakatname.pdf',
        '16/12/2022',
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    );

-- Bannerlar
INSERT INTO
    banners (
        id,
        title,
        image,
        link,
        summary,
        sort_order,
        published,
        created_at,
        updated_at
    )
VALUES (
        'e3156a2e-2e58-4381-bf6e-4e6670b13c03',
        '02.02',
        'images/02-0287874.jpg',
        '',
        '',
        0,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '02908367-444f-485e-8de7-c2c62583e4fa',
        '30.01',
        'images/30-0187541.jpg',
        '',
        '',
        1,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '757da318-bf77-4093-b162-1665a5017a72',
        '31.01',
        'images/31-0187610.jpg',
        '',
        '',
        2,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'da23d335-f5f4-4ff6-994d-a63dc758af12',
        '31.12',
        'images/31-1283794.jpg',
        '',
        '',
        3,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '0736bfa2-6cfd-4d7f-9996-740aa6a15650',
        '31.12',
        'images/31-1286225.jpg',
        'https://www.bayrampasa.bel.tr/bayrampasa-belediyesi-yari-olimpik-yuzme-havuzu-5042',
        '',
        4,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '90454d97-e88c-40d8-ad3c-7cba39f4a9be',
        '31.12',
        'images/31-128381.jpg',
        'https://bayrampasa.bel.tr/yuvamiz-bayrampasa-5530',
        '',
        5,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'de2993df-0ce3-4105-bdfa-0dca2c98c9c7',
        '31.12',
        'images/31-1283987.jpg',
        'https://bayrampasakariyer.com',
        '',
        6,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    );

-- Hızlı İşlemler (fast_links)
INSERT INTO
    fast_links (
        id,
        title,
        link,
        image,
        sort_order,
        published,
        created_at,
        updated_at
    )
VALUES (
        'ed91b24e-690a-44e3-bec6-d9be12db268a',
        'T.C No ile Ödeme',
        'https://ebelediye.bayrampasa.bel.tr',
        'images/online-odeme42.png',
        0,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'a9250882-7f52-4bcf-9cc2-401683255101',
        'Afet ve Acil Durum Toplanma Alanı Sorgulama',
        'https://www.turkiye.gov.tr/afet-ve-acil-durum-yonetimi-acil-toplanma-alani-sorgulama',
        'images/afet-ve-acil-durum-toplanma-alani-sorgulama77182.png',
        1,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '9c3cb0b1-4d0e-4f67-b9ce-08ca3a4c3943',
        'Fotoğraf Galeri',
        'https://galeri.bayrampasa.bel.tr',
        'images/fotograf-galeri61051.png',
        2,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'd344bb1e-0c55-4b78-9760-da810a567275',
        'Çözüm Merkezi',
        'https://cozummerkezi.bayrampasa.bel.tr/',
        'images/istek-ve-sikayet598.png',
        3,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '8c3ec978-6d50-451f-8fbc-ddf1fa74eee5',
        'Bayrampaşa Kent Konseyi',
        'https://bayrampasa.bel.tr/bayrampasa-kent-konseyi-5702',
        'images/bayrampasa-kent-konseyi75286.png',
        4,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'b1b2ba28-0e52-42e1-b047-4b1d6e1ff31e',
        'E-Veteriner',
        'https://www.bayrampasa.bel.tr/e-veteriner',
        'images/e-veteriner66357.png',
        5,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'f94a6be4-47fd-496a-9e31-b2c963216f04',
        'İmar Durumu Sorgulama',
        'https://keos.bayrampasa.bel.tr:4443/imardurumu/',
        'images/hizli-islemler128.png',
        6,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '6537e975-9dde-48c0-a058-d76a59014373',
        'Dijital İmar Yönetim Sistemi',
        'https://imar.bayrampasa.bel.tr:8095/YapiBelgeleriWeb/Kullanici',
        'images/eksper-dosya-inceleme-basvurusu968.png',
        7,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'c0a374b4-3249-4103-a3bf-2da72ee5d39d',
        'Kent Bilgi Sistemi',
        'https://keos.bayrampasa.bel.tr:4443/keos/',
        'images/cografi-bilgi-sistemi9881.png',
        8,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '81bacc7d-4615-4c92-bd44-0861a629da6c',
        'Ulusal Kent Rehberi',
        'https://bulutkbs.gov.tr/Rehber/#/app',
        'images/ulusal-kent-rehberi59517.png',
        9,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'a1725336-a290-4b07-bb1c-0c93de2edeed',
        'Ulusal Kent Rehberi (Belediye)',
        'https://bulutkbs.gov.tr/Rehber/#/app?58033662',
        'images/ulusal-kent-rehberi58499.png',
        10,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '3e1b16ff-8e6e-44e1-9499-3c114a2c5f8a',
        'Adres Numara Sorgulama',
        'https://adres.nvi.gov.tr/VatandasIslemleri/AdresSorgu',
        'images/adres-numara-sorgulama17868.png',
        11,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '0fbc34f7-6b37-4392-8ed8-957a5f816e68',
        'Evlendirme İşlemleri',
        'https://bayrampasa.bel.tr/evlendirme-islemleri',
        'images/nikah-islemleri1426.png',
        12,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '6a3564ca-eec0-47b3-8ba1-b43a9654459e',
        'Hizmet Merkezleri',
        'hizmet-merkezleri',
        'images/hizmet-merkezleri3506.png',
        13,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '3535583d-7a5a-4f37-a4ad-f1716b4ebfde',
        'Belge Arşivi',
        'https://bayrampasa.bel.tr/belgeler/',
        'images/beyan-girisi1390.png',
        14,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        '9990a0d4-1e8c-4b94-8148-7573aa92bae5',
        'Bülten',
        'https://bit.ly/belediyebulten',
        'images/bulten-abone51311.png',
        15,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    ),
    (
        'ed32fc67-3607-45e6-8137-aac8c7b1e73b',
        'Banka Hesap Numarası',
        'https://bayrampasa.bel.tr/banka-hesap-numarasi-4054',
        'images/banka-hesap-numaralari1775.png',
        16,
        1,
        '2026-01-25 12:32:09',
        '2026-01-25 12:32:09'
    );

-- Sayfalar
INSERT INTO
    pages (
        id,
        slug,
        title,
        summary,
        body,
        image,
        published,
        created_at,
        updated_at
    )
VALUES (
        'pg-hizmet-merkezleri',
        'hizmet-merkezleri',
        'Hizmet Merkezleri',
        'asdasd',
        'asasdasdasd',
        '/uploads/1769971808949-Gemini_Generated_Image_17bsaq17bsaq17bs.png',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 18:50:08'
    ),
    (
        'pg-baskan',
        'baskan',
        'Belediye Başkan V.',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-baskan-yardimcilari',
        'baskan-yardimcilari',
        'Başkan Yardımcıları',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-koordinatorler',
        'koordinatorler',
        'Koordinatörler',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-meclis',
        'meclis',
        'Belediye Meclisi',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-mudurlukler',
        'mudurlukler',
        'Müdürlükler',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-encumen',
        'encumen',
        'Belediye Encümeni',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-organizasyon-semasi',
        'organizasyon-semasi',
        'Organizasyon Şeması',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-denetim',
        'denetim',
        'İç Denetim',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-kent-konseyi',
        'kent-konseyi',
        'Bayrampaşa Kent Konseyi',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-stratejik',
        'stratejik',
        'Stratejik Plan ve Raporlar',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-kurumsal-kimlik',
        'kurumsal-kimlik',
        'Kurumsal Kimlik',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-banka-hesap-numarasi',
        'banka-hesap-numarasi',
        'Banka Hesap Numarası',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-kamuhizmet-standarti',
        'kamuhizmet-standarti',
        'Kamu Hizmeti Standartı',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-etik-ilkeler',
        'etik-ilkeler',
        'Etik İlkeler',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    ),
    (
        'pg-basvurular',
        'basvurular',
        'Başvuru İşlemleri',
        '',
        '',
        '',
        1,
        '2026-02-01 00:00:00',
        '2026-02-01 00:00:00'
    );

-- Settings
INSERT INTO
    settings (setting_key, setting_value)
VALUES ('contact', '{}'),
    ('social', '{}'),
    ('analytics', '{}');