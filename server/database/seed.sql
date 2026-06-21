-- =============================================
-- Çukurca STK CMS — Seed Data (STK / NGO Rebranded)
-- =============================================

USE cukurca_bel;

-- Temizleme işlemleri
DELETE FROM users;
DELETE FROM news;
DELETE FROM announcements;
DELETE FROM events;
DELETE FROM projects;
DELETE FROM pages;
DELETE FROM documents;
DELETE FROM banners;
DELETE FROM photo_gallery;
DELETE FROM quick_links;
DELETE FROM support_tickets;
DELETE FROM settings;
DELETE FROM visitor_logs;
DELETE FROM activity_logs;

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
        'admin@cukurcastk.org.tr',
        '$2a$10$McyHGqrayhiMgxDBm2PFGe6jhCO34CtGZip8mx23XCZyADRAvm/kK',
        'admin'
    );

-- Haberler (News)
INSERT INTO
    news (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        'a132224f-0bc7-4aad-bdb5-eb76c38b8d47',
        'Kış Dönemi Gıda ve Kıyafet Destekleri Tamamlandı',
        'kis-donemi-destekleri-tamamlandi',
        'Çukurca genelinde ihtiyaç sahibi ailelerimize yönelik kış yardımlarımızı başarıyla ulaştırdık.',
        '<p>Derneğimiz, kış aylarının zorlu şartlarında Çukurca genelindeki 250 aileye gıda kolisi, sıcak kıyafet ve yakacak yardımlarını ulaştırdı. Gönüllülerimizin özverili çalışmalarıyla hazırlanan paketler, ihtiyaç sahiplerine kapı kapı teslim edildi.</p>',
        '/uploads/1769971718207-Gemini_Generated_Image_6ayct6ayct6ayct6.png',
        '',
        '{"date": "2026-01-20"}',
        1,
        0
    ),
    (
        '6f02cf4e-1481-4ac5-a0c9-5da739028482',
        'Gönüllü Eğitim Seminerleri Başvuruları Açıldı',
        'gonullu-egitim-seminerleri',
        'Yeni dönem saha çalışmalarımızda yer alacak gönüllülerimiz için eğitim programımız başlıyor.',
        '<p>Toplumsal fayda üretmek ve saha operasyonlarimizi daha etkin kilmak amaciyla düzenlediğimiz Gönüllü Eğitim Seminerleri başliyor. Eğitime katilan tüm gönüllülerimize sertifika verilecektir.</p>',
        '/uploads/1769971739278-Gemini_Generated_Image_vl886svl886svl88.png',
        '',
        '{"date": "2026-02-05"}',
        1,
        1
    ),
    (
        '3a12d805-9e2e-45bd-9fd0-5d862cc5e64f',
        'Çukurca Doğa ve Çevre Koruma Hareketi',
        'doga-ve-cevre-koruma-hareketi',
        'Çevre bilincini artırmak amacıyla gençlerimizle fidan dikimi ve çevre temizliği gerçekleştirdik.',
        '<p>Gelecek nesillere daha yeşil bir Çukurca birakmak için düzenlediğimiz çevre hareketi kapsaminda 500 fidanı toprakla buluşturduk. Etkinliğe katilan tüm çevre dostu gönüllülerimize teşekkür ederiz.</p>',
        'https://placehold.co/600x400?text=Cevre+Hareketi',
        '',
        '{"date": "2026-02-15"}',
        1,
        2
    ),
    (
        'e1e1700c-7e6b-4cdc-9079-2abe1184a82f',
        'Girişimci Kadınlar Kalkınma Atölyesi Kuruldu',
        'girisimci-kadinlar-kalkinma-atolyesi',
        'Yerel üretimi desteklemek ve kadın istihdamını artırmak amacıyla el sanatları ve gıda atölyemizi açtık.',
        '<p>Çukurca derneğimizin koordinasyonunda kurulan atölye ile kadinlarimizin el emeği ürünleri e-ticaret ve yerel pazarlarla buluşuyor. Üreten Çukurca için desteklerinizi bekliyoruz.</p>',
        'https://placehold.co/600x400?text=Kadin+Atolyesi',
        '',
        '{"date": "2026-02-28"}',
        1,
        3
    );

