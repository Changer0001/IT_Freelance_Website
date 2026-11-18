/* The restaurant demo: "find your restaurant, then call it".

   An owner searches for their restaurant, sees what was read from its own
   website, says which phone they will call from, and is told the number
   to call. The work is done by the YAP Voice server (data-api on the
   section); this file only asks it and shows what it answers.

   The section stays hidden unless the server says the demo is available,
   so this file can be on a page while the demo is switched off.

   Search results come from Google Maps. They are shown and nothing else:
   never stored, and the list says where they are from. */
(() => {
  const root = document.getElementById('finder');
  if (!root) return;
  const api = (root.dataset.api || '').replace(/\/$/, '');
  const section = root.closest('[data-demo-section]') || root;
  const $ = name => root.querySelector('[data-finder="' + name + '"]');
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const q = $('q'), results = $('results'), site = $('site'), siteBox = $('site-box'), orPaste = $('or-paste'), searchBox = $('search-box'),
    picked = $('picked'), learned = $('learned'), call = $('call'), tel = $('tel'), go = $('go'), live = $('live');
  const errors = { 1: $('error-1'), 2: $('error-2'), 3: $('error-3') };
  const steps = Array.from(root.querySelectorAll('.finder__step'));

  const SAID = {
    off: 'The demo isn’t available right now. Book a free demo below and we’ll set one up with you.',
    search_down: 'Search isn’t available right now. Paste your restaurant’s website address instead.',
    no_website: 'We couldn’t find a website for that restaurant. Paste its address here instead.',
    unreadable: 'We couldn’t read that website. Check the address, or book a free demo below and we’ll set it up with you.',
    limit_visitor: 'That’s all the tries for now. Please try again later, or book a free demo below.',
    limit_day: 'Today’s tries are used up. Please try again tomorrow, or book a free demo below.',
    limit_search: 'That’s a lot of searches. Please try again later, or paste your website address instead.',
    limit_phone: 'This phone has had its tries for today.',
    full: 'A few demos are running right now. Please try again in a few minutes.',
    bad_phone: 'Enter a US mobile number, like (619) 555-0142.',
    gone: 'That took a little too long. Search again to start over.',
    network: 'We couldn’t reach the server. Please try again in a moment.',
  };

  class Refused extends Error { constructor(code) { super(code); this.code = code; } }
  const ask = async (path, body) => {
    let response;
    try {
      response = await fetch(api + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
    } catch (_) { throw new Refused('network'); }
    let data = null;
    try { data = await response.json(); } catch (_) { /* no body */ }
    if (response.ok && data) return data;
    const code = data && data.detail && data.detail.code;
    throw new Refused(SAID[code] ? code : (response.status === 422 ? 'unreadable' : 'network'));
  };

  const stage = n => steps.forEach((s, i) => s.classList.toggle('is-on', i < n));
  const fail = (step, code) => { const box = errors[step]; box.textContent = SAID[code] || SAID.network; box.hidden = false; };
  const clear = () => Object.values(errors).forEach(box => { box.hidden = true; });
  const wave = () => { const w = el('span', 'finder__wave'); for (let k = 0; k < 4; k++) w.append(el('i')); w.setAttribute('aria-hidden', 'true'); return w; };
  const token = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));

  let session = token(), searching = 0, timer = null, tryId = null, canSearch = false;

  // ---- 1. find --------------------------------------------------------------
  const showPaste = focus => { siteBox.hidden = false; orPaste.hidden = true; if (focus) site.focus(); };
  const list = found => {
    results.textContent = '';
    found.forEach(place => {
      const li = el('li'), b = el('button');
      b.type = 'button'; b.append(el('b', '', place.name)); if (place.where) b.append(el('span', '', place.where));
      b.addEventListener('click', () => prepare({ place_id: place.place_id, session }, place.name, place.where));
      li.append(b); results.append(li);
    });
    if (found.length) {
      // Google's attribution rules: the words "Google Maps", unchanged and untranslated.
      const from = el('li', 'finder__attr', 'Google Maps'); from.setAttribute('translate', 'no'); results.append(from);
    }
    results.hidden = !found.length;
  };
  const search = async () => {
    const text = q.value.trim();
    if (text.length < 3) { list([]); return; }
    const mine = ++searching;
    try {
      const data = await ask('/api/demo/search', { text, session });
      if (mine === searching) list(data.suggestions || []);
    } catch (refused) {
      if (mine !== searching) return;
      list([]); fail(1, refused.code);
      if (refused.code === 'search_down' || refused.code === 'limit_search') showPaste(false);
    }
  };
  q.addEventListener('input', () => { clear(); clearTimeout(timer); timer = setTimeout(search, 320); });
  q.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const first = results.querySelector('button'); if (first) first.click(); } });
  orPaste.addEventListener('click', () => showPaste(true));
  $('site-go').addEventListener('click', () => { const address = site.value.trim(); if (address) prepare({ website: address }, address, ''); });
  site.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('site-go').click(); } });

  const reset = () => {
    clear(); session = token(); searching++; tryId = null;
    q.value = ''; site.value = ''; list([]);
    picked.hidden = true; learned.hidden = true; call.hidden = true; live.hidden = true;
    searchBox.hidden = !canSearch; siteBox.hidden = canSearch; orPaste.hidden = !canSearch;
    stage(1); (canSearch ? q : site).focus();
  };

  // ---- 2. what it learned -------------------------------------------------------
  const clock = t => { const [h, m] = t.split(':').map(Number); return (h % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h < 12 ? ' AM' : ' PM'); };
  const said = open => open === 'closed' ? 'closed' : open.split(' and ').map(range => range.split(' to ').map(clock).join(' to ')).join(' and ');
  const week = hours => {
    // Days in a row with the same hours are said once: "Tue to Sun: 5 PM to 10 PM".
    const runs = [];
    hours.forEach(day => {
      const last = runs[runs.length - 1], text = said(day.open), name = day.day.slice(0, 3);
      if (last && last.text === text) last.to = name; else runs.push({ from: name, to: name, text });
    });
    return runs.map(run => (run.from === run.to ? run.from : run.from + ' to ' + run.to) + ': ' + run.text);
  };
  const fact = (dl, label, value, missing) => {
    const row = el('div'), dd = el('dd', missing ? 'is-missing' : '');
    if (Array.isArray(value)) value.forEach((line, i) => { if (i) dd.append(el('br')); dd.append(line); }); else dd.textContent = value;
    row.append(el('dt', '', label), dd); dl.append(row);
  };
  const show = data => {
    learned.textContent = '';
    const dl = el('dl', 'finder__facts');
    fact(dl, 'Name', data.name);
    if (data.address) fact(dl, 'Address', data.address); else fact(dl, 'Address', 'Not found on the website', true);
    if (data.hours_found) fact(dl, 'Hours', week(data.hours)); else fact(dl, 'Hours', 'Not found on the website', true);
    if (data.menu_found) fact(dl, 'Menu', data.dishes.length + (data.dishes.length === 1 ? ' dish: ' : ' dishes: ') + data.dishes.map(d => d.name).join(', '));
    else fact(dl, 'Menu', 'Not found. A menu posted as a photo or a PDF can’t be read.', true);
    learned.append(dl, el('p', 'finder__small', 'This is all it will answer from. Asked anything else, it says it doesn’t know. No prices are read.'));
  };
  const prepare = async (body, name, where) => {
    clear(); searching++; list([]);
    searchBox.hidden = true; siteBox.hidden = true; orPaste.hidden = true;
    picked.textContent = '';
    const again = el('button', 'finder__again', 'Not yours? Search again'); again.type = 'button'; again.addEventListener('click', reset);
    picked.append(el('b', '', name)); if (where) picked.append(el('span', '', where)); picked.append(again); picked.hidden = false;
    stage(2); call.hidden = true; live.hidden = true;
    learned.textContent = ''; learned.hidden = false;
    const reading = el('p', 'finder__reading'); reading.append(wave(), el('span', '', 'Reading the website. This can take up to a minute…')); learned.append(reading);
    try {
      const data = await ask('/api/demo/prepare', body);
      tryId = data.id; show(data); stage(3); call.hidden = false; tel.focus();
    } catch (refused) {
      learned.hidden = true; stage(1);
      if (refused.code === 'no_website' || refused.code === 'search_down') { picked.hidden = true; siteBox.hidden = false; fail(1, refused.code); site.focus(); }
      else if (refused.code === 'unreadable' && body.website) { picked.hidden = true; siteBox.hidden = false; fail(1, refused.code); }
      else fail(1, refused.code);
    }
  };

  // ---- 3. call it ---------------------------------------------------------------
  const pretty = number => { const d = String(number).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, ''); return d.length === 10 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6) : number; };
  const ready = async () => {
    clear();
    const phone = tel.value.trim();
    if (phone.replace(/\D/g, '').length < 10) { fail(3, 'bad_phone'); tel.focus(); return; }
    go.disabled = true;
    try {
      const made = await ask('/api/demo/ready', { id: tryId, phone });
      call.hidden = true; live.textContent = ''; live.hidden = false;
      const dial = el('p', 'finder__dial'), link = el('a', '', 'Call ' + pretty(made.call)); link.href = 'tel:' + made.call; dial.append(link);
      const asks = el('ul', 'finder__asks'); ['“Are you open on Monday?”', '“What’s on the menu?”', '“Can I book a table for four on Friday?”'].forEach(a => asks.append(el('li', '', a)));
      const again = el('button', 'finder__again', 'Try another restaurant'); again.type = 'button'; again.addEventListener('click', reset);
      live.append(el('p', 'finder__label', 'Ready for the next ' + made.minutes + ' minutes'), dial,
        el('p', 'finder__small', 'from ' + pretty(phone) + '. It answers as ' + made.name + ' and says it is a demonstration. Nothing you say on it is sent to anyone.'),
        el('p', 'finder__label', 'Ask it'), asks, again);
    } catch (refused) {
      if (refused.code === 'gone') { reset(); fail(1, 'gone'); } else fail(3, refused.code);
    } finally { go.disabled = false; }
  };
  go.addEventListener('click', ready);
  tel.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ready(); } });

  // ---- is it there at all ---------------------------------------------------------
  ask('/api/demo/status').then(status => {
    if (!status.available) { root.dispatchEvent(new CustomEvent('demo:off')); return; }
    canSearch = !!status.search;
    searchBox.hidden = !canSearch; siteBox.hidden = canSearch; orPaste.hidden = !canSearch;
    section.hidden = false;
    root.dispatchEvent(new CustomEvent('demo:on'));
  }).catch(() => root.dispatchEvent(new CustomEvent('demo:off')));
})();
