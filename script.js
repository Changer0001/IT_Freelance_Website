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
   TRY IT — a chat whose answers are written in advance
   Nothing is sent anywhere: each chip shows its question and the
   answer below, which is wording already on this page. Text is set
   with textContent, never innerHTML.
   ============================================================ */
const DEMO_ANSWERS = {
  calls: [
    "Your phone rings first. If you don't pick up in the time you choose — or you're closed — I answer.",
    "I say I'm your business's automated assistant, answer from what you've told me — hours, services, the area you cover — then take their name, number and what they need, and text it to you.",
  ],
  person: [
    "Yes. Every call starts with me saying I'm your business's automated assistant. If someone asks whether they're talking to a robot, I answer plainly.",
  ],
  after: [
    "A text and an email as soon as the call ends, with the essentials — something like this:",
    { sample: ['New enquiry for Harbor View Handyman', 'Services: TV mounting', 'Name: Jordan Blake', 'Phone: +15550100142', 'preferred date: Friday'] },
    "It also waits in your dashboard with a button to call them back. (That one's an example — made-up business, made-up caller.)",
  ],
  number: [
    "No. You keep the number your customers know and forward the calls you want me to answer — every call, after hours only, or when you don't pick up.",
  ],
  cost: [
    "Pricing depends on your call volume. We set it up with you — your services, hours and the questions you want asked — and you get a quote before anything is switched on.",
  ],
};

const demoLog = document.getElementById('demo-log');
const demoChips = document.getElementById('demo-chips');

if (demoLog && demoChips) {
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bubble = (who, content) => {
    const li = document.createElement('li');
    li.className = `bubble bubble--${who}`;
    if (typeof content === 'string') {
      li.textContent = content;
    } else {
      li.classList.add('bubble--sample');
      content.sample.forEach(line => {
        const row = document.createElement('span');
        row.textContent = line;
        li.appendChild(row);
      });
    }
    demoLog.appendChild(li);
    demoLog.scrollTop = demoLog.scrollHeight;
    return li;
  };

  let busy = false;
  demoChips.querySelectorAll('button[data-q]').forEach(chip => {
    chip.addEventListener('click', async () => {
      const answer = DEMO_ANSWERS[chip.dataset.q];
      if (busy || !answer) return;
      busy = true;
      chip.disabled = true;
      bubble('you', chip.textContent);
      for (const part of answer) {
        if (!quiet) {
          const typing = bubble('them', '…');
          typing.classList.add('bubble--typing');
          typing.setAttribute('aria-hidden', 'true');
          await new Promise(done => setTimeout(done, 650));
          typing.remove();
        }
        bubble('them', part);
      }
      busy = false;
    });
  });
}

/* ============================================================
   FOOTER — dynamic year
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
