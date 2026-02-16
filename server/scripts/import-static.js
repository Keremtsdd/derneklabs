const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const cheerio = require('cheerio');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.resolve(ROOT, 'data', 'db.json');
const HTML_PATH = path.resolve(ROOT, '..', 'index.html');
const UPLOAD_DIR = path.resolve(ROOT, 'uploads');
const IMAGES_DIR = path.resolve(ROOT, '..', 'images');

const loadDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDb = (db) => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

const loadHtml = () => fs.readFileSync(HTML_PATH, 'utf-8');

const exists = (arr, title, link) => arr.some((i) => (i.title || '').trim() === title.trim() && (i.link || '').trim() === (link || '').trim());

const now = () => new Date().toISOString();

const makeRecord = (fields) => ({
  id: uuid(),
  created_at: now(),
  updated_at: now(),
  published: fields.published ?? true,
  ...fields
});

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(UPLOAD_DIR);

const copyImageToUploads = (srcPath) => {
  if (!srcPath) return '';
  if (srcPath.startsWith('http')) return srcPath; // external
  const cleanPath = srcPath.replace(/^\//, '');
  // Try images/ relative root
  const original = path.resolve(IMAGES_DIR, path.basename(cleanPath));
  if (!fs.existsSync(original)) return srcPath; // leave as-is if not found
  const base = path.basename(cleanPath);
  const target = path.join(UPLOAD_DIR, base);
  try {
    if (!fs.existsSync(target)) {
      fs.copyFileSync(original, target);
    }
    return `/uploads/${base}`;
  } catch {
    return srcPath;
  }
};

const importData = () => {
  const db = loadDb();
  const html = loadHtml();
  const $ = cheerio.load(html);

  const counters = {
    banners: 0,
    news: 0,
    events: 0,
    announcements: 0,
    notices: 0,
    documents: 0,
    projects: 0,
    fast_links: 0,
    videos: 0
  };

  // Banners
  $('.buyuk-slider .item').each((_, el) => {
    const link = $(el).find('a').attr('href') || '';
    const imgRaw = $(el).find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    const title = $(el).find('img').attr('alt') || '';
    if (!img) return;
    if (exists(db.banners, title, link)) return;
    db.banners.push(makeRecord({ title, image: img, link, summary: '', published: true }));
    counters.banners++;
  });

  // News
  $('.haber-slider .item').each((_, el) => {
    const a = $(el).find('a').first();
    const link = a.attr('href') || '';
    const title = $(el).find('.card-title').text().trim();
    const imgRaw = $(el).find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    if (!title) return;
    if (exists(db.news, title, link)) return;
    db.news.push(makeRecord({ title, link, image: img, summary: '', published: true }));
    counters.news++;
  });

  // Events
  $('#etkinlik-tab .video-slider .items').each((_, el) => {
    const a = $(el).find('a').first();
    const link = a.attr('href') || '';
    const title = $(el).find('.card-title').text().trim();
    const imgRaw = $(el).find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    const date = $(el).find('time').first().text().trim();
    if (!title) return;
    if (exists(db.events, title, link)) return;
    db.events.push(makeRecord({ title, link, image: img, summary: '', date, published: true }));
    counters.events++;
  });

  // Announcements (Duyurular)
  $('#d1-tab ul.list-group li').each((_, el) => {
    const a = $(el).find('a');
    const title = a.text().trim();
    const link = a.attr('href') || '';
    if (!title || title.toLowerCase().includes('tüm duyurular')) return;
    const date = $(el).find('time').first().text().trim();
    if (exists(db.announcements, title, link)) return;
    db.announcements.push(makeRecord({ title, link, date, published: true }));
    counters.announcements++;
  });

  // Notices (İlanlar)
  $('#d2-tab ul.list-group li').each((_, el) => {
    const txt = $(el).text().trim().toLowerCase();
    if (txt.includes('aktif ilan yok')) return;
    const a = $(el).find('a');
    const title = a.text().trim() || txt;
    const link = a.attr('href') || '';
    const date = $(el).find('time').first().text().trim();
    if (exists(db.notices, title, link)) return;
    db.notices.push(makeRecord({ title, link, date, published: true }));
    counters.notices++;
  });

  // Documents (Belgeler)
  $('#d3-tab ul.list-group li').each((_, el) => {
    const a = $(el).find('a');
    const title = a.text().trim();
    const link = a.attr('href') || '';
    if (!title) return;
    const date = $(el).find('time').first().text().trim();
    if (exists(db.documents, title, link)) return;
    db.documents.push(makeRecord({ title, link, date, published: true }));
    counters.documents++;
  });

  // Projects
  $('.proje-slider a').each((_, el) => {
    const a = $(el);
    const link = a.attr('href') || '';
    const title = a.attr('title') || a.text().trim();
    const imgRaw = a.find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    if (!title) return;
    if (exists(db.projects, title, link)) return;
    db.projects.push(makeRecord({ title, link, image: img, published: true }));
    counters.projects++;
  });

  // Fast links
  $('.hizli-menu-beltr .servis').each((_, el) => {
    const parentLink = $(el).closest('a');
    const link = parentLink.attr('href') || '';
    const title = $(el).find('h3').text().trim();
    const imgRaw = $(el).find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    if (!title || !link) return;
    if (exists(db.fast_links, title, link)) return;
    db.fast_links.push(makeRecord({ title, link, image: img, published: true }));
    counters.fast_links++;
  });

  // Videos (if any)
  $('#video-tab .video-slider .items').each((_, el) => {
    const a = $(el).find('a').first();
    const link = a.attr('href') || '';
    const title = $(el).find('.card-title').text().trim();
    const imgRaw = $(el).find('img').attr('src') || '';
    const img = copyImageToUploads(imgRaw);
    if (!title && !link) return;
    if (exists(db.videos, title || '', link)) return;
    db.videos.push(makeRecord({ title, link, image: img, published: true }));
    counters.videos++;
  });

  saveDb(db);
  console.log('İçe aktarma tamamlandı:', counters);
};

importData();
