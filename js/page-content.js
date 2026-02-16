(() => {
  const API_BASE = window.CMS_API_BASE || 'http://localhost:4000';
  const slug = document.body.dataset.slug;
  if (!slug) return;

  const titleEl = document.getElementById('page-title');
  const bodyEl = document.getElementById('page-body');
  const emptyEl = document.getElementById('empty');

  const render = (page) => {
    if (!page) {
      if (emptyEl) emptyEl.classList.remove('d-none');
      return;
    }
    if (titleEl && page.title) titleEl.textContent = page.title;
    if (bodyEl) bodyEl.innerHTML = page.body || '';
  };

  const loadPage = async () => {
    try {
      const res = await fetch(`${API_BASE}/public/pages/${slug}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('İçerik bulunamadı');
      const data = await res.json();
      render(data);
    } catch (err) {
      if (emptyEl) emptyEl.classList.remove('d-none');
    }
  };

  loadPage();
})();
