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
   THE PHONE IN THE HERO — one call, played on a loop, in the three
   steps written under it:
     1  a customer calls and the owner cannot pick up   (frame 1)
     2  YAP Voice answers; the call, a line a frame     (frames 2 to 10)
     3  the owner gets the text, then the email         (frames 11, 12)
   The markup is the last frame, so the page is complete with no
   script and with reduced motion.
   ============================================================ */
const handset = document.getElementById('handset');
const phone   = document.getElementById('call-story');

if (handset && phone && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const parts = Array.from(phone.querySelectorAll('[data-at]'));
  const steps = Array.from(phone.querySelectorAll('[data-now]'));
  // How long each frame is held, in milliseconds: the quiet screen, the ring,
  // the nine lines of the call (long enough to read each), the text, the email.
  const holds = [900, 2400, 3600, 2200, 1900, 1400, 1500, 1500, 2700, 1400, 3400, 2600, 6500];
  const TEXT  = 11;   // the frame the text arrives on: the call is over
  const LAST  = holds.length - 1;
  let timer = null;

  // The call's own clock, in the sheet's heading: it starts when the assistant
  // answers (frame 2) and counts a second a second until the text arrives.
  const clock = document.getElementById('call-time');
  let ticking = null, seconds = 0;
  const tick = on => {
    clearInterval(ticking); ticking = null;
    if (!clock) return;
    if (!on) return;
    seconds = 0; clock.textContent = '0:00';
    ticking = setInterval(() => {
      seconds += 1;
      clock.textContent = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    }, 1000);
  };

  const show = (step, playing) => {
    parts.forEach(part => {
      const from  = Number(part.dataset.at);
      const until = part.dataset.until ? Number(part.dataset.until) : Infinity;
      part.classList.toggle('is-on', step >= from && step < until);
      // The line being said: the one this frame brought in.
      part.classList.toggle('is-speaking', playing && from === step && part.classList.contains('handset__say'));
    });
    if (step === 2 && playing) tick(true);
    if (step < 2 || step >= TEXT || !playing) tick(false);
    // Which written step is being played. None is marked when the loop is not running.
    steps.forEach(li => li.classList.toggle('is-now', playing && li.dataset.now.split(' ').includes(String(step))));
  };

  const play = () => {
    let step = 0;
    show(step, true);
    const next = () => {
      timer = setTimeout(() => {
        step += 1;
        if (step > LAST) { play(); return; }
        show(step, true);
        next();
      }, holds[step]);
    };
    next();
  };

  // Only while it can be seen: a loop running off screen is wasted work.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      clearTimeout(timer);
      if (entries[0].isIntersecting) play(); else show(LAST, false);
    }, { threshold: 0.35 }).observe(handset);
  } else {
    play();
  }
}

/* ============================================================
   THE DASHBOARD IN "YOUR DASHBOARD" — played by itself, like the
   phone: the callback from that call lands, its Call button is
   pressed, it is marked called back; then Calls, Overview with its
   figures counting up, and Services. The point in the list beside
   it that a scene shows is marked while it plays.
   Picking a tab stops it for good: the page is the visitor's. With
   no script or with reduced motion the markup's resting frame shows.
   ============================================================ */
const dash = document.getElementById('dash-story');

