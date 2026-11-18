#!/usr/bin/env python3
"""The four small scenes above the "How it works" steps, drawn with people.

    python3 tools/scenes.py        # writes the four scenes into index.html

Each scene is one SVG, 320 by 200, drawn here from a few shapes so the people
stay one family: the customer who calls, the assistant that answers, the note
being taken, and the owner who gets the text. They are drawings made for this
site, so there is no photo licence and no real person in them.

THE ASSISTANT IS DRAWN AS A MACHINE ON PURPOSE. The page says every caller is
told it is an automated assistant; a human receptionist in that picture would
say the opposite.

The owner in the last scene is dressed for the page's trade (OWNERS below).
index.html carries the home page's four scenes; tools/build_pages.py puts each
business type's own owner into its page. How the scenes move is in site.css
(.fig ...) and script.js (the workflow).
"""
import re
import sys
from pathlib import Path

INK = '#16213a'
def bust(cx, base, skin, shirt, hair=None, hair_color='#2b1d16', s=1.0, hat=None, hat_color='#ffd23f', glasses=False, cls=''):
    """Head and shoulders of a person, rising from the bottom edge."""
    X = lambda v: round(cx + v * s, 1); Y = lambda v: round(base - v * s, 1); R = lambda v: round(v * s, 1)
    out = [f'<g class="p {cls}">']
    if hair == 'long':
        out.append(f'<path fill="{hair_color}" d="M{X(-27)},{Y(80)} A{R(27)},{R(27)} 0 0 1 {X(27)},{Y(80)} L{X(29)},{Y(46)} Q{X(0)},{Y(36)} {X(-29)},{Y(46)} Z"/>')
    out.append(f'<path fill="{shirt}" d="M{X(-50)},{Y(0)} C{X(-50)},{Y(36)} {X(-32)},{Y(52)} {X(-13)},{Y(54)} L{X(13)},{Y(54)} C{X(32)},{Y(52)} {X(50)},{Y(36)} {X(50)},{Y(0)} Z"/>')
    out.append(f'<path fill="{skin}" d="M{X(-9)},{Y(66)} L{X(9)},{Y(66)} L{X(9)},{Y(54)} Q{X(0)},{Y(44)} {X(-9)},{Y(54)} Z"/>')
    out.append(f'<path fill="#000" opacity="0.12" d="M{X(-9)},{Y(62)} Q{X(0)},{Y(54)} {X(9)},{Y(62)} L{X(9)},{Y(66)} L{X(-9)},{Y(66)} Z"/>')
    out.append(f'<circle fill="{skin}" cx="{X(0)}" cy="{Y(82)}" r="{R(22)}"/>')
    if hair in ('short', 'long'):
        out.append(f'<path fill="{hair_color}" d="M{X(-23)},{Y(82)} A{R(23)},{R(23)} 0 0 1 {X(23)},{Y(82)} Q{X(24)},{Y(92)} {X(16)},{Y(96)} Q{X(2)},{Y(86)} {X(-14)},{Y(90)} Q{X(-21)},{Y(88)} {X(-23)},{Y(82)} Z"/>')
    if hat == 'hard':
        out.append(f'<path fill="{hat_color}" d="M{X(-24)},{Y(88)} A{R(24)},{R(23)} 0 0 1 {X(24)},{Y(88)} Z"/>')
        out.append(f'<rect fill="{hat_color}" x="{X(-29)}" y="{Y(90)}" width="{R(58)}" height="{R(6)}" rx="{R(3)}"/>')
        out.append(f'<rect fill="#000" opacity="0.14" x="{X(-4)}" y="{Y(111)}" width="{R(8)}" height="{R(21)}" rx="{R(3)}"/>')
    elif hat == 'cap':
        out.append(f'<path fill="{hat_color}" d="M{X(-23)},{Y(88)} A{R(23)},{R(21)} 0 0 1 {X(23)},{Y(88)} Z"/>')
        out.append(f'<path fill="{hat_color}" d="M{X(-23)},{Y(92)} L{X(34)},{Y(92)} Q{X(38)},{Y(88)} {X(32)},{Y(86)} L{X(-23)},{Y(86)} Z"/>')
    elif hat == 'chef':
        out.append(f'<circle fill="{hat_color}" cx="{X(-13)}" cy="{Y(112)}" r="{R(12)}"/><circle fill="{hat_color}" cx="{X(13)}" cy="{Y(112)}" r="{R(12)}"/><circle fill="{hat_color}" cx="{X(0)}" cy="{Y(118)}" r="{R(14)}"/>')
        out.append(f'<rect fill="{hat_color}" x="{X(-20)}" y="{Y(110)}" width="{R(40)}" height="{R(20)}" rx="{R(3)}"/>')
        out.append(f'<rect fill="#000" opacity="0.1" x="{X(-20)}" y="{Y(96)}" width="{R(40)}" height="{R(4)}"/>')
    out.append(f'<g class="p__eyes" fill="{INK}"><circle cx="{X(-8)}" cy="{Y(80)}" r="{R(2.3)}"/><circle cx="{X(8)}" cy="{Y(80)}" r="{R(2.3)}"/></g>')
    if glasses:
        out.append(f'<g fill="none" stroke="{INK}" stroke-width="{R(1.8)}"><circle cx="{X(-8)}" cy="{Y(80)}" r="{R(6)}"/><circle cx="{X(8)}" cy="{Y(80)}" r="{R(6)}"/><path d="M{X(-2)},{Y(80)} L{X(2)},{Y(80)}"/></g>')
    out.append(f'<path fill="none" stroke="{INK}" stroke-width="{R(2)}" stroke-linecap="round" d="M{X(-7)},{Y(71)} Q{X(0)},{Y(64)} {X(7)},{Y(71)}"/>')
    out.append('</g>')
    return ''.join(out)

