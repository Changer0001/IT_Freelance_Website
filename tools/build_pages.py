#!/usr/bin/env python3
"""Make the page for each kind of business, and the menu's calls, from index.html.

    python3 tools/build_pages.py

index.html is the one page written by hand. Each kind of business in the
"Business type" menu gets a page of its own made from it: the same page with
that trade's call on the phone, its text, its rows in the dashboard and its
questions. A restaurant's page also swaps the sections whose words are about
jobs and callbacks for ones about bookings, because a restaurant's calls are a
different kind of call.

    for-restaurants.html  for-handymen.html  for-cleaning.html
    for-auto-repair.html  for-it-support.html
    types.js   (what the menu's small card says about each type)

THE STORY AT THE TOP OF EVERY PAGE (story.css, story.js) shows one call on a
phone, step by step. Its words and its five phone screens are written by this
script from the same made-up call each page uses everywhere else, into the
marked blocks of index.html too (the home page shows the handyman's call), so
the phone can never say something the rest of the page does not. Every page
plays the same film behind the phone (img/story/, tradespeople): the owner
chose the film on every page over a still picture (28 Nov). A trade taken out
of FILMED below shows its own picture instead, held still.

RUN IT AFTER ANY CHANGE TO index.html, and commit what it writes. Every
replacement is checked: if index.html no longer holds the words this expects,
the script stops and names them, so a page is never quietly left half-changed.

The businesses, people and numbers are invented, and each page says so under
its pictures. Numbers are 555-01xx, the block kept for examples.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://yap-itsupport.com/'
OPENING = "Thanks for calling {biz}. I'm the AI assistant here, and I'll take down what you need."
CALLER = '(619) 555-0142'       # the made-up caller on every page: 555-01xx, the block kept for examples
DEMO_LINE = ('+18314327547', '831-432-7547')   # the one real number on the site
FILMED = {'restaurants', 'handyman', 'cleaning', 'auto', 'it'}   # the trades whose page plays the film; index.html plays it too


def service(file, name, eyebrow, title, describe, biz, where, short, need, ask, answer, field, value, job, person, rows, services, notes):
    """A business that takes enquiries: the caller says what they need, the assistant asks the business's own question."""
    first = person.split()[0]
    return dict(
        kind='service', file=file, name=name, eyebrow=eyebrow, title=title, describe=describe, biz=biz, where=where, short=short,
        ask=ask, field=field, value=value, job=job, person=person, rows=rows, services=services, notes=notes, time='4:12', them='Customer',
        call=[OPENING.format(biz=biz), need, 'Sure. ' + ask, answer, 'And your name?', person + '.',
              'Is 619 555 0142 the best number to call you back on?', "Yes, that's it.",
              f"Thanks, {first}. I've passed that on, and {biz} will call you back."],
        sms=[f'YAP Voice: New enquiry for {biz}', f'Services: {job}', f'Name: {person}', 'Phone: +16195550142', f'{field}: {value}'],
        mail=f'New enquiry — {biz}',
    )


# The questions the menu's small card shows for each type, one after another. The first is the
# question that type's own page shows on the phone.
ASKS = {
    'restaurants': ['For how many people?', 'What time on Friday?', 'What name is the booking under?', 'Any children in the party?'],
    'handyman': ['What size is the TV?', 'Which day suits you?', 'What kind of wall is it going on?'],
    'cleaning': ['How many bedrooms?', 'Is it a move-out or a regular clean?', 'Which day suits you?'],
    'auto': ['What car is it?', 'What is it doing?', 'When can you bring it in?'],
    'it': ['What kind of device is it?', 'Is it one computer or the whole office?', 'When did it start?'],
}


