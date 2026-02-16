(() => {
  const API_BASE = window.CMS_API_BASE || 'http://localhost:4000';

  const tableBody = document.querySelector('#news-table tbody');
  const refreshBtn = document.getElementById('refresh-btn');
  const form = document.getElementById('news-form');
  const formAlert = document.getElementById('form-alert');
  const modalEl = document.getElementById('newsModal');
  const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
  let currentItems = [];
  let editingId = null;

  const absUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${API_BASE}${url}`;
    return `${API_BASE}/${url}`;
  };

  const renderTable = (items) => {
    currentItems = items || [];
    if (!tableBody) return;
    if (!items || !items.length) {
      tableBody.innerHTML = `<tr><td colspan="4" class="text-muted">Kayıt yok.</td></tr>`;
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
        <td>
          <button class="btn btn-sm btn-outline-primary" data-id="${item.id}" data-action="edit">Düzenle</button>
          <button class="btn btn-sm btn-outline-danger" data-id="${item.id}" data-action="delete">Sil</button>
        </td>
      </tr>`;
      })
      .join('');
  };

  const loadNews = async () => {
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="4" class="text-muted">Yükleniyor...</td></tr>`;
    try {
      const res = await fetch(`${API_BASE}/public/news`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Liste alınamadı');
      const data = await res.json();
      renderTable(data);
    } catch (err) {
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="4" class="text-danger">Hata: ${err.message}</td></tr>`;
    }
  };

  refreshBtn?.addEventListener('click', loadNews);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (formAlert) formAlert.classList.add('d-none');
    const fd = new FormData(form);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE}/admin/news/${editingId}` : `${API_BASE}/admin/news`;
    try {
      const res = await fetch(url, {
        method,
        body: fd
      });
      if (!res.ok) throw new Error('Kaydedilemedi');
      await loadNews();
      form.reset();
      editingId = null;
      modal?.hide();
    } catch (err) {
      if (formAlert) {
        formAlert.textContent = err.message;
        formAlert.classList.remove('d-none');
      }
    }
  });

  tableBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'delete') {
      if (!confirm('Silmek istediğinize emin misiniz?')) return;
      fetch(`${API_BASE}/admin/news/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (!res.ok) throw new Error('Silinemedi');
          return res.json();
        })
        .then(() => loadNews())
        .catch((err) => alert(err.message));
    }
    if (action === 'edit') {
      const item = currentItems.find((x) => x.id === id);
      if (!item) return;
      editingId = id;
      form.title.value = item.title || '';
      form.summary.value = item.summary || '';
      form.date.value = item.date || '';
      form.link.value = item.link || '';
      modal?.show();
    }
  });

  loadNews();
})();