-- Etkinlikler (Events)
INSERT INTO
    events (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        '7c5a17cc-1da0-4976-bd3a-5e9a81b4463c',
        'Çocuklar İçin Çevre ve Eğlence Şenliği',
        'cocuklar-icin-cevre-senligi',
        'Eğlenceli oyunlar, atölyeler ve hediyelerle çocuklarımızla buluşuyoruz.',
        '<p>Çocuklarimizin çevre bilincini eğlenerek kazanmalari için tiyatro gösterileri ve interaktif atölyeler düzenliyoruz. Katilim ücretsizdir.</p>',
        '/uploads/1769971759629-Gemini_Generated_Image_i0i831i0i831i0i8.png',
        'cocuklar-icin-cevre-senligi',
        '{"eventDate": "20 Haziran 2026", "location": "Dernek Gençlik Merkezi Salonu"}',
        1,
        0
    ),
    (
        '38643107-ed47-4a94-86ab-786330c5605e',
        'Sürdürülebilir Tarım ve Hayvancılık Semineri',
        'surdurulebilir-tarim-semineri',
        'Yerel çiftçilerimizi desteklemek amacıyla uzman akademisyenlerin katılımıyla eğitim düzenliyoruz.',
        '<p>Çukurca bölgesindeki tarimsal verimliliği artirmak ve modern hayvancilik yöntemlerini tanitmak üzere gerçekleştireceğimiz seminere tüm bölge halkimiz davetlidir.</p>',
        'images/crop_is_7964.jpg',
        'surdurulebilir-tarim-semineri',
        '{"eventDate": "28 Haziran 2026", "location": "Çukurca Kültür Evi"}',
        1,
        1
    );

-- Duyurular (Announcements)
INSERT INTO
    announcements (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        '88625f73-ee12-41fb-8eec-d6c29e291da8',
        'Kış Yardım Kampanyası Bağış Başvuruları',
        'kis-yardimi-bagis-basvurulari',
        'İhtiyaç sahibi aileler için kış yardım başvuruları ve bağış kabulleri başlamıştır.',
        '<p>Kiş dönemi boyunca sürecek gida, giysi ve yakacak yardimlari için hem ihtiyaç sahiplerinin başvurularini hem de bağişçilarimizin katkilarini kabul etmeye başladik.</p>',
        '',
        '',
        '{"date": "2026-06-10"}',
        1,
        0
    ),
    (
        '1bbb4f90-423b-4b75-9e5a-64f5b51210a8',
        'Dernek Yönetim Kurulu Toplantısı Kararları',
        'dernek-yonetim-kurulu-kararlari',
        'Haziran ayı dernek yönetim kurulu kararları şeffaflık ilkesi gereği yayınlanmıştır.',
        '<p>Derneğimizin haziran ayi olağan yönetim kurulu toplantisinda alinan bütçe harcamalari, proje onaylari ve yeni dönem hedeflerini içeren kararlara duyuru detayindan ulaşabilirsiniz.</p>',
        '',
        '',
        '{"date": "2026-06-12"}',
        1,
        1
    );