TYPES = {
    'restaurants': dict(
        kind='restaurant', file='for-restaurants.html', name='Restaurants', eyebrow='For restaurants',
        title='AI phone receptionist for restaurants | YAP Voice',
        describe="YAP Voice answers your restaurant's phone when you can't. It answers guests' questions, takes their booking request and texts and emails it to you to confirm.",
        biz='Cedar Grill', time='7:42', them='Guest', ask='For how many people?',
        # The assistant is not connected to OpenTable or any other booking system, so the third
        # line says only what is true: nothing has to be replaced.
        notes=['Takes booking requests, changes and cancellations by phone', 'Says "requested", never "booked": you confirm each one',
               'Keep OpenTable or your paper book. Nothing to replace'],
        call=[OPENING.format(biz='Cedar Grill'), 'Hi, can I book a table for Friday night?', 'Of course. For how many people?', 'Four of us.',
              'And what time on Friday?', "Seven o'clock.", 'What name is the booking under?', 'Maria Lopez.',
              "That's requested: a table for four, Friday at 7 PM, under Maria Lopez. Cedar Grill will confirm it with you."],
        sms=['YAP Voice: New reservation request for Cedar Grill: Maria Lopez, party of 4, 2026-11-20 at 19:00. Phone: +16195550142.'],
        mail='New reservation request — Cedar Grill',
        # the story's phone: what was taken down, and the list the owner confirms from
        person='Maria Lopez', request='Table for 4', when='Friday at 7 PM',
        requests=[('Maria Lopez', 'Table for 4 · Fri 7:00 PM'), ('Daniel Reyes', 'Table for 2 · Sat 6:30 PM'), ('Aisha Rahman', 'Table for 6 · Sat 8:00 PM')],
    ),
    'handyman': service(
        'for-handymen.html', 'Handyman', 'For handymen', 'AI phone receptionist for handymen | YAP Voice',
        "YAP Voice answers your line when you're on a job. It takes the caller's name, number and what they need, asks your own questions, and texts and emails it to you.",
        'Harbor View Handyman', 'on a job, after hours, with a customer in front of you', 'on a job',
        'Hi, I need a TV mounted on the wall.', 'What size is the TV?', '65 inch.', 'tv size', '65 inch', 'TV mounting', 'Jordan Blake',
        [('SO', 'Sam Okafor', 'Yesterday 5:40 PM', 'Basic plumbing', ('where', 'kitchen sink'), True, '(619) 555-0163'),
         ('PN', 'Priya Natarajan', 'Mon 9:05 AM', 'Drywall repair', None, False, '(619) 555-0187')],
        [('TV mounting', ['What size is the TV?', 'Which day suits you?']), ('Drywall repair', ['Roughly how big is the damaged area?'])],
        ['Takes the job, the name and the number while you work', 'Asks your own question for each kind of job', 'Keep the app or notebook you schedule with. Nothing to replace']),
    'cleaning': service(
        'for-cleaning.html', 'Cleaning', 'For cleaning businesses', 'AI phone receptionist for cleaning businesses | YAP Voice',
        "YAP Voice answers your line when you're mid-clean. It takes the caller's name, number and what they need, asks your own questions, and texts and emails it to you.",
        'Bayside Cleaning', 'mid-clean, driving between jobs, after hours', 'mid-clean',
        'Hi, I need a move-out clean for my apartment.', 'How many bedrooms?', 'Three.', 'bedrooms', '3', 'Move-out clean', 'Erin Walsh',
        [('ML', 'Marcus Lee', 'Yesterday 5:40 PM', 'Office clean', ('when', 'tomorrow morning'), True, '(619) 555-0163'),
         ('DO', 'Dana Ortiz', 'Mon 9:05 AM', 'Deep clean', None, False, '(619) 555-0187')],
        [('Move-out clean', ['How many bedrooms?', 'Which day suits you?']), ('Office clean', ['Roughly how many square feet?'])],
        ['Takes the enquiry while you are mid-clean or driving', 'Asks what you need to quote: bedrooms, type of clean', 'Flags a caller who says it is urgent']),
    'auto': service(
        'for-auto-repair.html', 'Auto repair', 'For auto repair', 'AI phone receptionist for auto repair shops | YAP Voice',
        "YAP Voice answers your shop's line when you're under a car. It takes the caller's name, number and what they need, asks your own questions, and texts and emails it to you.",
        'Mesa Auto Repair', 'under a car, on a test drive, after hours', 'under a car',
        "Hi, my brakes are grinding and I'd like them checked.", 'What car is it?', 'A 2018 Honda Civic.', 'car', '2018 Honda Civic', 'Brake check', 'Chris Nguyen',
        [('TB', 'Tasha Brooks', 'Yesterday 5:40 PM', "Won't start", ('car', '2014 Ford F-150'), True, '(619) 555-0163'),
         ('LR', 'Luis Romero', 'Mon 9:05 AM', 'Oil change', None, False, '(619) 555-0187')],
        [('Brake check', ['What car is it?', 'Which day suits you?']), ('Oil change', ['What car is it?'])],
        ['Takes the call while you are under a car', 'Asks the car and the problem before you call back', 'Answers hours and location from what you give it']),
    'it': service(
        'for-it-support.html', 'IT support', 'For IT support', 'AI phone receptionist for IT support businesses | YAP Voice',
        "YAP Voice answers your line when you're on site with a client. It takes the caller's name, number and what they need, asks your own questions, and texts and emails it to you.",
        'Northside IT', 'on site with a client, on another call, after hours', 'with a client',
        "Hi, my laptop won't turn on and I need it for work.", 'What kind of device is it?', 'A Dell laptop.', 'device', 'Dell laptop', 'Laptop repair', 'Sam Patel',
        [('RC', 'Renee Clark', 'Yesterday 5:40 PM', 'Office Wi-Fi down', ('where', 'front office'), True, '(619) 555-0163'),
         ('OH', 'Omar Haddad', 'Mon 9:05 AM', 'New PC setup', None, False, '(619) 555-0187')],
        [('Laptop repair', ['What kind of device is it?']), ('Network problem', ['Is it one computer or the whole office?'])],
        ['Takes the call while you are on site with a client', 'Asks the device and the problem', 'Flags a caller who says it is urgent']),
}


