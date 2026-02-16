const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ADMIN_DIR = path.join(__dirname, '..', 'admin');

const loadDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDb = (db) => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

const ensureCollections = (db) => {
  collections.forEach((c) => {
    if (!db[c]) db[c] = [];
  });
  if (!db.settings) db.settings = { contact: {}, social: {}, analytics: {} };
  return db;
};

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/admin', express.static(ADMIN_DIR));

// Public endpoints (generic)
const collections = [
  'news',
  'announcements',
  'events',
  'banners',
  'notices',
  'documents',
  'projects',
  'fast_links',
  'videos',
  'pages'
];

app.get('/public/:collection', (req, res) => {
  const { collection } = req.params;
  const db = ensureCollections(loadDb());
  if (!collections.includes(collection)) return res.status(404).json({ error: 'not found' });
  res.json(db[collection] || []);
});

// Public single page by slug
app.get('/public/pages/:slug', (req, res) => {
  const db = ensureCollections(loadDb());
  const slug = req.params.slug;
  const page = (db.pages || []).find((p) => p.slug === slug);
  if (!page) return res.status(404).json({ error: 'not found' });
  res.json(page);
});

// Admin endpoints generic
collections.forEach((col) => {
  // Create
  app.post(`/admin/${col}`, upload.single('image'), (req, res) => {
    const db = ensureCollections(loadDb());
    const now = new Date().toISOString();
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || '';

    if (col === 'pages') {
      const { slug = '', title = '', summary = '', body = '' } = req.body || {};
      if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
      const record = {
        id: randomUUID(),
        slug,
        title,
        summary,
        body,
        image,
        created_at: now,
        updated_at: now,
        published: true
      };
      db.pages = [record, ...(db.pages || [])];
      saveDb(db);
      return res.status(201).json(record);
    }

    const { title = '', summary = '', date = '', link = '' } = req.body || {};
    if (!title && col !== 'banners' && col !== 'videos' && col !== 'fast_links') {
      return res.status(400).json({ error: 'title is required' });
    }
    const record = {
      id: randomUUID(),
      title,
      summary,
      date,
      image,
      link,
      created_at: now,
      updated_at: now,
      published: true
    };
    db[col] = [record, ...(db[col] || [])];
    saveDb(db);
    res.status(201).json(record);
  });

  // Update
  app.put(`/admin/${col}/:id`, upload.single('image'), (req, res) => {
    const db = ensureCollections(loadDb());
    const now = new Date().toISOString();
    const { id } = req.params;
    const list = db[col] || [];
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) return res.status(404).json({ error: 'not found' });

    if (col === 'pages') {
      const { slug = list[idx].slug, title = list[idx].title, summary = list[idx].summary, body = list[idx].body } = req.body || {};
      if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || list[idx].image || '';
      db.pages[idx] = { ...list[idx], slug, title, summary, body, image, updated_at: now };
      saveDb(db);
      return res.json(db.pages[idx]);
    }

    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || list[idx].image || '';
    const { title = list[idx].title, summary = list[idx].summary, date = list[idx].date, link = list[idx].link } = req.body || {};
    db[col][idx] = { ...list[idx], title, summary, date, link, image, updated_at: now };
    saveDb(db);
    res.json(db[col][idx]);
  });

  // Delete
  app.delete(`/admin/${col}/:id`, (req, res) => {
    const db = ensureCollections(loadDb());
    const { id } = req.params;
    const list = db[col] || [];
    const exists = list.some((item) => item.id === id);
    db[col] = list.filter((item) => item.id !== id);
    saveDb(db);
    if (!exists) return res.status(404).json({ error: 'not found' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