-- Belgeler (Documents)
INSERT INTO
    documents (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        '6a1848e5-f82b-492f-8004-01c486872f3f',
        'Dernek Tüzüğü ve Yönetmelik',
        'dernek-tuzugu-ve-yonetmelik',
        'Derneğimizin kuruluş amacı, çalışma ilkeleri ve yasal tüzüğü.',
        '<p>Çukurca Sivil Toplum Destek Derneği resmi tüzük belgesidir. Şeffaf ve hesap verebilir yönetim modelimizin detaylarini içerir.</p>',
        '',
        '/uploads/dernek-tuzugu.pdf',
        '{"date": "2026-01-01", "fileSize": "1.2 MB", "fileType": "pdf"}',
        1,
        0
    ),
    (
        '1daae1cc-ebc0-453b-8958-344bb10d176e',
        '2025 Yılı Faaliyet ve Denetim Raporu',
        '2025-faaliyet-raporu',
        '2025 yılı boyunca gerçekleştirdiğimiz tüm projeler, toplanan bağışlar ve harcama detayları.',
        '<p>Şeffaflik vizyonumuz gereği, 2025 mali yilina ait tüm gelir-gider tablolarini ve denetim kurulu raporlarini içeren resmi belgedir.</p>',
        '',
        '/uploads/2025-faaliyet-raporu.pdf',
        '{"date": "2026-02-15", "fileSize": "3.8 MB", "fileType": "pdf"}',
        1,
        1
    );

-- Bannerlar (Banners)
INSERT INTO
    banners (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        'e3156a2e-2e58-4381-bf6e-4e6670b13c03',
        'Geleceği Birlikte İnşa Ediyoruz',
        'gelecegi-birlikte-insa-ediyoruz',
        'Çukurca halkının refahı, eğitimi ve yerel kalkınması için el ele verdik.',
        '',
        '/images/02-0287874.jpg',
        '',
        '{}',
        1,
        0
    ),
    (
        '02908367-444f-485e-8de7-c2c62583e4fa',
        'Bir Çocuğun Eğitimi, Bir Dünyanın Değişimi',
        'bir-cocugun-egitimi',
        'Eğitimde fırsat eşitliği sağlamak amacıyla burs kampanyamıza destek olun.',
        '',
        '/images/30-0187541.jpg',
        '',
        '{}',
        1,
        1
    );

-- Hızlı Bağlantılar (QuickLinks)
INSERT INTO
    quick_links (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        'ed91b24e-690a-44e3-bec6-d9be12db268a',
        'Destek Ol / Bağış Yap',
        'destek-ol-bagis-yap',
        'Güvenli ödeme altyapımız ile derneğimize bağış yaparak katkıda bulunun.',
        '',
        'images/online-odeme42.png',
        '/destek',
        '{}',
        1,
        0
    ),
    (
        '9c3cb0b1-4d0e-4f67-b9ce-08ca3a4c3943',
        'Gönüllü Ol',
        'gonullu-ol',
        'Projelerimizde aktif görev alarak Çukurca için fark yaratın.',
        '',
        'images/fotograf-galeri61051.png',
        '/sayfa/gonulluluk',
        '{}',
        1,
        1
    ),
    (
        'd344bb1e-0c55-4b78-9760-da810a567275',
        'Destek Masası',
        'destek-masasi',
        'Her türlü yardım talebi, öneri ve işbirlikleri için mesaj gönderin.',
        '',
        'images/istek-ve-sikayet598.png',
        '/iletisim',
        '{}',
        1,
        2
    );