class Page:
    """index.html's text, with replacements that fail loudly when their words are not there."""

    def __init__(self, text, name):
        self.s, self.name = text, name

    def swap(self, old, new, count=1):
        found = self.s.count(old)
        if found != count:
            sys.exit(f'{self.name}: expected {count} of this in index.html, found {found}:\n  {old[:160]}')
        self.s = self.s.replace(old, new)

    def sub(self, pattern, new, count=1):
        self.s, n = re.subn(pattern, lambda _: new, self.s, count=count, flags=re.S)
        if n != count:
            sys.exit(f'{self.name}: pattern matched {n} times, expected {count}:\n  {pattern[:160]}')

    def between(self, start, end, new):
        """Replace from `start` up to (not including) the next `end`."""
        a = self.s.find(start)
        b = self.s.find(end, a + len(start)) if a >= 0 else -1
        if a < 0 or b < 0:
            sys.exit(f'{self.name}: could not find the block starting:\n  {start[:160]}')
        self.s = self.s[:a] + new + self.s[b:]


def esc(text):
    return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


# ---------------------------------------------------------------- the story
MARK = ('<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="url(#mark)"/><g fill="#fff"><rect x="6.5" y="16" width="3" height="8" rx="1.5"/>'
        '<rect x="12.5" y="12" width="3" height="16" rx="1.5"/><rect x="18.5" y="8" width="3" height="24" rx="1.5"/><rect x="24.5" y="13" width="3" height="14" rx="1.5"/>'
        '<rect x="30.5" y="16.5" width="3" height="7" rx="1.5"/></g></svg>')
HANDSET = '<path d="M6.6 3h3l1.4 4.4-2 1.4a12 12 0 0 0 6.2 6.2l1.4-2L21 14.4v3A3.6 3.6 0 0 1 17.4 21 14.4 14.4 0 0 1 3 6.6 3.6 3.6 0 0 1 6.6 3z"/>'
WORDS = ('<!-- STORY WORDS: written by tools/build_pages.py, do not edit here -->', '<!-- /STORY WORDS -->')
PHONE = ('<!-- STORY PHONE: written by tools/build_pages.py, do not edit here -->', '<!-- /STORY PHONE -->')


def later(clock, minutes):
    """'4:12' and 2 -> '4:14'. The story's five screens are a few minutes of one afternoon."""
    h, m = map(int, clock.split(':'))
    m += minutes
    return f'{(h + m // 60 - 1) % 12 + 1}:{m % 60:02d}'


def story_words(t, home=False):
    """The five steps said over the phone. Only what the product does: it says it is an AI
    assistant, it takes requests and never confirms a booking, and nothing is recorded."""
    hear = f'Hear it answer for yourself: <a href="tel:{DEMO_LINE[0]}"><b>{DEMO_LINE[1]}</b></a>'
    if t['kind'] == 'restaurant':
        steps = [('A guest calls during service. Nobody can get to the phone.', 'So the call passes to YAP Voice.'),
                 ("It answers in your restaurant's name.", "It tells the guest it's an AI assistant, then answers their questions."),
                 ('It takes the booking request.', 'How many, which day and time, and what name. It says "requested", never "booked".'),
                 ('The request lands on your phone.', 'A text and an email, moments after the call. Nothing is recorded.'),
                 ('You confirm or decline, in one tap.', hear)]
    else:
        busy = 'Your hands are full' if home else "You're " + esc(t['short'])
        steps = [("A customer calls. You can't pick up.", busy + ', so the call passes to YAP Voice.'),
                 ("It answers in your business's name.", "It tells the caller it's an AI assistant, then answers their questions."),
                 ('It takes down what matters.', "The job, the name and the number, asked the way you'd ask."),
                 ('The details land on your phone.', 'A text and an email, moments after the call. Nothing is recorded.'),
                 ('You call back while the job is still open.', hear)]
    names = ['one', 'two', 'three', 'four', 'five']
    return ''.join(f'          <li><div class="st-in"><p class="st-label">Step {n}</p><h2>{head}</h2><p class="st-lede">{lede}</p></div></li>\n'
                   for n, (head, lede) in zip(names, steps))


