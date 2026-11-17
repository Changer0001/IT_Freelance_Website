/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const hamburger = document.getElementById('menu-btn');
const mainNav   = document.getElementById('main-nav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
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
   THE PHONE IN THE HERO — one call, played on a loop
   The markup is the last frame (the missed call and the text), so
   the page is complete with no script and with reduced motion.
   Otherwise: the lock screen, the call ringing, the missed call,
   then the text with the job; and round again.
   ============================================================ */
const handset = document.getElementById('handset');

if (handset && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const parts = Array.from(handset.querySelectorAll('[data-at]'));
  // How long each frame is held, in milliseconds: empty, ringing, missed, the text.
  const holds = [900, 2800, 1500, 6000];
  let timer = null;

  const show = step => {
    parts.forEach(part => {
      const from  = Number(part.dataset.at);
      const until = part.dataset.until ? Number(part.dataset.until) : Infinity;
      part.classList.toggle('is-on', step >= from && step < until);
    });
  };

  const play = () => {
    let step = 0;
    show(step);
    const next = () => {
      timer = setTimeout(() => {
        step += 1;
        if (step > 3) { play(); return; }
        show(step);
        next();
      }, holds[step]);
    };
    next();
  };

  // Only while it can be seen: a loop running off screen is wasted work.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      clearTimeout(timer);
      if (entries[0].isIntersecting) play(); else show(3);
    }, { threshold: 0.35 }).observe(handset);
  } else {
    play();
  }
}

/* ============================================================
   IN-PAGE LINKS — a section lands with its first line where the
   page's own first line sits: 68px under the header (32px on a
   phone), whichever section and whichever browser. Without this
   the browser's own placement (scroll-padding-top in site.css)
   still applies.
   ============================================================ */
const landAt = hash => {
  if (hash === '#top') return 0;
  let target = null;
  try { target = document.querySelector(hash); } catch (e) { return null; }
  if (!target) return null;
  const first  = target.matches('.eyebrow, h1, h2, h3') ? target : (target.querySelector('.eyebrow, h1, h2, h3') || target);
  const header = document.getElementById('site-header');
  const under  = window.matchMedia('(max-width: 860px)').matches ? 32 : 68;
  const top    = first.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - under;
  return Math.max(0, Math.round(top));
};

document.addEventListener('click', e => {
  const link = e.target.closest && e.target.closest('a[href^="#"]');
  if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const hash = link.getAttribute('href');
  if (hash.length < 2) return;
  const top = landAt(hash);
  if (top === null) return;
  e.preventDefault();
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: calm ? 'auto' : 'smooth' });
  if (hash !== location.hash) history.pushState(null, '', hash);
  // The keyboard goes with the eye: the next Tab starts from the section.
  const target = hash === '#top' ? null : document.querySelector(hash);
  if (target) {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
});

// Arriving from another page on a link that names a section.
window.addEventListener('load', () => {
  if (location.hash.length < 2) return;
  const top = landAt(location.hash);
  if (top !== null) window.scrollTo({ top, behavior: 'auto' });
});

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
   CONTACT FORM — Web3Forms
   ============================================================ */
const contactForm     = document.getElementById('contact-form');
const formSuccess     = document.getElementById('form-success');
const formSubmitError = document.getElementById('form-submit-error');

if (contactForm && formSuccess) {

  let isSubmitting   = false;
  let lastSubmitTime = 0;
  const RATE_LIMIT_MS = 60_000; // one submission per minute

  /* ── helpers ── */
  const getField = id => document.getElementById(id);
  const getError = id => document.getElementById(id + '-error');

  function setError(id, msg) {
    const field = getField(id);
    const err   = getError(id);
    if (!field || !err) return !msg;
    if (msg) {
      field.classList.add('is-invalid');
      field.setAttribute('aria-describedby', id + '-error');
      err.textContent = msg;
      return false;
    }
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-describedby');
    err.textContent = '';
    return true;
  }

  function showFormError(msg) {
    if (!formSubmitError) return;
    formSubmitError.textContent = msg;
    formSubmitError.hidden = false;
  }

  function clearFormError() {
    if (!formSubmitError) return;
    formSubmitError.textContent = '';
    formSubmitError.hidden = true;
  }

  /* ── validation ── */
  function validateForm() {
    let valid = true;

    const name    = getField('name');
    const email   = getField('email');
    const phone   = getField('phone');
    const message = getField('message');

    // Name — required
    if (!name?.value.trim()) {
      setError('name', 'Please enter your full name.');
      valid = false;
    } else {
      setError('name', '');
    }

    // Email — required, format check
    if (!email?.value.trim()) {
      setError('email', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    // Phone — optional, validate format if provided
    if (phone?.value.trim()) {
      const digits = phone.value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        setError('phone', 'Please enter a valid 10-digit phone number.');
        valid = false;
      } else {
        setError('phone', '');
      }
    } else {
      setError('phone', '');
    }

    // Message — required
    if (!message?.value.trim()) {
      setError('message', 'Please describe how I can help.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  }

  // Clear field error as user types
  ['name', 'email', 'phone', 'message'].forEach(id => {
    getField(id)?.addEventListener('input', () => setError(id, ''));
  });

  /* ── submit button state ── */
  function setSubmitState(loading) {
    const btn = contactForm.querySelector('button[type="submit"]');
    if (!btn) return;
    if (loading) {
      btn._originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Sending…';
    } else {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.innerHTML = btn._originalHTML || 'Send Message';
    }
  }

  /* ── submit handler ── */
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormError();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const wait = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      showFormError(`Please wait ${wait} second${wait !== 1 ? 's' : ''} before submitting again.`);
      return;
    }

    if (!validateForm()) {
      contactForm.querySelector('.is-invalid')?.focus();
      return;
    }

    isSubmitting = true;
    setSubmitState(true);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method : 'POST',
        headers: { 'Accept': 'application/json' },
        body   : new FormData(contactForm)
      });
      const data = await res.json();

      if (data.success) {
        lastSubmitTime = Date.now();
        contactForm.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error(data.message || 'Submission failed.');
      }
    } catch {
      showFormError(
        'Something went wrong sending that. Please email yap.itsupport@gmail.com instead.'
      );
    } finally {
      isSubmitting = false;
      setSubmitState(false);
    }
  });
}

/* ============================================================
   FOOTER — dynamic year
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
