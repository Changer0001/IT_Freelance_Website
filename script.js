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