def story_phone(t):
    """The phone's five screens: the call comes in, the assistant answers, what it took down,
    the text the owner gets, and the owner's list. All from the page's own made-up call."""
    biz, clock, call = esc(t['biz']), t['time'], [esc(x) for x in t['call']]
    # Step two is a PHONE CALL, and has to look like one, not like a chat: a call's own screen (who
    # is on it, a running clock, sound moving, the call's buttons), with what is being said shown as
    # speech, one line at a time, under who is saying it. It is headed "Meanwhile, on the call"
    # because the owner does not watch this: no transcript is kept or shown (the privacy policy).
    them = t['them'].lower()
    say = lambda who, line, when: f'<p class="st-say"{when}><small>{who}</small>{line}</p>'
    sound = '<div class="st-sound" aria-hidden="true">' + '<i></i>' * 13 + '</div>'
    bar = lambda small, a, b: (f'<div class="st-bar">{MARK}<div><b>{biz}</b><small>{small}</small></div>'
                               f'<em><i class="st-live"><i></i><i></i><i></i></i><span data-clock="{a},{b}">0:{a:02d}</span></em></div>')
    if t['kind'] == 'restaurant':
        took = [('The request', esc(t['request']), esc(t['when'])), ('Name', esc(t['person']), ''), ('Number', CALLER, '')]
        title, rows = 'Requests', [(esc(n), esc(d), 'Confirm' if i == 0 else 'Confirmed') for i, (n, d) in enumerate(t['requests'])]
    else:
        took = [('The job', esc(t['job']), f'{esc(t["field"])}: {esc(t["value"])}'), ('Name', esc(t['person']), ''), ('Number', CALLER, '')]
        title, rows = 'Callbacks', ([(esc(t['person']), f'{esc(t["job"])} · {clock} PM', 'Call back')]
                                    + [(esc(r[1]), f'{esc(r[3])} · {r[2]}', 'Called') for r in t['rows']])
    cards = ''.join(f'            <div{at}><small>{label}</small><b>{value}</b>{"<span>" + more + "</span>" if more else ""}</div>\n'
                    for at, (label, value, more) in zip(['', ' data-at=".28"', ' data-at=".54"'], took))
    lines = ''.join(f'          <div class="st-row {"st-first" if i == 0 else "st-done"}"><b>{name}</b><span>{what}</span><a>{go}</a></div>\n'
                    for i, (name, what, go) in enumerate(rows))
    sms = [esc(x) for x in t['sms']]
    text = f'<b>{sms[0]}</b><br>' + '<br>'.join(sms[1:]) if len(sms) > 1 else sms[0]
    return f'''        <div class="st-view st-v0" data-time="{clock}">
          <div class="st-kind">Incoming call</div>
          <div class="st-face"><svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.2"/><path d="M3.5 21c0-4.6 3.8-7.3 8.5-7.3s8.500 2.700 8.500 7.300z"/></svg></div>
          <div class="st-who">{CALLER}</div><div class="st-where">San Diego, CA</div>
          <div class="st-mid">
            <div class="st-ringing" data-until=".42">Ringing<i></i><i></i><i></i></div>
            <div class="st-pass" data-at=".46">{MARK}<div><b>No answer</b><small>YAP Voice is picking up</small></div></div>
          </div>
          <div class="st-btns"><div><i class="st-no"><svg viewBox="0 0 24 24"><path d="M3 15c5-5 13-5 18 0l-2.5 2.5-3.5-2v-2.2a9 9 0 0 0-6 0v2.2l-3.5 2z"/></svg></i><span>Decline</span></div><div><i class="st-yes"><svg viewBox="0 0 24 24">{HANDSET}</svg></i><span>Accept</span></div></div>
        </div>
        <div class="st-view st-v1" data-time="{clock}">
          <p class="st-meanwhile">Meanwhile, on the call</p>
          <div class="st-onwith">{MARK}<b>{biz}</b><small>Answered by YAP Voice</small></div>
          <p class="st-clock"><i></i><span data-clock="3,21">0:03</span></p>
          {sound}
          <div class="st-said">
            {say('The assistant says', call[0], ' data-until=".24"')}
            {say(f'The {them} says', call[1], ' data-at=".32" data-until=".56"')}
            {say('The assistant says', call[2], ' data-at=".64"')}
          </div>
          <div class="st-keys" aria-hidden="true">
            <i><svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.100A7 7 0 0 0 19 12z"/></svg></i>
            <i><svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="1.800"/><circle cx="12" cy="6" r="1.800"/><circle cx="18" cy="6" r="1.800"/><circle cx="6" cy="12" r="1.800"/><circle cx="12" cy="12" r="1.800"/><circle cx="18" cy="12" r="1.800"/><circle cx="6" cy="18" r="1.800"/><circle cx="12" cy="18" r="1.800"/><circle cx="18" cy="18" r="1.800"/></svg></i>
            <i><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zm11.500 3a4 4 0 0 0-2-3.500v7a4 4 0 0 0 2-3.500zM13.500 3.300v2.100a7 7 0 0 1 0 13.200v2.100a9 9 0 0 0 0-17.400z"/></svg></i>
            <i class="st-end"><svg viewBox="0 0 24 24"><path d="M3 15c5-5 13-5 18 0l-2.500 2.500-3.500-2v-2.200a9 9 0 0 0-6 0v2.200l-3.500 2z"/></svg></i>
          </div>
        </div>
        <div class="st-view st-v2" data-time="{later(clock, 1)}">
          {bar('Still on the call', 26, 47)}
          <div class="st-got">
{cards}          </div>
        </div>
        <div class="st-view st-v3" data-time="{later(clock, 2)}">
          <div class="st-date">Thursday, November 19</div><div class="st-time">{later(clock, 2)}</div>
          <div class="st-note" data-at=".2"><div class="st-hd"><i><svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg></i>Messages<span>now</span></div>
          <p>{text}</p></div>
        </div>
        <div class="st-view st-v4" data-time="{later(clock, 3)}">
          <h4>{title}</h4><div class="st-sub">{biz} · today</div>
{lines}        </div>
'''