if (dash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const box    = dash.querySelector('.mock__frame');
  const row    = dash.querySelector('.mock__row--new');
  const button = row.querySelector('.mock__call');
  const pages  = Array.from(dash.querySelectorAll('.mock__page'));
  const counts = Array.from(dash.querySelectorAll('[data-count]'));
  const points = Array.from(document.querySelectorAll('#dashboard .ticks [data-scene]'));
  // Scene by scene: which page is shown, and for how long (milliseconds).
  //   0 the list before the call   1 the callback lands   2 Call is pressed
  //   3 marked called back         4 Calls                5 Overview   6 Services
  const tabs  = ['callbacks', 'callbacks', 'callbacks', 'callbacks', 'calls', 'overview', 'services'];
  const holds = [1300, 2600, 900, 2600, 4400, 4800, 4600];
  let timer = null, frame = null, stopped = false;

  const write = (el, value) => {
    const n = Math.round(value);
    el.textContent = el.dataset.fmt === 'pct' ? n + '%'
                   : el.dataset.fmt === 'dur' ? Math.floor(n / 60) + 'm ' + (n % 60) + 's'
                   : String(n);
  };
  const countUp = () => {
    const began = performance.now();
    const step = now => {
      const t = Math.min(1, (now - began) / 1100), eased = 1 - Math.pow(1 - t, 3);
      counts.forEach(el => write(el, Number(el.dataset.count) * eased));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(step);
  };

  // The frame the markup was written as: every row there, nothing marked.
  const rest = () => {
    clearTimeout(timer); cancelAnimationFrame(frame);
    row.classList.remove('is-hidden', 'is-new', 'is-done');
    button.classList.remove('is-pressed');
    pages.forEach(page => page.classList.remove('is-fresh'));
    counts.forEach(el => write(el, Number(el.dataset.count)));
    points.forEach(point => point.classList.remove('is-now'));
  };

  const show = scene => {
    const tab = tabs[scene];
    dash.querySelector('#mock-' + tab).checked = true;
    row.classList.toggle('is-hidden', scene === 0);
    row.classList.toggle('is-new', scene === 1 || scene === 2);
    button.classList.toggle('is-pressed', scene === 2);
    row.classList.toggle('is-done', scene >= 3);
    pages.forEach(page => page.classList.toggle('is-fresh', scene >= 4 && page.classList.contains('mock__page--' + tab)));
    if (scene === 5) countUp(); else { cancelAnimationFrame(frame); counts.forEach(el => write(el, Number(el.dataset.count))); }
    points.forEach(point => point.classList.toggle('is-now', point.dataset.scene.split(' ').includes(String(scene))));
  };

  const play = () => {
    let scene = 0;
    show(scene);
    const next = () => {
      timer = setTimeout(() => {
        scene = (scene + 1) % tabs.length;
        show(scene);
        next();
      }, holds[scene]);
    };
    next();
  };

  // The visitor picks a page (a click on a tab, or the arrow keys): it is theirs from here.
  const stop = () => { if (stopped) return; stopped = true; rest(); };
  dash.querySelector('.mock__tabs').addEventListener('pointerdown', stop);
  dash.querySelectorAll('.mock__pick').forEach(pick => {
    pick.addEventListener('keydown', stop);
    pick.addEventListener('change', stop);   // only a person's choice fires this, never the script's
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (stopped) return;
      if (!entries[0].isIntersecting) { rest(); return; }
      // The frame keeps the height it has with every row there, so the page
      // under it does not move when the first scene takes a row away.
      rest(); box.style.minHeight = ''; box.style.minHeight = box.offsetHeight + 'px';
      play();
    }, { threshold: 0.4 }).observe(dash);
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

// Landed, then checked. A smooth scroll is aimed once, at the start; if the
// page above the section changes height on the way, or the browser stops
// the scroll short, the section ends up low with a strip of the one before
// it showing under the header. So once the page has stopped moving, the
// place is measured again and put right. The visitor's own scrolling
// (wheel, touch, keys) calls the check off: the page is theirs.
let settling = 0;
const settle = (hash, tries) => {
  const mine = ++settling;
  let lastY = window.scrollY, still = 0;
  const check = () => {
    if (mine !== settling) return;
    if (window.scrollY !== lastY) { lastY = window.scrollY; still = 0; }
    else if (++still >= 12) {
      const want = landAt(hash);
      const most = document.documentElement.scrollHeight - window.innerHeight;
      if (want !== null && tries > 0 && Math.abs(Math.min(want, most) - window.scrollY) > 1) {
        window.scrollTo({ top: want, behavior: 'auto' });
        settle(hash, tries - 1);
      }
      return;
    }
    requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
};
['wheel', 'touchstart', 'keydown'].forEach(kind =>
  window.addEventListener(kind, () => { settling += 1; }, { passive: true }));

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
  settle(hash, 3);
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
  if (top !== null) { window.scrollTo({ top, behavior: 'auto' }); settle(location.hash, 3); }
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
