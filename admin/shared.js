(() => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    if (!location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    }
    return;
  }

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    window.location.href = 'login.html';
  });

  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.textContent = 'admin';
})();
