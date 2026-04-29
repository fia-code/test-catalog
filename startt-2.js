function showToast(msg, duration = 2600) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show'));
  });
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, duration);
}

document.getElementById('doneBtn').addEventListener('click', function () {
  showToast('✓ Redirecting to Lab Requests…');
  setTimeout(() => {
    showToast('Lab Request list loaded.');
  }, 1800);
});

document.querySelectorAll('.nav-link-item').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.nav-link-item').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const page = this.dataset.page || 'Page';
    showToast(`Navigating to ${page}…`);
  });
});

document.getElementById('signOutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('signout-modal').classList.add('open');
});

document.getElementById('cancelSignout').addEventListener('click', function () {
  document.getElementById('signout-modal').classList.remove('open');
});

document.getElementById('confirmSignout').addEventListener('click', function () {
  document.getElementById('signout-modal').classList.remove('open');
  showToast('Signing out…');
  setTimeout(() => showToast('You have been signed out.'), 1400);
});

document.getElementById('signout-modal').addEventListener('click', function (e) {
  if (e.target === this) this.classList.remove('open');
});