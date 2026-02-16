(() => {
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#1f2937">Orhanpaşa Placeholder</text></svg>'
    );

  const hasBayrampasa = (val) => /bayrampasa/i.test(val || '');

  // Replace only bayrampasa-sourced images
  document.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (hasBayrampasa(src)) {
      img.setAttribute('src', PLACEHOLDER);
    }
  });

  // Neutralize only bayrampasa links
  document.querySelectorAll('a[href]').forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    if (!href) return;
    if (hasBayrampasa(href)) {
      a.setAttribute('href', '#');
      a.addEventListener('click', (e) => e.preventDefault());
    }
  });

  // Text replacements in DOM
  const replaceText = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = node.textContent
        .replace(/Bayrampaşa Belediyesi/gi, 'Orhanpaşa Belediyesi')
        .replace(/Bayrampaşa/gi, 'Orhanpaşa');
    } else {
      node.childNodes.forEach(replaceText);
    }
  };
  replaceText(document.body);
})();