def put_story(p, t, home=False):
    p.between(WORDS[0], WORDS[1], WORDS[0] + '\n' + story_words(t, home) + '          ')
    p.between(PHONE[0], PHONE[1], PHONE[0] + '\n' + story_phone(t) + '        ')


def common(p, t, key):
    """What every type's page changes: its name in the head, the menu's mark, the line over the headline, the call."""
    url = SITE + t['file']
    p.sub(r'<title>.*?</title>', f"<title>{esc(t['title'])}</title>")
    p.sub(r'<meta name="description" content="[^"]*" />', f'<meta name="description" content="{esc(t["describe"])}" />')
    p.swap(f'<link rel="canonical" href="{SITE}" />', f'<link rel="canonical" href="{url}" />')
    p.swap(f'<meta property="og:url" content="{SITE}" />', f'<meta property="og:url" content="{url}" />')
    p.sub(r'<meta property="og:title" content="[^"]*" />', f'<meta property="og:title" content="{esc(t["title"])}" />')
    p.sub(r'<meta property="og:description" content="[^"]*" />', f'<meta property="og:description" content="{esc(t["describe"])}" />')
    p.swap(f'<a href="{t["file"]}" data-type="{key}">', f'<a href="{t["file"]}" data-type="{key}" aria-current="page">')
    p.swap('<a href="#top" class="brand"', '<a href="index.html" class="brand"')
    # The photo behind the top section is of the business the page is about: a tradesperson on
    # the home page, and each type's own picture on its page (img/hero-<type>.jpg, named in
    # site.css). A new type needs its picture and its line there, or it shows no photo at all.
    p.swap('<section class="story hero--work" id="top"', f'<section class="story hero--{key}" id="top"')
    # Only the home page opens slowly, the headline coming out of the dark letter by letter.
    # On a trade's page the headline is simply there.
    p.swap(' data-open="slow"', '')
    # A trade that is not in FILMED shows its own picture, held still, and says "Example".
    if key not in FILMED:
        p.swap(' data-film="img/story/"', '')
        p.swap('Stock footage. The business and the caller are made up.', 'Example. The business and the caller are made up.')
    # The closing section shows the same picture the page opened on.
    p.swap('<section class="section section--ink section--photo band--work" id="contact"', f'<section class="section section--ink section--photo band--{key}" id="contact"')
    p.swap('<p class="eyebrow">AI phone receptionist · San Diego</p>', f'<p class="eyebrow">AI phone receptionist · {esc(t["eyebrow"])}</p>')
    # the story at the top: this trade's words, and its call on the phone
    put_story(p, t)


