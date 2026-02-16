const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.resolve(__dirname, '..', 'data', 'db.json');

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().split('T')[0];

const mockNews = [
  'Orhanpaşa Metrosu Açılıyor',
  'Dijital Belediye Uygulaması Yayında',
  'Orhanpaşa Yaz Spor Okulları Başladı',
  'Akıllı Atık Toplama Sistemi Devrede',
  'Kültür ve Sanat Günleri Başlıyor',
  'Yeni Nesil Kütüphane Hizmete Girdi'
].map((title, idx) => ({
  id: crypto.randomUUID(),
  title,
  summary: `${title} hakkında kısa bilgilendirme.`,
  date: today(),
  image: 'https://placehold.co/600x400?text=Haber+Gorseli',
  link: '',
  created_at: nowIso(),
  updated_at: nowIso(),
  published: true
}));

const mockAnnouncements = [
  'Su Kesintisi Hakkında',
  'Vergi Ödemeleri Hatırlatması',
  'Park Bakım Çalışmaları Duyurusu'
].map((title) => ({
  id: crypto.randomUUID(),
  title,
  date: today(),
  link: '',
  created_at: nowIso(),
  updated_at: nowIso(),
  published: true
}));

function seed() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  db.news = mockNews;
  db.announcements = mockAnnouncements;
  db.projects = [];
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log('Seed tamamlandı: news, announcements temizlendi ve yeniden eklendi.');
}

seed();
