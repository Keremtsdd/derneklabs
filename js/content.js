(() => {
  const API_BASE = window.CMS_API_BASE || window.location.origin || 'http://localhost:4000';

  const params = new URLSearchParams(window.location.search);
  const initialType = params.get('t') || 'news';

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
  const emptyEl = qs('#empty');
  const pageTitle = qs('#page-title');
  const refreshBtn = qs('#refresh-btn');

  const render = (items, type) => {
    if (!items || !items.length) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('d-none');
      return;
    }
    emptyEl.classList.add('d-none');
    const cards = items.map((item) => {
      const title = item.title || '(Başlık yok)';
      const summary = item.summary || '';
      const date = item.date || '';
      const link = item.link || '#';
      const img = item.image || '';
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
    listEl.innerHTML = cards;
  };

  const load = async (type) => {
    pageTitle.textContent = typeNames[type] || 'Liste';
    const res = await fetch(`${API_BASE}/public/${type}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Liste alınamadı');
    const data = await res.json();
    render(data, type);
  };

  const switchType = (type) => {
    window.history.replaceState({}, '', `?t=${type}`);
    load(type).catch((err) => {
      listEl.innerHTML = '';
      emptyEl.classList.remove('d-none');
      console.warn(err);
    });
    document.querySelectorAll('[data-type]').forEach((btn) => {
      btn.classList.toggle('btn-primary', btn.dataset.type === type);
      btn.classList.toggle('btn-outline-secondary', btn.dataset.type !== type);
    });
  };

  document.querySelectorAll('[data-type]').forEach((btn) => {
    btn.addEventListener('click', () => switchType(btn.dataset.type));
  });

  refreshBtn?.addEventListener('click', () => {
    const type = new URLSearchParams(window.location.search).get('t') || 'news';
    switchType(type);
  });

  switchType(initialType);
})();