-- Sayfalar (Pages)
INSERT INTO
    pages (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        'pg-hakkimizda',
        'Hakkımızda',
        'hakkimizda',
        'Derneğimizin kuruluş hikayesi, misyonu ve vizyonu.',
        '<h2>Biz Kimiz?</h2><p>Çukurca Sivil Toplum Destek Derneği, Çukurca bölgesindeki sosyal yardımlaşmayı artırmak, yerel kalkınmayı desteklemek ve eğitimde fırsat eşitliği sağlamak amacıyla kurulmuş kar amacı gütmeyen bir sivil toplum kuruluşudur.</p><h2>Misyonumuz</h2><p>Toplumsal refahı artıracak projeler üretmek, şeffaf ve hesap verebilir bir yardımlaşma köprüsü kurmak.</p><h2>Vizyonumuz</h2><p>Çukurca’da her bireyin eşit fırsatlara sahip olduğu, dayanışmanın en üst düzeyde yaşandığı yeşil ve müreffeh bir gelecek.</p>',
        '/uploads/1769971808949-Gemini_Generated_Image_17bsaq17bsaq17bs.png',
        '',
        '{}',
        1,
        0
    ),
    (
        'pg-yonetim-kurulu',
        'Yönetim Kurulu',
        'yonetim-kurulu',
        'Derneğimizin yönetim ve denetim organlarında görev alan değerli üyelerimiz.',
        '<h2>Yönetim Kurulu Başkanımız</h2><p>Ahmet Yılmaz - Yönetim Kurulu Başkanı</p><h2>Yönetim Kurulu Üyeleri</h2><ul><li>Zeynep Kaya - Genel Sekreter</li><li>Mehmet Demir - Muhasip Üye</li><li>Canan Öztürk - Proje Koordinatörü</li><li>Ali Şahin - Gönüllü İlişkileri Sorumlusu</li></ul>',
        '',
        '',
        '{}',
        1,
        1
    ),
    (
        'pg-gonulluluk',
        'Gönüllülük İlkeleri',
        'gonulluluk',
        'Gönüllü çalışmalarımızın temel kuralları ve katılım süreci.',
        '<h2>Gönüllü Olun, Fark Yaratın</h2><p>Çukurca Sivil Toplum Destek Derneği olarak, tüm çalışmalarımızı gönüllülerimizin desteği ve enerjisiyle yürütüyoruz. Gönüllü olmak için hiçbir özel tecrübeye ihtiyacınız yok, toplumsal fayda üretme arzunuz olması yeterlidir.</p><h2>Çalışma Alanlarımız</h2><ul><li>Sosyal Yardım Dağıtımları</li><li>Çocuklar İçin Eğitim Desteği</li><li>Doğa ve Çevre Kampanyaları</li><li>Sosyal Sorumluluk Atölyeleri</li></ul>',
        '',
        '',
        '{}',
        1,
        2
    ),
    (
        'pg-dernek-tuzugu',
        'Dernek Tüzüğü',
        'dernek-tuzugu',
        'Yasal mevzuat ve tüzük maddelerimiz.',
        '<h2>Kuruluş ve Amaç</h2><p>Dernek, Çukurca ilçesi ve çevre köylerinde insani yardım, kültürel gelişim, eğitim destekleri ve ekolojik dengenin korunması amacıyla kurulmuştur.</p>',
        '',
        '',
        '{}',
        1,
        3
    ),
    (
        'pg-sss',
        'Sıkça Sorulan Sorular',
        's-s-s',
        'Sıkça sorulan sorular ve cevaplar.',
        '<h2>Sıkça Sorulan Sorular</h2><p>Derneğimiz ve faaliyetlerimiz hakkında sıkça sorulan sorulara bu sayfadan ulaşabilirsiniz.</p>',
        '',
        '',
        '{}',
        1,
        4
    ),
    (
        'pg-gizlilik-politikasi',
        'Gizlilik Politikası',
        'gizlilik-politikasi',
        'Gizlilik politikası metni.',
        '<h2>Gizlilik Politikası</h2><p>Kişisel verilerinizin korunması derneğimizin en önemli ilkelerinden biridir.</p>',
        '',
        '',
        '{}',
        1,
        5
    ),
    (
        'pg-kullanim-sartlari',
        'Kullanım Şartları',
        'kullanim-sartlari',
        'Kullanım şartları ve koşulları.',
        '<h2>Kullanım Şartları</h2><p>Web sitemizi kullanırken uymanız gereken kurallar ve koşullar.</p>',
        '',
        '',
        '{}',
        1,
        6
    ),
    (
        'pg-kvkk-aydinlatma-metni',
        'KVKK Aydınlatma Metni',
        'kvkk-aydinlatma-metni',
        'KVKK aydınlatma ve rıza metni.',
        '<h2>KVKK Aydınlatma Metni</h2><p>6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca aydınlatma metnimiz.</p>',
        '',
        '',
        '{}',
        1,
        7
    );

