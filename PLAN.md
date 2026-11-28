# Plan: put the scroll story on the website

Status: **approved and built on the work branch (commit d5b916d). Not on the
live site: waiting for the owner's "go".**
Choices made: the six product pages; the story opens the page; film on Home
and Handymen, the other four trades show their own picture for now.
This file is working notes. It comes out of the branch before anything is
published, so it never appears on the public site.

The sample is at https://claude.ai/artifact/1oRfkfc3pfhwuzDVUd5SvH (Version 19).

## What you would get

The story from the sample (headline that comes up slowly, the film, the phone
that slides up and holds in the middle, five steps, the round call button,
"Skip the story") built into the real pages, with each page's own business on
the phone.

## Three choices that are yours

### 1. Which pages

- **Recommended: the six product pages.** Home, Restaurants, Handymen,
  Cleaning, Auto repair, IT support.
- Not the small pages (privacy, terms, SMS, billing, login, IT services, the
  restaurant demo pages, "page not found"). They are short pages people come
  to for one thing; four screens of story in front of that would get in the
  way.

### 2. Where on the page

- **A. It opens the page (recommended, it is what the sample does).** The top
  of the page keeps today's headline, the two buttons and the demo line; the
  story is uncovered as the visitor scrolls. Today's "What happens when
  someone calls" section (the four drawings) is removed, because the story
  says the same thing. The phone at the top of today's page is replaced by
  the story's phone.
- B. The top stays exactly as today, and the story takes the place of the
  "What happens when someone calls" section further down. Safer, but the
  slow headline and the phone sliding up from the bottom lose their effect
  when they are not the first thing on the page.

### 3. The film on the other trades

The film is four clips of tradespeople (a worker in a hi-vis vest and
similar). It suits Home and Handymen. It does not suit a restaurant, a
cleaner, a garage or an IT office.

- **A. Recommended: film on Home and Handymen now; the other four pages get
  the same phone story over their own picture (the one already at the top of
  each page), held still.** Then I look for a free-licence clip for each
  trade and add them one page at a time, showing you each first.
- B. The same tradesperson film on all six pages. Quickest, but a restaurant
  page would open on a building worker.
- C. Find a fitting film for every trade before anything goes on the site.
  Slowest; good free-licence clips are not certain (many of the better ones
  I found earlier were under a restricted licence).

## What changes in the repository

| File | Change |
|---|---|
| `index.html` | The story's markup in the place chosen above |
| `story.css`, `story.js` (new) | The story's styles and script, moved out of the sample |
| `img/story/001.webp` … `198.webp` (new) | The film's frames, about 2.1 MB in all |
| `tools/build_pages.py` | Each trade page gets its own business, caller, question and text on the story's phone, from the data already in this file. The Restaurants page says "booking request", not "job" |
| `for-*.html` (5 pages) | Rebuilt by the tool |
| `site.css`, `script.js` | Small edits only where the story meets the page (the header over the film, the "See how a call goes" button's target) |
| `img/README.md` | The film's source and licence (Mixkit Stock Video Free License, four clips) |

Not touched: the legal pages, billing, login, the contact form, pricing, the
dashboard section, the sitemap.

## Things that stay true

- **Only what the product does.** The story's words are the ones in the
  sample: it tells callers it is an AI assistant, takes the name, number and
  need, sends a text and an email, and nothing is recorded. English only,
  booking requests not confirmed bookings.
- **Made-up businesses and 555 numbers** on the phone, as on the site today,
  with the line "Stock footage. The business and the caller are made up."
  The demo line (831-432-7547) is the only real number.
- **The story is dark in both the light and the dark theme.** It is a film,
  so it keeps one look.
- **Visitors who turn motion off** get the five steps without movement.
- **Weight.** The first screen does not wait for the film; the frames load
  behind it. A visitor on mobile data downloads about 2 MB more than today.
- **No name, no home address** anywhere, as now.

## How I will check it

- `python3 tools/build_pages.py` runs clean (it stops if any expected words
  are missing).
- Each of the six pages measured at seven screen sizes, light and dark theme:
  the phone whole and clear of every edge, the words whole above it, the
  phone fixed in place for the length of the story, no script errors.
- The menu links (How it works, Pricing, Questions, Contact) still land in
  the right place.
- Screenshots of every page for you before anything goes live.

## Order of work

1. Build on the work branch `claude/ai-restaurant-receptionist-mvp-3wbass`.
2. Show you a preview and screenshots.
3. Only on your "go": publish to the live site and confirm the Pages run.