def service_page(p, t):
    # The home page speaks to every kind of business; a trade's page keeps the line about jobs.
    p.swap('<h1 id="hero-title" class="hero__title">Your phone, always answered.</h1>', '<h1 id="hero-title" class="hero__title">Never lose a job to voicemail.</h1>')
    p.sub(r'<p class="hero__lede">.*?</p>', f'''<p class="hero__lede">
            YAP Voice answers your business line when you can't — {esc(t["where"])}. It answers the caller's questions, takes their
            name, number and what they need, and <strong>texts it straight to you</strong>.
          </p>''')
    p.swap('"what size is the TV?"', '"' + esc(t['ask'][0].lower() + t['ask'][1:]) + '"')
    initials = ''.join(w[0] for w in t['person'].split())
    def row(av, name, when, job, chip, urgent, number, new=False):
        chips = f'<p class="mock__chips"><span>{esc(chip[0])}: <b>{esc(chip[1])}</b></span></p>' if chip else ''
        call = f'<b>Call {number}</b><i>Called back</i>' if new else f'Call {number}'
        return f'''                <li{' class="mock__row--new"' if new else ''}>
                  <span class="mock__av">{av}</span>
                  <div><strong>{esc(name)} <small>{when}</small>{' <em>Urgent</em>' if urgent else ''}</strong><p>{esc(job)}</p>{chips}</div>
                  <span class="mock__call">{call}</span>
                </li>
'''
    rows = row(initials, t['person'], '4:12 PM', t['job'], (t['field'], t['value']), False, '(619) 555-0142', new=True) + ''.join(row(*r) for r in t['rows'])
    p.between('              <ul class="mock__list" role="list">', '              </ul>', '              <ul class="mock__list" role="list">\n' + rows)
    p.swap('<div><strong>Jordan Blake</strong><p>Wants a call back · TV mounting</p></div>', f'<div><strong>{esc(t["person"])}</strong><p>Wants a call back · {esc(t["job"])}</p></div>')
    cards = ''.join(f'''              <div class="mock__service">
                <strong>{esc(name)}</strong>
                <p class="mock__day">The agent asks</p>
                <ol>{''.join(f'<li>{esc(q)}</li>' for q in asks)}</ol>
              </div>
''' for name, asks in t['services'])
    p.between('              <div class="mock__service">', '            </div>\n          </div>\n          <figcaption', cards)