def phone_at_ear(cx, base, skin, shirt, s=1.0):
    X = lambda v: round(cx + v * s, 1); Y = lambda v: round(base - v * s, 1); R = lambda v: round(v * s, 1)
    return (f'<path fill="none" stroke="{shirt}" stroke-width="{R(17)}" stroke-linecap="round" d="M{X(40)},{Y(8)} Q{X(58)},{Y(40)} {X(31)},{Y(66)}"/>'
            f'<rect fill="{INK}" x="{X(20)}" y="{Y(100)}" width="{R(11)}" height="{R(30)}" rx="{R(4)}" transform="rotate(8 {X(25)} {Y(85)})"/>'
            f'<circle fill="{skin}" cx="{X(29)}" cy="{Y(74)}" r="{R(8)}"/>')

def assistant(cx, base, s=1.0):
    """The assistant: plainly a machine, so nobody takes it for a person answering."""
    X = lambda v: round(cx + v * s, 1); Y = lambda v: round(base - v * s, 1); R = lambda v: round(v * s, 1)
    return ''.join([
        '<g class="p p--ai">',
        f'<path fill="#2f6bff" d="M{X(-50)},{Y(0)} C{X(-50)},{Y(36)} {X(-32)},{Y(52)} {X(-13)},{Y(54)} L{X(13)},{Y(54)} C{X(32)},{Y(52)} {X(50)},{Y(36)} {X(50)},{Y(0)} Z"/>',
        f'<rect fill="#fff" opacity="0.94" x="{X(-13)}" y="{Y(36)}" width="{R(26)}" height="{R(16)}" rx="{R(8)}"/>',
        f'<text x="{X(0)}" y="{Y(24.5)}" text-anchor="middle" font-size="{R(10.5)}" font-weight="700" fill="#2f6bff" font-family="Source Sans 3, sans-serif">AI</text>',
        f'<rect fill="#b9c8e6" x="{X(-8)}" y="{Y(62)}" width="{R(16)}" height="{R(12)}"/>',
        f'<line stroke="#b9c8e6" stroke-width="{R(3)}" stroke-linecap="round" x1="{X(0)}" y1="{Y(106)}" x2="{X(0)}" y2="{Y(118)}"/><circle class="ai__dot" fill="#7aa8ff" cx="{X(0)}" cy="{Y(120)}" r="{R(4.5)}"/>',
        f'<rect fill="#f4f7fc" x="{X(-27)}" y="{Y(108)}" width="{R(54)}" height="{R(48)}" rx="{R(17)}"/>',
        f'<rect fill="{INK}" x="{X(-20)}" y="{Y(100)}" width="{R(40)}" height="{R(28)}" rx="{R(11)}"/>',
        f'<g class="p__eyes" fill="#7aa8ff"><rect x="{X(-12.5)}" y="{Y(93)}" width="{R(7)}" height="{R(11)}" rx="{R(3.5)}"/><rect x="{X(5.5)}" y="{Y(93)}" width="{R(7)}" height="{R(11)}" rx="{R(3.5)}"/></g>',
        f'<path fill="none" stroke="{INK}" stroke-width="{R(4)}" stroke-linecap="round" d="M{X(-29)},{Y(86)} A{R(29)},{R(31)} 0 0 1 {X(29)},{Y(86)}"/>',
        f'<rect fill="{INK}" x="{X(-35)}" y="{Y(94)}" width="{R(10)}" height="{R(20)}" rx="{R(5)}"/><rect fill="{INK}" x="{X(25)}" y="{Y(94)}" width="{R(10)}" height="{R(20)}" rx="{R(5)}"/>',
        f'<path fill="none" stroke="{INK}" stroke-width="{R(3)}" stroke-linecap="round" d="M{X(-30)},{Y(76)} Q{X(-30)},{Y(62)} {X(-14)},{Y(63)}"/><circle fill="#7aa8ff" cx="{X(-12)}" cy="{Y(63)}" r="{R(3.5)}"/>',
        '</g>'])

