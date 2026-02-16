(() => {
  const API_BASE = window.ADMIN_API_BASE || window.location.origin || 'http://localhost:4000';

  const qs = (sel, parent = document) => parent.querySelector(sel);
  const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

  const tokenKey = 'bp_admin_token';
  const getToken = () => localStorage.getItem(tokenKey);
  const setToken = (t) => localStorage.setItem(tokenKey, t);
  const clearToken = () => localStorage.removeItem(tokenKey);

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  });

  const showAlert = (el, msg) => {
    el.textContent = msg;
    el.classList.remove('d-none');
  };

  const hideAlert = (el) => el.classList.add('d-none');

  const loginForm = qs('#login-form');
  const loginAlert = qs('#login-alert');
  const panel = qs('#panel');
  const loginSection = qs('#login-section');
  const userInfo = qs('#user-info');
  const statsSection = qs('#stats');
  const toastContainer = qs('#toast-container');
  const refreshAllBtn = qs('#refresh-all');
  const logoutBtn = qs('#logout-btn');

  const modalEl = qs('#editModal');
  const editForm = qs('#edit-form');
  const editModal = modalEl ? new bootstrap.Modal(modalEl) : null;

  const state = {
    data: {},
    currentEdit: { collection: null, id: null }
  };

  const formatDate = (val) => {
    if (!val) return '';
    return new Date(val).toLocaleDateString('tr-TR');
  };

  const api = {
    async login(email, password) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Giriş başarısız');
      return res.json();
    },
    async me() {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) throw new Error('Oturum doğrulanamadı');
      return res.json();
    },
    async list(collection) {
      const res = await fetch(`${API_BASE}/api/${collection}`, { headers: headers() });
      if (!res.ok) throw new Error('Liste alınamadı');
      return res.json();
    },
    async create(collection, payload) {
      const res = await fetch(`${API_BASE}/api/${collection}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Kaydedilemedi');
      return res.json();
    },
    async update(collection, id, payload) {
      const res = await fetch(`${API_BASE}/api/${collection}/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Güncellenemedi');
      return res.json();
    },
    async remove(collection, id) {
      const res = await fetch(`${API_BASE}/api/${collection}/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error('Silinemedi');
      return res.json();
    },
    async settingsGet() {
      const res = await fetch(`${API_BASE}/api/settings`, { headers: headers() });
      if (!res.ok) throw new Error('Ayar alınamadı');
      return res.json();
    },
    async settingsSave(payload) {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Ayar kaydedilemedi');
      return res.json();
    },
    async upload(file) {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API_BASE}/api/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form
      });
      if (!res.ok) throw new Error('Yükleme başarısız');
      return res.json();
    }
  };

  // Render helpers
  const notify = (message, type = 'success') => {
    if (!toastContainer) return alert(message);
    const id = `toast-${Date.now()}`;
    const icon = type === 'success' ? '✅' : type === 'danger' ? '⚠️' : 'ℹ️';
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = id;
    toast.role = 'alert';
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${icon} ${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    toastContainer.appendChild(toast);
    new bootstrap.Toast(toast, { delay: 3000 }).show();
  };

  const renderStats = () => {
    if (!statsSection) return;
    Object.entries(state.data).forEach(([key, arr]) => {
      const el = qs(`[data-stat="${key}"]`);
      if (el) el.textContent = arr?.length ?? 0;
    });
    statsSection.classList.remove('d-none');
  };

  const renderList = (collection, data) => {
    const container = qs(`[data-list="${collection}"]`);
    if (!container) return;
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="text-muted mb-0">Kayıt yok.</p>';
      return;
    }
    container.innerHTML = data.map((item) => {
      const meta = [];
      if (item.date) meta.push(`<span class="badge bg-light text-dark">Tarih: ${formatDate(item.date)}</span>`);
      if (item.link) meta.push(`<span class="badge bg-light text-dark">Link</span>`);
      if (item.published === false) meta.push(`<span class="badge bg-warning text-dark">Taslak</span>`);
      const summary = item.summary ? item.summary.slice(0, 120) + (item.summary.length > 120 ? '…' : '') : '';
      const img = item.image ? `<div class="thumb"><img src="${item.image}" alt="${item.title || ''}"></div>` : '';
      return `
        <div class="item-card">
          ${img}
          <div class="flex-fill">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h4>${item.title || '(Başlık yok)'}</h4>
                <div class="meta">${meta.join(' ')}</div>
              </div>
              <div class="actions">
                <button class="btn btn-sm btn-outline-primary" data-edit="${collection}" data-id="${item.id}">Düzenle</button>
                <button class="btn btn-sm btn-outline-danger" data-del="${collection}" data-id="${item.id}">Sil</button>
              </div>
            </div>
            ${summary ? `<p class="body-text">${summary}</p>` : ''}
          </div>
        </div>`;
    }).join('');
  };

  const refreshCollection = async (collection) => {
    try {
      const data = await api.list(collection);
      state.data[collection] = data;
      renderList(collection, data);
      renderStats();
    } catch (err) {
      console.error(err);
      alert(`${collection} listesi alınamadı`);
    }
  };

  // Login flow
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(loginAlert);
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();
    try {
      const { token, user } = await api.login(email, password);
      setToken(token);
      loginSection.classList.add('d-none');
      panel.classList.remove('d-none');
      userInfo.textContent = `${user.name} (${user.email})`;
      await initData();
      notify('Giriş başarılı', 'success');
    } catch (err) {
      showAlert(loginAlert, err.message);
    }
  });

  const initData = async () => {
    const lists = ['banners', 'news', 'events', 'announcements', 'notices', 'documents', 'projects', 'fast_links', 'videos'];
    for (const key of lists) {
      await refreshCollection(key);
    }
    await loadSettings();
  };

  // Auto login if token valid
  const tryResume = async () => {
    if (!getToken()) return;
    try {
      const me = await api.me();
      userInfo.textContent = `${me.name} (${me.email})`;
      loginSection.classList.add('d-none');
      panel.classList.remove('d-none');
      await initData();
    } catch {
      clearToken();
    }
  };
  tryResume();

  // CRUD form handler
  qsa('.crud-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const collection = form.dataset.collection;
      const payload = {};
      qsa('input, textarea', form).forEach((el) => {
        if (!el.name) return;
        if (el.type === 'checkbox') {
          payload[el.name] = el.checked;
        } else {
          payload[el.name] = el.value.trim();
        }
      });
      if (payload.published === undefined) payload.published = true;
      try {
        await api.create(collection, payload);
        form.reset();
        await refreshCollection(collection);
        notify('Kayıt eklendi', 'success');
      } catch (err) {
        notify(err.message, 'danger');
      }
    });
  });

  // Delete buttons
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-del]');
    if (!btn) return;
    const collection = btn.dataset.del;
    const id = btn.dataset.id;
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await api.remove(collection, id);
      await refreshCollection(collection);
      notify('Silindi', 'info');
    } catch (err) {
      notify(err.message, 'danger');
    }
  });

  // Reload buttons
  qsa('.reload').forEach((btn) => {
    btn.addEventListener('click', () => refreshCollection(btn.dataset.collection));
  });

  // Settings
  const settingsForm = qs('#settings-form');
  const loadSettings = async () => {
    if (!settingsForm) return;
    try {
      const data = await api.settingsGet();
      qsa('input, textarea', settingsForm).forEach((el) => {
        const path = el.name.split('.');
        let val = data;
        path.forEach((k) => { val = (val || {})[k]; });
        el.value = val || '';
      });
    } catch (err) {
      console.error(err);
    }
  };

  settingsForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = { contact: {}, social: {}, analytics: {} };
    qsa('input, textarea', settingsForm).forEach((el) => {
      const path = el.name.split('.');
      if (path[0] === 'contact') payload.contact[path[1]] = el.value.trim();
      if (path[0] === 'social') payload.social[path[1]] = el.value.trim();
      if (path[0] === 'analytics') payload.analytics[path[1]] = el.value.trim();
    });
    try {
      await api.settingsSave(payload);
      notify('Ayarlar kaydedildi', 'success');
    } catch (err) {
      notify(err.message, 'danger');
    }
  });

  qs('#load-settings')?.addEventListener('click', loadSettings);

  // Upload
  const uploadForm = qs('#upload-form');
  const uploadResult = qs('#upload-result');
  uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = uploadForm.file.files[0];
    if (!file) return;
    hideAlert(uploadResult);
    try {
      const res = await api.upload(file);
      uploadResult.classList.remove('d-none');
      uploadResult.textContent = `Yüklendi: ${res.url}`;
      notify('Dosya yüklendi', 'success');
    } catch (err) {
      uploadResult.classList.remove('d-none');
      uploadResult.textContent = err.message;
      uploadResult.classList.replace('alert-info', 'alert-danger');
      notify(err.message, 'danger');
    }
  });

  // Edit flow
  const openEdit = (collection, id) => {
    if (!editModal || !editForm) return;
    const record = (state.data[collection] || []).find((x) => x.id === id);
    if (!record) return;
    state.currentEdit = { collection, id };
    editForm.title.value = record.title || '';
    editForm.summary.value = record.summary || '';
    editForm.image.value = record.image || '';
    editForm.link.value = record.link || '';
    editForm.date.value = record.date ? record.date.replace('Z', '') : '';
    editForm.published.checked = record.published !== false;
    editModal.show();
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-edit]');
    if (!btn) return;
    const collection = btn.dataset.edit;
    const id = btn.dataset.id;
    openEdit(collection, id);
  });

  editForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { collection, id } = state.currentEdit;
    if (!collection || !id) return;
    const payload = {
      title: editForm.title.value.trim(),
      summary: editForm.summary.value.trim(),
      image: editForm.image.value.trim(),
      link: editForm.link.value.trim(),
      date: editForm.date.value,
      published: editForm.published.checked
    };
    try {
      await api.update(collection, id, payload);
      await refreshCollection(collection);
      notify('Güncellendi', 'success');
      editModal.hide();
    } catch (err) {
      notify(err.message, 'danger');
    }
  });

  // Refresh all
  refreshAllBtn?.addEventListener('click', async () => {
    const lists = ['banners', 'news', 'events', 'announcements', 'notices', 'documents', 'projects', 'fast_links', 'videos'];
    for (const key of lists) {
      await refreshCollection(key);
    }
    notify('Listeler yenilendi', 'info');
  });

  // Logout
  logoutBtn?.addEventListener('click', () => {
    clearToken();
    window.location.reload();
  });
})();
