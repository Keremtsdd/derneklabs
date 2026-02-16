(() => {
  const API_BASE = window.CMS_API_BASE || window.location.origin || 'http://localhost:4000';
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#1f2937">Orhanpaşa Placeholder</text></svg>'
    );

  const type = document.body.dataset.type || 'news';
  const typeNames = {
    news: 'Haberler',
    events: 'Etkinlikler',
    announcements: 'Duyurular',
    notices: 'İlanlar',
    documents: 'Belgeler',
    projects: 'Projeler',
    fast_links: 'Hızlı İşlemler',
    videos: 'Videolar'
  };

  const qs = (sel, parent = document) => parent.querySelector(sel);
  const listEl = qs('#list');
  const titleEl = qs('#page-title');
  const emptyEl = qs('#empty');
  const refreshBtn = qs('#refresh-btn');

  const render = (items) => {
    if (!items || items.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('d-none');
      return;
    }
    emptyEl.classList.add('d-none');
    listEl.innerHTML = items.map((item) => {
      const title = item.title || '(Başlık yok)';
      const summary = item.summary || '';
      const date = item.date || '';
      const link = item.link || '#';
      let img = item.image || '';
      if (img && !img.startsWith('http')) {
        img = img.startsWith('/') ? `${API_BASE}${img}` : `${API_BASE}/${img}`;
      }
      if (!img || /^https?:\/\//i.test(img) && img.includes('bayrampasa')) {
        img = PLACEHOLDER;
      }
      const meta = [date].filter(Boolean).join(' • ');
      const thumb = img ? `<div class="thumb mb-2"><img src="${img}" alt="${title}"></div>` : '';
      return `
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            ${thumb}
            <h5 class="card-title" style="font-size:16px;">${title}</h5>
            ${meta ? `<div class="meta mb-2">${meta}</div>` : ''}
            ${summary ? `<p class="card-text" style="font-size:14px;">${summary}</p>` : ''}
            ${link ? `<a class="btn btn-outline-secondary btn-sm" href="${link}" target="_blank" rel="noopener">Kaynağı aç</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  };

  const load = async () => {
    titleEl.textContent = typeNames[type] || 'Liste';
    const res = await fetch(`${API_BASE}/public/${type}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Liste alınamadı');
    const data = await res.json();
    render(data);
  };

  refreshBtn?.addEventListener('click', load);

  load().catch((err) => {
    console.warn(err);
    emptyEl.classList.remove('d-none');
  });
})();