def restaurant_page(p, t):
    p.swap('<h1 id="hero-title" class="hero__title">Your phone, always answered.</h1>', '<h1 id="hero-title" class="hero__title">Never miss a booking during service.</h1>')
    p.sub(r'<p class="hero__lede">.*?</p>', '''<p class="hero__lede">
            YAP Voice answers your restaurant's phone when you can't — mid-service, after closing,
            on your day off. It answers the guest's questions, takes their booking request,
            and <strong>texts it straight to you</strong>.
          </p>''')
    p.swap('<li>Every callback in your dashboard</li>', '<li>Every booking in your dashboard</li>')
    p.swap('The business and the caller are made up.</p>', 'The restaurant and the guest are made up.</p>')

    # what it does
    p.swap('<h2 id="features-title" class="section__title">A receptionist that never puts anyone on hold</h2>', '<h2 id="features-title" class="section__title">A host that never leaves the phone ringing</h2>')
    p.between('        <div class="features">', '      </div>\n    </section>', '''        <div class="features">
          <article class="feature">
            <h3>Takes booking requests</h3>
            <p>Name, party size, day and time, and a number to reach them. If they mention children or an occasion, that goes in the note.</p>
          </article>
          <article class="feature">
            <h3>Changes and cancels</h3>
            <p>A guest who rings back to move or cancel is found by the number they booked with, and you're told exactly what changed.</p>
          </article>
          <article class="feature">
            <h3>Answers questions</h3>
            <p>Opening hours, where you are, what you tell it about the menu. When it doesn't know, it says so and takes a message instead of guessing.</p>
          </article>
          <article class="feature">
            <h3>Says "requested", never "booked"</h3>
            <p>It doesn't promise a table. It tells the guest the request is with the restaurant, and you confirm or decline it.</p>
          </article>
          <article class="feature">
            <h3>Answers when you say</h3>
            <p>Every call, only after hours, or only when you don't pick up — you choose, and change it any time from your dashboard.</p>
          </article>
          <article class="feature">
            <h3>Honest with callers</h3>
            <p>It tells every caller it's an automated assistant, and tells anyone describing an emergency to hang up and call 911.</p>
          </article>
        </div>
''')

    # your dashboard
    p.swap('<h2 id="dashboard-title" class="section__title">Everyone waiting on you, one tap from a call back</h2>', '<h2 id="dashboard-title" class="section__title">Every booking request, one tap from confirmed</h2>')
    p.swap('<li data-scene="0 1 2 3">Who is waiting for a call back, what they need, and a button to ring them</li>', '<li data-scene="0 1 2 3">Every request with its party size, time, name and number, and a button to confirm or decline</li>')
    p.swap('<li data-scene="5">Your month in numbers: calls answered, how many it handled, how long they took</li>', '<li data-scene="5">Your month in numbers: calls answered, bookings coming up, how long calls took</li>')
    p.swap('<li data-scene="6">Your hours, services and answers — change them and the next call uses them</li>', '<li data-scene="6">Your opening hours and answers — change them and the next call uses them</li>')
    p.swap('<label for="mock-callbacks">Callbacks</label>', '<label for="mock-callbacks">Bookings</label>')
    p.swap('<label for="mock-services">Services</label>', '<label for="mock-services">Hours</label>')
    p.swap('<p><strong>Callbacks</strong><small>People who rang, said what they needed and left a number.</small></p>', '<p><strong>Reservation requests</strong><small>Each one is a request, not a confirmed booking: confirm or decline it.</small></p>')
    p.swap('<p class="mock__filter"><b>To call back</b><span>Called back</span><span>All</span></p>', '<p class="mock__filter"><b>Pending</b><span>Confirmed</span><span>All</span></p>')
    def booking(size, name, when, third, new=False):
        go = '<b>Confirm</b><i>Confirmed</i>' if new else 'Confirm'
        return f'''                <li{' class="mock__row--new"' if new else ''}>
                  <span class="mock__av mock__av--n">{size}</span>
                  <div><strong>{name}</strong><p>{when}</p>{third}</div>
                  <span class="mock__acts"><span class="mock__call">{go}</span><span class="mock__ghost">Decline</span></span>
                </li>
'''
    p.between('              <ul class="mock__list" role="list">', '              </ul>', '              <ul class="mock__list" role="list">\n'
              + booking(4, 'Maria Lopez', 'Fri, Nov 20 · 7:00 PM', '<p>+16195550142</p>', new=True)
              + booking(2, 'Daniel Reyes', 'Sat, Nov 21 · 6:30 PM', '<p class="mock__said">“A window table if there is one”</p>')
              + booking(6, 'Aisha Rahman', 'Sat, Nov 21 · 8:00 PM', '<p class="mock__said">“2 children, one high chair”</p>'))
    p.between('              <ul class="mock__list mock__list--calls" role="list">', '              </ul>', '''              <ul class="mock__list mock__list--calls" role="list">
                <li><time>7:42 PM</time><div><strong>(619) 555-0142</strong><p>1m 48s call</p></div><span class="mock__badge mock__badge--cb">Booking made</span></li>
                <li><time>6:15 PM</time><div><strong>(619) 555-0171</strong><p>0m 41s call</p></div><span class="mock__badge">Question answered</span></li>
                <li><time>5:58 PM</time><div><strong>(858) 555-0119</strong><p>1m 02s call</p></div><span class="mock__badge">Booking canceled</span></li>
                <li><time>3:20 PM</time><div><strong>(213) 555-0108</strong><p>Never answered</p></div><span class="mock__badge mock__badge--off">Spam, blocked</span></li>
''')
    p.between('              <dl class="mock__stats">', '              </dl>', '''              <dl class="mock__stats">
                <div><dt>Calls answered</dt><dd data-count="63" data-fmt="int">63</dd><small>Last 30 days · 5 spam kept out</small></div>
                <div><dt>Handled by the assistant</dt><dd data-count="94" data-fmt="pct">94%</dd><small>59 of 63 · 4 passed to you</small></div>
                <div><dt>Upcoming bookings</dt><dd data-count="12" data-fmt="int">12</dd><small>3 to confirm</small></div>
                <div><dt>Average call</dt><dd data-count="97" data-fmt="dur">1m 37s</dd><small>Answer to hang-up</small></div>
''')
    week = [('Monday', 'Closed'), ('Tuesday', '5:00 PM – 10:00 PM'), ('Wednesday', '5:00 PM – 10:00 PM'), ('Thursday', '5:00 PM – 10:00 PM'),
            ('Friday', '5:00 PM – 11:00 PM'), ('Saturday', '5:00 PM – 11:00 PM'), ('Sunday', '4:00 PM – 9:00 PM')]
    p.swap('<p><strong>Services</strong><small>What your business does, and what the assistant asks about each job.</small></p>',
           '<p><strong>Hours</strong><small>When you\'re open. The assistant answers "are you open?" from these.</small></p>')
    p.between('              <div class="mock__service">', '            </div>\n          </div>\n          <figcaption',
              '              <dl class="mock__hours">\n' + ''.join(f'                <div style="--i:{i}"><dt>{d}</dt><dd>{h}</dd></div>\n' for i, (d, h) in enumerate(week)) + '              </dl>\n')
    p.swap('Examples with made-up callers and figures.', 'Examples with made-up guests and figures.')

    # pricing: one plan. A restaurant's bookings are table requests, which
    # are part of answering its calls and need no calendar.
    p.swap('<h2 id="pricing-title" class="section__title">Two plans, one line each</h2>',
           '<h2 id="pricing-title" class="section__title">One line, one price</h2>')
    p.between('        <div class="plans">', '        <p class="plan__fine">', '''        <div class="plans plans--one">
          <article class="plan">
            <h3 class="plan__name">Answering + Booking</h3>
            <p class="plan__amount">$99<span class="plan__per">/month</span></p>
            <p class="plan__sub">per business line · up to 300 calls a month</p>
            <p class="plan__trial">30-day free trial</p>
            <ul class="ticks plan__list" role="list">
              <li>Answers every call you send it, day or night</li>
              <li>Takes booking requests: name, party size, day and time</li>
              <li>Lets guests change or cancel a booking by phone</li>
              <li>Texts and emails you after every call</li>
              <li>Answers guests' questions from your own hours and answers</li>
              <li>Set up with you, usually in one sitting</li>
            </ul>
            <a href="#contact" class="btn btn--primary btn--lg">Start 30-day free trial</a>
          </article>
        </div>
''')
    p.swap('The 30-day free trial is on either plan: it starts',
           'The 30-day free trial starts')
    p.swap('or $149 with your Google Calendar connected so visits are booked straight into it, and the first 30 days are free. Each plan covers up to 300 calls a month;',
           'and the first 30 days are free. It covers up to 300 calls a month;')
    p.swap("What it won't do: quote prices or promise dates on your behalf. It takes the details, and you decide.", "What it won't do: promise a table or take a deposit. It takes the request, and you confirm.")

    # questions: the two that are about jobs give way to two about tables
    def question(q):
        m = re.search(r'          <details>\s*<summary>' + re.escape(q) + r'</summary>.*?</details>\n', p.s, flags=re.S)
        if not m:
            sys.exit(f'{p.name}: the question "{q}" is no longer in index.html')
        return m.group(0)
    kept = [question(q) for q in ("Will callers know it's not a person?", 'Do I have to change my phone number?')]
    tail = [question(q) for q in ('Are calls recorded?', 'How is it set up, and what does it cost?')]
    p.between('        <div class="faq">', '      </div>\n    </section>', '        <div class="faq">\n' + ''.join(kept) + '''          <details>
            <summary>Does it know if we're full?</summary>
            <p>No. It can't see your tables. It takes the request, tells the guest the restaurant will confirm, and you confirm or decline it in your dashboard.</p>
          </details>
          <details>
            <summary>Can a guest change or cancel by phone?</summary>
            <p>Yes. It finds their booking by the number they're calling from, or one they give, makes the change, and texts you what it was and what it is now.</p>
          </details>
''' + ''.join(tail) + '        </div>\n')
    p.swap("Tell me about your business and I'll set up a free demo on a test line.", "Tell me about your restaurant and I'll set up a free demo on a test line.")


