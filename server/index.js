const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuid } = require('uuid');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Config
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'degistirin_lutfen';
const DATA_FILE = path.resolve(__dirname, process.env.DATA_FILE || './data/db.json');
const UPLOAD_DIR = path.resolve(__dirname, process.env.UPLOAD_DIR || '../uploads');
const CORS_ORIGIN = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || CORS_ORIGIN.length === 0 || CORS_ORIGIN.includes(origin)) return cb(null, true);
    return cb(new Error('CORS engellendi'), false);
  }
}));

// Storage helpers
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(path.dirname(DATA_FILE));
ensureDir(UPLOAD_DIR);

const loadDb = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const base = {
      users: [],
      news: [],
      events: [],
      announcements: [],
      notices: [],
      documents: [],
      projects: [],
      banners: [],
      fast_links: [],
      videos: [],
      settings: { contact: {}, social: {}, analytics: {} }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(base, null, 2));
    return base;
  }
};

const saveDb = (db) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
};

// Seed default admin
const seedAdmin = async () => {
  const db = loadDb();
  if (db.users.length > 0) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const hash = await bcrypt.hash(password, 10);
  db.users.push({
    id: uuid(),
    name: 'Yönetici',
    email,
    password: hash,
    role: 'admin'
  });
  saveDb(db);
  console.log('Varsayılan admin oluşturuldu:', email);
};

seedAdmin();

// Auth helpers
const signToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

const authRequired = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Yetkisiz' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token geçersiz veya süresi doldu' });
  }
};

// Uploads
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  }
});
const upload = multer({ storage });

// Auth routes
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email ve şifre gerekli' });
  const db = loadDb();
  const user = db.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Şifre hatalı' });
  const token = signToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/auth/me', authRequired, (req, res) => {
  const db = loadDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// Generic CRUD
const collections = [
  'news',
  'events',
  'announcements',
  'notices',
  'documents',
  'projects',
  'banners',
  'fast_links',
  'videos'
];

const isPublicCollection = (name) => collections.includes(name);

const validatePayload = (body) => {
  const allowed = ['title', 'summary', 'body', 'image', 'link', 'date', 'tags', 'extra', 'published'];
  const payload = {};
  allowed.forEach((k) => {
    if (body[k] !== undefined) payload[k] = body[k];
  });
  return payload;
};

const registerCrud = (key) => {
  app.get(`/api/${key}`, authRequired, (_, res) => {
    const db = loadDb();
    return res.json(db[key] || []);
  });

  app.post(`/api/${key}`, authRequired, (req, res) => {
    const db = loadDb();
    const payload = validatePayload(req.body || {});
    if (!payload.title) return res.status(400).json({ error: 'Başlık gerekli' });
    const now = new Date().toISOString();
    const record = { id: uuid(), created_at: now, updated_at: now, published: payload.published ?? true, ...payload };
    db[key] = [record, ...db[key]];
    saveDb(db);
    return res.status(201).json(record);
  });

  app.put(`/api/${key}/:id`, authRequired, (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const idx = db[key].findIndex((item) => item.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Kayıt bulunamadı' });
    const payload = validatePayload(req.body || {});
    db[key][idx] = { ...db[key][idx], ...payload, updated_at: new Date().toISOString() };
    saveDb(db);
    return res.json(db[key][idx]);
  });

  app.delete(`/api/${key}/:id`, authRequired, (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const exists = db[key].some((item) => item.id === id);
    db[key] = db[key].filter((item) => item.id !== id);
    saveDb(db);
    if (!exists) return res.status(404).json({ error: 'Kayıt bulunamadı' });
    return res.json({ success: true });
  });
};

collections.forEach(registerCrud);

// Settings
app.get('/api/settings', authRequired, (_, res) => {
  const db = loadDb();
  return res.json(db.settings || {});
});

app.put('/api/settings', authRequired, (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...(req.body || {}), updated_at: new Date().toISOString() };
  saveDb(db);
  return res.json(db.settings);
});

// Media upload
app.post('/api/media', authRequired, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Dosya bulunamadı' });
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.status(201).json({ filename: req.file.filename, url: fileUrl });
});

app.use('/uploads', express.static(UPLOAD_DIR));

// Public (read-only) endpoints
app.get('/public/:collection', (req, res) => {
  const { collection } = req.params;
  if (!isPublicCollection(collection)) return res.status(404).json({ error: 'Koleksiyon bulunamadı' });
  const db = loadDb();
  const items = (db[collection] || []).filter((item) => item.published !== false);
  return res.json(items);
});

app.get('/public/settings', (_, res) => {
  const db = loadDb();
  return res.json(db.settings || {});
});

// Serve admin panel if desired
const adminPath = path.resolve(__dirname, '../admin');
if (fs.existsSync(adminPath)) {
  app.use('/admin', express.static(adminPath));
}

app.get('/health', (_, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`API dinlemede http://localhost:${PORT}`);
});
