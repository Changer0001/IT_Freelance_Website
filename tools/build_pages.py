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

import scenes

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://yap-itsupport.com/'
OPENING = "Thanks for calling {biz}. I'm the AI assistant here, and I'll take down what you need."


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
    p.swap('<section class="hero hero--photo hero--work" id="top"', f'<section class="hero hero--photo hero--{key}" id="top"')
    # The last scene of "How it works" shows the owner getting the text: dressed for this trade.
    p.s = scenes.put(p.s, 4, key)
    # The closing section shows the same picture the page opened on.
    p.swap('<section class="section section--ink section--photo band--work" id="contact"', f'<section class="section section--ink section--photo band--{key}" id="contact"')
    p.swap('<p class="eyebrow">AI phone receptionist · San Diego</p>', f'<p class="eyebrow">AI phone receptionist · {esc(t["eyebrow"])}</p>')
    # the call, line by line
    lines = re.findall(r'(<p class="handset__say [^>]*>.*?<span>)(.*?)(</span></p>)', p.s, flags=re.S)
    if len(lines) != 9:
        sys.exit(f'{p.name}: expected nine lines in the call, found {len(lines)}')
    for (head, old, tail), new in zip(lines, t['call']):
        p.swap(head + old + tail, head + esc(new) + tail)
    p.sub(r'<span class="handset__body">\s*YAP Voice: New enquiry.*?</span>',
          '<span class="handset__body">\n                      ' + '<br />\n                      '.join(esc(x) for x in t['sms']) + '\n                    </span>')
    p.swap('<span class="handset__body"><b>New enquiry — Harbor View Handyman</b></span>', f'<span class="handset__body"><b>{esc(t["mail"])}</b></span>')


def service_page(p, t):
    p.sub(r'<p class="hero__lede">.*?</p>', f'''<p class="hero__lede">
            YAP Voice answers your business line when you can't — {esc(t["where"])}. It answers the caller's questions, takes their
            name, number and what they need, and <strong>texts it straight to you</strong>.
          </p>''')
    p.swap("<li data-now=\"1\">A customer calls. You're on a job and can't pick up.</li>", f"<li data-now=\"1\">A customer calls. You're {esc(t['short'])} and can't pick up.</li>")
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
    p.swap('<h1 id="hero-title" class="hero__title">Never lose a job to voicemail.</h1>', '<h1 id="hero-title" class="hero__title">Never miss a booking during service.</h1>')
    p.sub(r'<p class="hero__lede">.*?</p>', '''<p class="hero__lede">
            YAP Voice answers your restaurant's phone when you can't — mid-service, after closing,
            on your day off. It answers the guest's questions, takes their booking request,
            and <strong>texts it straight to you</strong>.
          </p>''')
    p.swap('<li>Every callback in your dashboard</li>', '<li>Every booking in your dashboard</li>')
    p.swap('aria-label="Example: a customer calls, YAP Voice answers, and the owner gets a text and an email with the job"',
           'aria-label="Example: a guest calls, YAP Voice answers, and the owner gets a text and an email with the booking request"')
    p.swap('<b>4:12</b>', f'<b>{t["time"]}</b>')
    p.swap('<strong>4:12</strong>', f'<strong>{t["time"]}</strong>')
    p.swap('<span><i></i>Customer</span>', f'<span><i></i>{t["them"]}</span>')
    p.sub(r'<ol class="phone__steps" id="phone-steps">.*?</ol>', '''<ol class="phone__steps" id="phone-steps">
            <li data-now="1">A guest calls during service. Nobody can get to the phone.</li>
            <li data-now="2 3 4 5 6 7 8 9 10">YAP Voice answers and takes the booking request: how many, when, what name.</li>
            <li data-now="11 12">You get a text and an email with the request, ready to confirm.</li>
          </ol>''')
    p.swap('Example. The business and the caller are made up.', 'Example. The restaurant and the guest are made up.')

    # how it works
    p.swap("<h3>It answers like your front desk</h3>\n            <p>It says it's your business's automated assistant, then answers from what you've told it: hours, services, the area you cover.</p>",
           "<h3>It answers like your front of house</h3>\n            <p>It says it's your restaurant's automated assistant, then answers from what you've told it: opening hours, where you are, what you tell it about the menu.</p>")
    p.swap('<h3>It takes the details</h3>\n            <p>Name, the best number to call back, what they need, and your own questions for that job — like which day suits them.</p>',
           '<h3>It takes the booking request</h3>\n            <p>Name, party size, the day and the time, and a number to reach them. It reads it back, and tells the guest the restaurant will confirm.</p>')
    p.swap('<p>When the call ends, the details are texted and emailed to you. They also wait in your dashboard with a button to call them back.</p>',
           '<p>When the call ends, the request is texted and emailed to you. It also waits in your dashboard with a button to confirm or decline it.</p>')

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
    source = (ROOT / 'index.html').read_text()
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
