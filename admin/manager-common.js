(() => {
  const API_BASE = window.CMS_API_BASE || 'http://localhost:4000';
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#1f2937">Orhanpaşa Placeholder</text></svg>'
    );

  const body = document.body;
  const type = body.dataset.type;
  if (!type) return;

  const tableBody = document.querySelector('#data-table tbody');
  const refreshBtn = document.getElementById('refresh-btn');
  const form = document.getElementById('item-form');
  const formAlert = document.getElementById('form-alert');
  const modalEl = document.getElementById('itemModal');
  const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
  let currentItems = [];
  let editingId = null;

  const absUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') && !/bayrampasa/i.test(url)) return url;
    if (url.startsWith('http') && /bayrampasa/i.test(url)) return PLACEHOLDER;
    if (url.startsWith('/')) return `${API_BASE}${url}`;
    return `${API_BASE}/${url}`;
  };

  const colCount = type === 'pages' ? 4 : 5;

  const renderTable = (items) => {
    currentItems = items || [];
    if (!tableBody) return;
    if (!items || !items.length) {
      tableBody.innerHTML = `<tr><td colspan="${colCount}" class="text-muted">Kayıt yok. "Yeni Sayfa" ile ekleyin.</td></tr>`;
      return;
    }
    if (type === 'pages') {
      tableBody.innerHTML = items
        .map((item) => {
          const summaryShort = (item.summary || '').slice(0, 60) + ((item.summary || '').length > 60 ? '…' : '');
          return `<tr>
            <td><code>${(item.slug || '').replace(/</g, '&lt;')}</code></td>
            <td>${(item.title || '').replace(/</g, '&lt;')}</td>
            <td>${summaryShort.replace(/</g, '&lt;')}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" data-id="${item.id}" data-action="edit">Düzenle</button>
              <button class="btn btn-sm btn-outline-danger" data-id="${item.id}" data-action="delete">Sil</button>
            </td>
          </tr>`;
        })
        .join('');
      return;
    }
    tableBody.innerHTML = items
      .map((item) => {
        const img = item.image ? `<img src="${absUrl(item.image)}" alt="${item.title || ''}" style="width:64px;height:48px;object-fit:cover;border-radius:6px;">` : '';
        const date = item.date || '';
        return `<tr>
          <td>${img}</td>
          <td>${item.title || ''}</td>
          <td>${date}</td>
          <td>${item.summary || ''}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary" data-id="${item.id}" data-action="edit">Düzenle</button>
            <button class="btn btn-sm btn-outline-danger" data-id="${item.id}" data-action="delete">Sil</button>
          </td>
        </tr>`;
      })
      .join('');
  };

  const loadData = async () => {
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="${colCount}" class="text-muted">Yükleniyor...</td></tr>`;
    try {
      const res = await fetch(`${API_BASE}/public/${type}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Liste alınamadı');
      const data = await res.json();
      renderTable(data);
    } catch (err) {
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="${colCount}" class="text-danger">Hata: ${err.message}</td></tr>`;
    }
  };

  refreshBtn?.addEventListener('click', loadData);

  tableBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'delete') {
      if (!confirm('Silmek istediğinize emin misiniz?')) return;
      fetch(`${API_BASE}/admin/${type}/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error('Silinemedi');
          return res.json();
        })
        .then(() => loadData())
        .catch((err) => alert(err.message));
    }
    if (action === 'edit') {
      const item = currentItems.find((x) => x.id === id);
      if (!item) return;
      editingId = id;
      if (form) {
        form.querySelectorAll('input:not([type=file]), textarea').forEach((el) => {
          if (!el.name) return;
          if (el.name === 'slug') el.value = item.slug || '';
          if (el.name === 'title') el.value = item.title || '';
          if (el.name === 'summary') el.value = item.summary || '';
          if (el.name === 'date') el.value = item.date || '';
          if (el.name === 'link') el.value = item.link || '';
          if (el.name === 'body') el.value = item.body || '';
        });
      }
      modal?.show();
    }
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    formAlert?.classList.add('d-none');
    const fd = new FormData(form);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/admin/${type}/${editingId}` : `${API_BASE}/admin/${type}`;
    try {
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error('Kaydedilemedi');
      await loadData();
      form.reset();
      editingId = null;
      modal?.hide();
    } catch (err) {
      if (formAlert) {
        formAlert.textContent = err.message;
        formAlert.classList.remove('d-none');
      }
    }
  };

  form?.addEventListener('submit', submitHandler);

  // Yeni ekleme için modal açıldığında formu sıfırla (Sayfa İçerikleri vb.)
  document.querySelector('button[data-bs-target="#itemModal"]')?.addEventListener('click', () => {
    editingId = null;
    form?.reset();
    formAlert?.classList.add('d-none');
  });

  loadData();
})();
