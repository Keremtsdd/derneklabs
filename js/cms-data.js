(() => {
  const API_BASE = window.CMS_API_BASE || window.location.origin || 'http://localhost:4000';

  const safeFetch = async (path) => {
    const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${path} isteği başarısız`);
    return res.json();
  };

  const fmtDate = (value) => {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#1f2937">Orhanpaşa Placeholder</text></svg>'
    );

  const absUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url.includes('bayrampasa') ? PLACEHOLDER : url;
    }
    if (url.startsWith('/')) return `${API_BASE}${url}`;
    return `${API_BASE}/${url}`;
  };

  const renderBanners = (items) => {
    const bannerEl = document.querySelector('.buyuk-slider');
    if (!bannerEl || !items?.length) return;
    bannerEl.innerHTML = items.map((item) => {
      const img = absUrl(item.image);
      const alt = item.title || 'Slider';
      const content = `<img src="${img}" class="rounded-3" alt="${alt}">`;
      return `<div class="item">${item.link ? `<a href="${item.link}" target="_blank" aria-label="${alt}">${content}</a>` : content}</div>`;
    }).join('');
  };

  const renderNews = (items) => {
    const el = document.querySelector('.haber-slider');
    if (el) el.innerHTML = '';
    if (!el || !items?.length) return;
    el.innerHTML = items.slice(0, 40).map((item) => {
      const img = absUrl(item.image);
      const title = item.title || '';
      const link = item.link || '#';
      return `<div class="item">
        <a href="${link}" class="text-decoration-none" aria-label="Haber: ${title}">
          <div class="m-kart card border-0">
            <img src="${img}" class="card-img-top rounded-3" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
            </div>
          </div>
        </a>
      </div>`;
    }).join('');
  };

  const renderEvents = (items) => {
    const el = document.querySelector('#etkinlik-tab .video-slider');
    if (!el || !items?.length) return;
    el.innerHTML = items.slice(0, 40).map((item) => {
      const img = absUrl(item.image);
      const title = item.title || '';
      const link = item.link || '#';
      const date = fmtDate(item.date);
      return `<div class="items">
        <a href="${link}" class="text-decoration-none" aria-label="Etkinlik: ${title}">
          <div class="m-kart card border-0">
            <img src="${img}" class="card-img-top rounded-3" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
              <p class="small"><time>${date}</time></p>
            </div>
          </div>
        </a>
      </div>`;
    }).join('');
  };

  const renderVideos = (items) => {
    const el = document.querySelector('#video-tab .video-slider');
    if (!el || !items) return;
    if (!items.length) {
      el.innerHTML = '<p>Hiç video bulunamadı.</p>';
      return;
    }
    el.innerHTML = items.slice(0, 40).map((item) => {
      const title = item.title || '';
      const link = item.link || '#';
      const img = item.image ? absUrl(item.image) : 'https://img.youtube.com/vi/' + (link.split('v=')[1] || link).replace(/[^a-zA-Z0-9_-].*$/, '') + '/hqdefault.jpg';
      return `<div class="items">
        <a href="${link}" class="text-decoration-none" aria-label="Video: ${title}" target="_blank" rel="noopener">
          <div class="m-kart card border-0">
            <img src="${img}" class="card-img-top rounded-3" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
            </div>
          </div>
        </a>
      </div>`;
    }).join('');
  };

  const renderListGroup = (selector, items) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = '';
    if (!el || !items) return;
    if (!items.length) {
      el.innerHTML = `<li class="list-group-item">Kayıt yok</li>`;
      return;
    }
    el.innerHTML = items.slice(0, 20).map((item) => {
      const title = item.title || '';
      const link = item.link || '#';
      const date = fmtDate(item.date);
      return `<li class="list-group-item">
        <a href="${link}" aria-label="${title}">${title}</a>
        ${date ? `<div class="tab-tarih small"><i class="far fa-clock" aria-hidden="true"></i> <time>${date}</time></div>` : ''}
      </li>`;
    }).join('');
  };

  const renderGrid = (selector, items) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = '';
    if (!el || !items) return;
    if (!items.length) {
      el.innerHTML = '<p class="text-muted">Kayıt yok.</p>';
      return;
    }
    el.innerHTML = items.map((item) => {
      const title = item.title || '(Başlık yok)';
      const summary = item.summary || '';
      const date = fmtDate(item.date);
      const link = item.link || '#';
      const img = absUrl(item.image);
      const meta = date ? `<div class="meta mb-2">${date}</div>` : '';
      const thumb = img ? `<div class="thumb mb-2"><img src="${img}" alt="${title}"></div>` : '';
      return `<div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            ${thumb}
            <h5 class="card-title" style="font-size:16px;">${title}</h5>
            ${meta}
            ${summary ? `<p class="card-text" style="font-size:14px;">${summary}</p>` : ''}
            ${link ? `<a class="btn btn-outline-secondary btn-sm" href="${link}" target="_blank" rel="noopener">Kaynağı aç</a>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');
  };

  const renderFastLinks = (items) => {
    const row = document.querySelector('.hizli-menu-beltr .row');
    if (!row) return;
    if (!items || !items.length) {
      row.innerHTML = '<div class="col-12 text-center text-muted py-3">Kayıt yok.</div>';
      return;
    }
    row.innerHTML = items.slice(0, 12).map((item) => {
      const title = item.title || '';
      const link = item.link || './pages/fast-links.html';
      const img = absUrl(item.image);
      return `<div class="col-md-3 col-6">
        <a href="${link}" class="text-decoration-none" aria-label="Hızlı işlem: ${title}">
          <div class="servis text-center p-2">
            <img src="${img}" alt="Hızlı işlem görseli: ${title}" class="img-fluid">
            <h3 class="text-danger">${title}</h3>
          </div>
        </a>
      </div>`;
    }).join('');
  };

  const renderProjects = (items) => {
    const el = document.querySelector('.proje-slider');
    if (!el || !items?.length) return;
    el.innerHTML = items.slice(0, 16).map((item) => {
      const title = item.title || '';
      const link = item.link || '#';
      const img = absUrl(item.image);
      return `<a href="${link}" title="${title}" class="text-decoration-none" aria-label="${title}">
        <div class="item">
          <div class="card border-0">
            <img src="${img}" class="card-img-top rounded-3" alt="${title}">
            <div class="card-body">
              <h5 class="card-title">${title}</h5>
            </div>
          </div>
        </div>
      </a>`;
    }).join('');
  };

  const hydrate = async () => {
    try {
      const [
        banners,
        news,
        events,
        announcements,
        notices,
        documents,
        projects,
        fastLinks,
        videos
      ] = await Promise.all([
        safeFetch('/public/banners'),
        safeFetch('/public/news'),
        safeFetch('/public/events'),
        safeFetch('/public/announcements'),
        safeFetch('/public/notices'),
        safeFetch('/public/documents'),
        safeFetch('/public/projects'),
        safeFetch('/public/fast_links'),
        safeFetch('/public/videos')
      ]);

      renderBanners(banners);
      renderNews(news);
      renderEvents(events);
      renderVideos(videos);
      renderListGroup('#announcements-list', announcements);
      renderListGroup('#d2-tab ul.list-group', notices);
      renderListGroup('#d3-tab ul.list-group', documents);
      renderFastLinks(fastLinks);
      renderProjects(projects);

      // Full page grids if present
      renderGrid('#news-grid', news);
      renderGrid('#announcements-grid', announcements);

      if (window.SliderAPI?.refreshAll) {
        window.SliderAPI.refreshAll();
      }
    } catch (err) {
      console.warn('CMS verisi alınamadı:', err.message);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }
})();