-- Projeler (Projects)
INSERT INTO
    projects (
        id,
        title,
        slug,
        short_description,
        content,
        image,
        link,
        dynamic_properties,
        is_active,
        sort_order
    )
VALUES (
        'proj-egitim-bursu',
        'Eğitimde Fırsat Eşitliği Bursu',
        'egitimde-firsat-esitligi',
        'Çukurcalı başarılı ve ihtiyaç sahibi öğrencilerimize kırtasiye ve aylık eğitim bursu sağlıyoruz.',
        '<p>Geleceğimizin teminatı olan çocuklarımızın eğitim hayatlarını kesintisiz sürdürebilmeleri için burs ve eğitim ekipmanı sağlıyoruz. Bu kampanya ile öğrencilerin okul ihtiyaçları karşılanmaktadır.</p>',
        'https://placehold.co/600x400?text=Egitim+Projesi',
        '',
        '{"targetAmount": 250000, "raisedAmount": 165000, "progressPercent": 66}',
        1,
        0
    ),
    (
        'proj-temiz-su',
        'Temiz Su ve Altyapı Desteği',
        'temiz-su-altyapi-destegi',
        'Bölgemizdeki su kaynaklarının korunması ve temiz su erişiminin iyileştirilmesi projesi.',
        '<p>Temiz suya erişim en temel insan hakkıdır. Çukurca derneğimiz öncülüğünde yerel su hatlarının yenilenmesi ve köylerimizin su analizlerinin yapılmasını hedefliyoruz.</p>',
        'https://placehold.co/600x400?text=Su+Altyapi+Projesi',
        '',
        '{"targetAmount": 500000, "raisedAmount": 200000, "progressPercent": 40}',
        1,
        1
    ),
    (
        'proj-kirsal-kalkinma',
        'Kırsal Kalkınma ve Kadın Emeği',
        'kirsal-kalkinma-kadin-emegi',
        'Kadınlarımızın yöresel tarım ve el sanatları üretimlerini ekonomik kazanca dönüştürme projesi.',
        '<p>Kırsal bölgelerde yaşayan kadınlarımızın ürettikleri yöresel Çukurca ürünlerinin markalaşması, paketlenmesi ve satışı için kurulan atölyenin ekipman ve pazarlama bütçesi.</p>',
        'https://placehold.co/600x400?text=Kadin+Emegi+Projesi',
        '',
        '{"targetAmount": 150000, "raisedAmount": 135000, "progressPercent": 90}',
        1,
        2
    );

-- Site Ayarları (Settings)
INSERT INTO
    settings (setting_key, setting_value)