SKIN_A, SKIN_B = '#f2c7a5', '#b9794f'
def svg(inner): return f'<svg class="fig" viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">{inner}</svg>'
TICK = 'M-4,0 L-1,3 L4,-3'

# 1. A customer calls; the business's phone rings.
s1 = svg(
    '<circle class="blob" cx="250" cy="50" r="70"/>'
    + bust(96, 204, SKIN_A, '#f08a5d', hair='long', hair_color='#5a3a22') + phone_at_ear(96, 204, SKIN_A, '#f08a5d')
    + '<path class="wire" fill="none" d="M146,96 Q190,52 226,84"/><circle class="spark" r="4"><animateMotion dur="1.4s" repeatCount="indefinite" path="M146,96 Q190,52 226,84"/></circle>'
    + '<g class="ringer"><g class="rings" fill="none" stroke-linecap="round" stroke-width="3">'
      '<path d="M218,74 Q210,98 218,122"/><path d="M208,66 Q196,98 208,130"/><path d="M290,74 Q298,98 290,122"/><path d="M300,66 Q312,98 300,130"/></g>'
    + f'<rect fill="{INK}" x="228" y="46" width="52" height="104" rx="11"/><rect fill="#1d2d52" x="232" y="54" width="44" height="88" rx="7"/>'
      '<circle fill="#7aa8ff" cx="254" cy="80" r="11"/><rect fill="#7aa8ff" opacity="0.55" x="241" y="97" width="26" height="4" rx="2"/>'
      '<circle fill="#e5484d" cx="243" cy="124" r="8"/><circle class="pick-up" fill="#34c171" cx="265" cy="124" r="8"/></g>')

# 2. The assistant answers, and says what it is.
s2 = svg(
    '<circle class="blob" cx="60" cy="40" r="70"/>'
    + assistant(104, 204)
    + '<g class="say"><path class="card" d="M170,40 h112 a14,14 0 0 1 14,14 v46 a14,14 0 0 1 -14,14 h-84 l-22,18 l6,-18 h-12 a14,14 0 0 1 -14,-14 v-46 a14,14 0 0 1 14,-14 z"/>'
    + ''.join(f'<rect class="bar" x="{184 + i * 11}" y="57" width="5" height="40" rx="2.5"/>' for i in range(9)) + '</g>')

# 3. The caller says what they need; it is written down, row by row.
s3 = svg(
    '<circle class="blob" cx="250" cy="170" r="80"/>'
    + bust(70, 204, SKIN_A, '#f08a5d', hair='long', hair_color='#5a3a22', s=0.86)
    + '<g class="say say--dots"><path class="card" d="M96,30 h54 a12,12 0 0 1 12,12 v20 a12,12 0 0 1 -12,12 h-34 l-16,13 l4,-13 h-8 a12,12 0 0 1 -12,-12 v-20 a12,12 0 0 1 12,-12 z"/>'
      '<circle class="dot" cx="111" cy="52" r="4.5"/><circle class="dot" cx="126" cy="52" r="4.5"/><circle class="dot" cx="141" cy="52" r="4.5"/></g>'
    + '<g class="note"><rect class="card" x="178" y="34" width="124" height="134" rx="12"/>'
    + ''.join(f'<g class="row row--{i + 1}"><rect class="label" x="192" y="{52 + i * 38}" width="{(34, 46, 30)[i]}" height="6" rx="3"/>'
              f'<rect class="value" x="192" y="{66 + i * 38}" width="{(70, 82, 58)[i]}" height="7" rx="3.5"/>'
              f'<g class="tick" transform="translate(286 {64 + i * 38})"><circle r="9"/><path d="{TICK}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g></g>' for i in range(3))
    + '</g>')

