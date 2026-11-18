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

The four pictures above the "How it works" steps, on every page (`.step__pic`).
Same source and licence. Not blurred. Objects and hands only: the owner asked
for pictures with no faces, so a replacement must have none either.

| File | Step | Unsplash image | What it shows |
|---|---|---|---|
| `step-1.jpg` | Your phone rings first | `photo-1520923642038-b4259acecbd7` | a telephone on a desk |
| `step-2.jpg` | It answers like your front desk | `photo-1553775282-20af80779df7` | a headset beside a laptop |
| `step-3.jpg` | It takes the details | `photo-1484480974693-6ca0a78fb36b` | a hand writing in a notebook |
| `step-4.jpg` | You get a text and an email | `photo-1423666639041-f56000c27a9a` | a hand holding a phone over a laptop |

A picture behind text is saved already blurred and small (21 to 36 KB), so the
browser does no blurring. To swap one: save the new file under the same name
at 1200 pixels wide, already blurred, then measure the text's contrast over it
in the light theme and adjust that page's `--hero-wash` in `site.css` if any
text falls under 4.5:1.