def main():
    # The home page's own story first: the handyman's call, with the home page's first line.
    home = Page((ROOT / 'index.html').read_text(), 'index.html')
    put_story(home, TYPES['handyman'], home=True)
    (ROOT / 'index.html').write_text(home.s)
    print('wrote the story into index.html')
    source = home.s
    for key, t in TYPES.items():
        p = Page(source, t['file'])
        common(p, t, key)
        (restaurant_page if t['kind'] == 'restaurant' else service_page)(p, t)
        # The comments in index.html explain index.html. This page has one of its own.
        p.s = re.sub(r'\n?[ \t]*<!--.*?-->', '', p.s, flags=re.S)
        p.swap('<html lang="en">', f'<html lang="en">\n<!-- MADE BY tools/build_pages.py FROM index.html. Change that page or that script, then run it; do not edit this file. -->')
        if key != 'handyman':
            for word in ('Harbor View', 'Jordan Blake', 'TV mounting', '65 inch', 'tv size'):
                if word in p.s:
                    sys.exit(f'{t["file"]}: the handyman example\'s "{word}" is still on the page')
        (ROOT / t['file']).write_text(p.s)
        print('wrote', t['file'])
    assert set(ASKS) == set(TYPES) and all(ASKS[k][0] == TYPES[k]['ask'] for k in TYPES), 'ASKS must start with each type\'s own question'
    cards = {key: {'name': t['name'], 'asks': ASKS[key], 'notes': t['notes']} for key, t in TYPES.items()}
    (ROOT / 'types.js').write_text(
        '/* MADE BY tools/build_pages.py. What the small card in the "Business type" menu says about\n'
        '   each kind of business (script.js): the questions the assistant asks, shown in turn, and three things. */\n'
        'window.YAP_TYPES = ' + json.dumps(cards, ensure_ascii=False, indent=1) + ';\n')
    print('wrote types.js')


if __name__ == '__main__':
    main()