VALUES (
        'general_site_name',
        '"Çukurca Sivil Toplum Destek Derneği"'
    ),
    (
        'general_site_description',
        '"Çukurca\'da eğitim, çevre ve sosyal dayanışma projeleri üreten şeffaf sivil toplum kuruluşu."'
    ),
    (
        'general_logo',
        '"/images/logo-kare.png"'
    ),
    (
        'general_favicon',
        '"/images/favicon.ico"'
    ),
    (
        'contact_address',
        '"Merkez Mahallesi Cumhuriyet Caddesi No:45, Çukurca/Hakkari"'
    ),
    (
        'contact_phone',
        '"0438 511 20 14"'
    ),
    (
        'contact_email',
        '"iletisim@cukurcastk.org.tr"'
    ),
    (
        'contact_map_embed',
        '""'
    ),
    (
        'seo_meta_title',
        '"Çukurca Sivil Toplum Destek Derneği"'
    ),
    (
        'seo_meta_description',
        '"Eğitim, kırsal kalkınma ve sosyal yardımlaşma projeleri"'
    ),
    (
        'seo_meta_keywords',
        '"dernek, çukurca, sivil toplum, vakıf, bağış, yardım, gönüllü"'
    ),
    (
        'seo_og_image',
        '""'
    ),
    (
        'social',
        '{"facebook": "https://facebook.com/cukurcastk", "twitter": "https://twitter.com/cukurcastk", "instagram": "https://instagram.com/cukurcastk", "youtube": "https://youtube.com/cukurcastk"}'
    ),
    (
        'navbar_menu',
        '[{"title":"Anasayfa","url":"/"},{"title":"Kurumsal","url":"/sayfa/hakkimizda","children":[{"title":"Hakkımızda","url":"/sayfa/hakkimizda"},{"title":"Yönetim Kurulu","url":"/sayfa/yonetim-kurulu"},{"title":"Dernek Tüzüğü","url":"/sayfa/dernek-tuzugu"},{"title":"Gönüllülük","url":"/sayfa/gonulluluk"}]},{"title":"Çalışmalarımız","url":"/projeler","children":[{"title":"Sosyal Projeler","url":"/projeler"},{"title":"Etkinlik Takvimi","url":"/etkinlikler"}]},{"title":"Güncel & Medya","url":"/haberler","children":[{"title":"Faaliyet Haberleri","url":"/haberler"},{"title":"Duyurular","url":"/duyurular"}]},{"title":"İletişim","url":"/iletisim"}]'
    ),
    (
        'home_hero_title',
        '"Çukurca İçin Sevgi ve Dayanışma Köprüsü"'
    ),
    (
        'home_hero_subtitle',
        '"Çukurca Sivil Toplum Destek Derneği olarak, eğitim, kırsal kalkınma ve toplumsal dayanışma alanlarında sürdürülebilir projeler üretiyor, geleceği hep birlikte inşa ediyoruz."'
    ),
    (
        'home_stats',
        '[{"label": "Desteklenen Aile", "value": "1,450+", "icon": "heart"}, {"label": "Aktif Gönüllü", "value": "480+", "icon": "users"}, {"label": "Aktif Proje", "value": "18+", "icon": "globe"}, {"label": "Ulaştırılan Yardım", "value": "5,200+", "icon": "hands"}]'
    ),
    (
        'faq',
        '[{"question": "Çocuklar için yaz okulu var mı?", "answer": "Evet, her yıl yaz aylarında çocuklarımız için kültürel, sportif ve eğitici yaz okulu etkinlikleri düzenlenmektedir."}, {"question": "Şifre ve giriş sorunları için ne yapmalıyım?", "answer": "Yönetim paneli veya üyelik girişlerinde sorun yaşıyorsanız, şifre sıfırlama talebinde bulunabilir ya da teknik destek ekibimizle iletişime geçebilirsiniz."}, {"question": "Bağışlar nasıl kullanılmaktadır?", "answer": "Tüm bağışlar, tüzüğümüzde yer alan amaçlar doğrultusunda eğitim bursları, gıda-kıyafet yardımları ve sürdürülebilir kalkınma projelerinde şeffaf bir şekilde kullanılmaktadır."}, {"question": "Kurban bağışı kabul ediyor musunuz?", "answer": "Evet, Kurban Bayramı döneminde vekalet yoluyla adak, akika ve vacip kurban bağışlarınızı kabul ediyor, kesimlerini gerçekleştirerek ihtiyaç sahiplerine ulaştırıyoruz."}, {"question": "Derneğe nasıl bağış yapabilirim?", "answer": "Web sitemiz üzerinden kredi kartınızla güvenli bir şekilde online bağış yapabilir veya banka hesap numaralarımıza (havale/EFT) gönderim sağlayabilirsiniz."}, {"question": "Hac ve Umre organizasyonlarınız var mı?", "answer": "Derneğimiz sosyal yardımlaşma ve dayanışma odaklı olup, Hac ve Umre organizasyonu gibi ticari veya seyahat faaliyetleri yürütmemektedir."}, {"question": "Derneğinizin faaliyet alanları nelerdir?", "answer": "Faaliyet alanlarımız arasında eğitim destekleri, kırsal kalkınma projeleri, çevre koruma etkinlikleri ve acil insani yardım çalışmaları yer almaktadır."}, {"question": "Dernekte nikah kıyılıyor mu?", "answer": "Derneğimizin nikah kıma yetkisi bulunmamaktadır. Nikah işlemleri resmi nikah memurları tarafından belediyelerde yürütülmektedir."}]'
    ),
    (
        'news_categories',
        '[{"id": "Help", "label": "İnsani Yardım"}, {"id": "Education", "label": "Eğitim & Gönüllülük"}, {"id": "Environment", "label": "Çevre & Doğa"}, {"id": "Business", "label": "Kadın & Girişimcilik"}]'
    );

