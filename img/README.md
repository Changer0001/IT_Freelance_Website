# Pictures used on the site

Each is the blurred picture behind the top section of one page (`.hero--photo`
and the `.hero--<type>` lines in `site.css`). All came from Unsplash's free
library, under the Unsplash licence: free to use for business, no credit
required. Each was cropped, made smaller, and blurred before it was saved here.

| File | Page | Unsplash image | What it shows |
|---|---|---|---|
| `hero-work.jpg` | Home | `photo-1621905251189-08b45d6a269e` | a tradesperson at an electrical panel |
| `hero-restaurants.jpg` | Restaurants | `photo-1552566626-52f8b828add9` | a restaurant dining room |
| `hero-handyman.jpg` | Handymen | `photo-1505798577917-a65157d3320a` | a man working with a saw indoors |
| `hero-cleaning.jpg` | Cleaning | `photo-1628177142898-93e36e4e3a50` | a gloved hand with a spray bottle |
| `hero-auto.jpg` | Auto repair | `photo-1625047509168-a7026f36de04` | a mechanic under a car's hood |
| `hero-it.jpg` | IT support | `photo-1573164713988-8665fc963095` | a technician beside server racks |

## The film behind the story (`img/story/`)

The story at the top of the Home and Handymen pages (`story.css`, `story.js`)
plays a short film behind the phone: 198 frames, `001.webp` to `198.webp`,
800 by 450, cut at 12 frames a second from four stock clips of tradespeople
and joined in the order the story tells. About 2.3 MB in all. The script
draws the frame that matches how far the page has been scrolled.

The clips came from Mixkit (mixkit.co), each under the **Mixkit Stock Video
Free License**: free for commercial use, no credit required. Mixkit clip
numbers 771, 49933, 1796 and 1443. Many Mixkit clips are under its
*Restricted* licence instead, which does not allow this use: check the
licence named on a clip's own page before adding one.

The other trades' pages have no film yet. They show their own `hero-*.jpg`
behind the phone, held still. To give a trade a film: cut its frames into a
folder here, add the trade to `FILMED` in `tools/build_pages.py`, and give
its page that folder in `data-film`.

The page says "Stock footage. The business and the caller are made up."
under the film, because the people in it are not customers.

The blurred pictures behind the sections further down every page
(`.section--photo` and the `.band--*` lines in `site.css`). Same source and
licence. No faces in these either.

| File | Section | Unsplash image | What it shows |
|---|---|---|---|
| `band-office.jpg` | What it does | `photo-1497366216548-37526070297c` | an empty office |
| `band-laptop.jpg` | Your dashboard | `photo-1516387938699-a93567ec168e` | hands typing on a laptop |
| `band-price.jpg` | Pricing | `photo-1579621970563-ebec7560ff3e` | a seedling growing from a pile of coins |
| `band-phone.jpg` | How it works | `photo-1520923642038-b4259acecbd7` | a telephone on a desk |
| `band-notes.jpg` | Questions | `photo-1517842645767-c639042777db` | a notebook, a pen and a pair of glasses |

The closing "Get in touch" section reuses the page's own `hero-*.jpg`.

A picture behind text is saved already blurred and small (21 to 36 KB), so the
browser does no blurring. To swap one: save the new file under the same name
at 1200 pixels wide, already blurred, then measure the text's contrast over it
in the light theme and adjust that page's `--hero-wash` in `site.css` if any
text falls under 4.5:1.
