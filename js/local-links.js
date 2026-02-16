(() => {
  const mapToLocal = (href) => {
    const h = href.toLowerCase();
    if (h.includes('etkin')) return './pages/events.html';
    if (h.includes('proje')) return './pages/projects.html';
    if (h.includes('ilan')) return './pages/notices.html';
    if (h.includes('belge') || h.includes('doc')) return './pages/documents.html';
    if (h.includes('hizli') || h.includes('islem') || h.includes('odeme') || h.includes('ebelediye')) return './pages/fast-links.html';
    if (h.includes('video') || h.includes('youtube')) return './pages/videos.html';
    if (h.includes('haber')) return './pages/news.html';
    if (h.includes('duyuru')) return './pages/announcements.html';
    if (h.includes('galeri')) return './pages/projects.html';
    if (h.includes('kvkk')) return './pages/kvkk.html';
    if (h.includes('hizmet-merkez')) return './pages/hizmet-merkezleri.html';
    if (h.includes('iletisim')) return './pages/iletisim.html';
    if (h.includes('hakkinda') || h.includes('about') || h.includes('orhanpasa')) return './pages/about.html';
    return './';
  };

  const isExternal = (href) => /^https?:\/\//i.test(href);

  document.querySelectorAll('a[href]').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href) return;
    if (isExternal(href)) {
      const local = mapToLocal(href);
      a.setAttribute('href', local);
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  });
})();