-- Fotoğraf Galerisi (PhotoGallery)
INSERT INTO
    photo_gallery (id, title, slug, image, is_active, sort_order)
VALUES
    ('g1111111-1111-1111-1111-111111111111', 'Sokak Hayvanları Tedavi ve Rehabilitasyon Merkezi', 'sokak-hayvanlari-tedavi-merkezi', '/images/sokak-hayvanlari-bakim-ve-tedavi-merkezi71659.jpg', 1, 0),
    ('g2222222-2222-2222-2222-222222222222', 'Kütüphane ve Gençlik Çalışma Alanlarımız', 'kutuphane-calisma-alanlari', '/images/kutuphanelerimiz4332.jpg', 1, 1),
    ('g3333333-3333-3333-3333-333333333333', 'Girişimci Kadınlar Kalkınma Atölyesi Sınıfı', 'girisimci-kadinlar-atolye-sinifi', '/images/08-0186825.jpg', 1, 2),
    ('g4444444-4444-4444-4444-444444444444', 'Saha Gönüllüleri Eğitim ve Planlama Buluşması', 'gonullu-planlama-bulusmasi', '/images/30-0187541.jpg', 1, 3),
    ('g5555555-5555-5555-5555-555555555555', 'Zübeyde Hanım Yaşam Merkezi Sosyal Tesisler', 'zubeyde-hanim-yasam-merkezi', '/images/zubeyde-hanim-yasam-merkezi7177.jpg', 1, 4),
    ('g6666666-6666-6666-6666-666666666666', 'Gıda ve Sıcak Yemek Dağıtım Operasyonlarımız', 'gida-ve-yemek-dagitimlari', '/images/bayrampasa-belediyesi-yemek-uretim-tesisi76658.jpg', 1, 5);

-- İlanlar / Basın (Notices / Press)
INSERT INTO
    notices (id, title, slug, short_description, image, is_active, sort_order)
VALUES
    ('n1111111-1111-1111-1111-111111111111', 'Çukurca Eğitim Kampanyası Basın Bülteni', 'cukurca-egitim-kampanyasi-basin-bulteni', 'Derneğimiz, Çukurca genelindeki kırsal okullarda eğitim gören 500 öğrenciye ulaştırılacak kırtasiye ve tablet yardımı kampanyasını kamuoyuna duyurur.', '/images/kutuphanelerimiz4332.jpg', 1, 0),
    ('n2222222-2222-2222-2222-222222222222', 'Olağan Genel Kurul Toplantısı Çağrısı', 'olagan-genel-kurul-cagrisi', 'Çukurca Sivil Toplum Destek Derneği Yönetim Kurulu kararı ile Olağan Genel Kurul Toplantısı 15 Temmuz 2026 tarihinde dernek merkezinde gerçekleştirilecektir.', '/images/30-0187541.jpg', 1, 1);