# 4. The owner, on a job, gets the text and the email.
def phone_in_hand(cx, base, skin, shirt):
    X = lambda v: cx + v; Y = lambda v: base - v
    return (f'<path fill="none" stroke="{shirt}" stroke-width="17" stroke-linecap="round" d="M{X(40)},{Y(6)} Q{X(62)},{Y(20)} {X(56)},{Y(44)}"/>'
            f'<g class="handset"><rect fill="{INK}" x="{X(42)}" y="{Y(96)}" width="34" height="56" rx="7"/><rect fill="#1d2d52" x="{X(45)}" y="{Y(91)}" width="28" height="46" rx="4"/>'
            f'<rect class="ping" x="{X(48)}" y="{Y(86)}" width="22" height="13" rx="5"/><rect fill="#7aa8ff" opacity="0.5" x="{X(48)}" y="{Y(68)}" width="16" height="4" rx="2"/></g>'
            f'<circle fill="{skin}" cx="{X(58)}" cy="{Y(42)}" r="9"/>')
# How the owner is dressed, by the page's trade. 'work' is the home page.
OWNERS = {
    'work':        dict(shirt='#f2a33a', hat='hard', hat_color='#ffd23f', stripes=True),
    'handyman':    dict(shirt='#f2a33a', hat='hard', hat_color='#ffd23f', stripes=True),
    'restaurants': dict(shirt='#d5deef', hat='chef', hat_color='#ffffff', buttons=True),
    'cleaning':    dict(shirt='#1fa3a3', hair='short', hair_color='#2b1d16'),
    'auto':        dict(shirt='#3b5b92', hat='cap', hat_color='#22386b'),
    'it':          dict(shirt='#5b6b8c', hair='short', hair_color='#2b1d16', glasses=True),
}


def owner_scene(kind='work'):
    o = OWNERS[kind]
    extra = ''
    if o.get('stripes'):
        extra = '<rect fill="#fff" opacity="0.7" x="62" y="166" width="8" height="40"/><rect fill="#fff" opacity="0.7" x="114" y="166" width="8" height="40"/>'
    if o.get('buttons'):
        extra = ''.join(f'<circle fill="#8fa2c6" cx="{x}" cy="{y}" r="2.6"/>' for x in (84, 100) for y in (172, 186)) + '<path fill="none" stroke="#aebcd8" stroke-width="2" d="M92,152 L92,204"/>'
    return svg(
        '<circle class="blob" cx="70" cy="40" r="70"/>'
        + bust(92, 204, SKIN_B, o['shirt'], hair=o.get('hair'), hair_color=o.get('hair_color', '#2b1d16'), hat=o.get('hat'), hat_color=o.get('hat_color', '#ffd23f'), glasses=o.get('glasses', False)) + extra
        + phone_in_hand(92, 204, SKIN_B, o['shirt'])
        + '<g class="msg msg--text"><rect x="196" y="38" width="108" height="50" rx="12"/><rect fill="#fff" x="210" y="52" width="56" height="6" rx="3"/><rect fill="#fff" opacity="0.75" x="210" y="65" width="78" height="5" rx="2.5"/><rect fill="#fff" opacity="0.75" x="210" y="75" width="50" height="5" rx="2.5"/></g>'
        + '<g class="msg msg--mail"><rect class="card" x="212" y="102" width="92" height="46" rx="10"/><rect class="env" x="224" y="113" width="32" height="24" rx="4"/><path class="flap" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M226,116 L240,127 L254,116"/><rect class="label" x="264" y="117" width="28" height="5" rx="2.5"/><rect class="label" x="264" y="128" width="20" height="5" rx="2.5"/></g>')


def scene(n, kind='work'):
    """The SVG for step n (1 to 4). Only the last differs by trade."""
    return (s1, s2, s3)[n - 1] if n < 4 else owner_scene(kind)


SLOT = r'(<div class="flow__screen" data-scene="%d">).*?(</div>)'


def put(html, n, kind='work'):
    """`html` with step n's scene written into its slot. Stops if the slot is not there."""
    new, count = re.subn(SLOT % n, lambda m: m.group(1) + scene(n, kind) + m.group(2), html, count=1, flags=re.S)
    if count != 1:
        sys.exit(f'scenes: no slot for scene {n} (a <div class="flow__screen" data-scene="{n}">)')
    return new


if __name__ == '__main__':
    page = Path(__file__).resolve().parent.parent / 'index.html'
    html = page.read_text()
    for n in (1, 2, 3, 4):
        html = put(html, n)
    page.write_text(html)
    print('wrote the four scenes into index.html')
