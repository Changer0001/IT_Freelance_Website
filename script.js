/* ============================================================
   THEME TOGGLE — dark / light with localStorage + system pref
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');
const htmlEl      = document.documentElement;

function applyTheme(theme, animate) {
  if (animate) {
    htmlEl.classList.add('theme-transitioning');
    setTimeout(() => htmlEl.classList.remove('theme-transitioning'), 350);
  }
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

if (themeToggle) {
  // Sync aria-label with initial theme
  const initial = htmlEl.getAttribute('data-theme') || 'light';
  themeToggle.setAttribute(
    'aria-label',
    initial === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );

  themeToggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });
}

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  mainNav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });
}

/* ============================================================
   STICKY HEADER — shrink & add bg on scroll
   ============================================================ */
const siteHeader = document.getElementById('site-header');

if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  // Skip animation for reduced-motion users — show everything immediately
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
}

/* ============================================================
   CONTACT FORM — demo handler
   ============================================================ */
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');

if (contactForm && formSuccess) {

  function getField(id)      { return document.getElementById(id); }
  function getError(id)      { return document.getElementById(id + '-error'); }
  function setError(id, msg) {
    const field = getField(id);
    const err   = getError(id);
    if (!field || !err) return false;
    if (msg) {
      field.classList.add('is-invalid');
      err.textContent = msg;
      return false;
    }
    field.classList.remove('is-invalid');
    err.textContent = '';
    return true;
  }

  function validateForm() {
    let valid = true;

    const name    = getField('name');
    const email   = getField('email');
    const message = getField('message');

    if (!name || !name.value.trim()) {
      setError('name', 'Please enter your full name.');
      valid = false;
    } else {
      setError('name', '');
    }

    if (!email || !email.value.trim()) {
      setError('email', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    if (!message || !message.value.trim()) {
      setError('message', 'Please describe how I can help.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  }

  // Clear error on input
  ['name', 'email', 'message'].forEach(id => {
    const field = getField(id);
    if (field) {
      field.addEventListener('input', () => setError(id, ''));
    }
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Focus first invalid field
      const firstInvalid = contactForm.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(contactForm)
      });
      const data = await res.json();

      if (data.success) {
        contactForm.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      alert('Something went wrong. Please email yilmmazburak@gmail.com or call (619) 689-8903.');
    }
  });
}

/* ============================================================
   FOOTER — dynamic year
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
