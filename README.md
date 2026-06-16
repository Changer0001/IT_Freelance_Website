# [Business Name] — Freelance IT Website

A professional, single-page website for an IT support and network setup business. Built with plain HTML, CSS, and minimal JavaScript — no build step, no frameworks, no dependencies.

---

## Customization

Open each file and replace the following placeholders:

| Placeholder | Replace with |
|---|---|
| `[Business Name]` | Your business name (e.g. *SD Tech Solutions*) |
| `[Your Name]` | Your full name |
| `(619) 555-0000` | Your real phone number |
| `6195550000` | Your phone number digits only (used in `tel:` links) |
| `hello@yourdomain.com` | Your real email address |

### Files to update
- **`index.html`** — search for the placeholders above and replace all occurrences
- **`styles.css`** — colors are defined as CSS custom properties in `:root` at the top; tweak `--color-accent` or `--color-bg` to rebrand
- **`script.js`** — see the contact form section below to connect a real form service

---

## Connecting the Contact Form

The form currently runs in **demo mode** — it validates inputs and shows a success message but does not actually send anything. To make it live, choose one of the free services below.

### Option A: Web3Forms (Recommended — free, no backend needed)

1. Go to [web3forms.com](https://web3forms.com) and create a free account
2. Create a new form and copy your **Access Key**
3. In `index.html`, find the `<form>` tag and add a hidden input:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
   ```
4. Change the form's action by updating `script.js`. Replace the demo `setTimeout` block:
   ```js
   // Replace the await new Promise(...) demo block with:
   const formData = new FormData(contactForm);
   const response = await fetch('https://api.web3forms.com/submit', {
     method: 'POST',
     body: formData
   });
   const result = await response.json();
   if (!result.success) throw new Error('Submission failed');
   ```
5. Wrap the above in a `try/catch` to handle errors gracefully

### Option B: Formspree (Alternative — free tier available)

1. Go to [formspree.io](https://formspree.io) and sign up
2. Create a new form and copy your **form endpoint** (e.g. `https://formspree.io/f/abcdef`)
3. In `script.js`, replace the demo block with:
   ```js
   const formData = new FormData(contactForm);
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Accept': 'application/json' },
     body: formData
   });
   if (!response.ok) throw new Error('Submission failed');
   ```
4. Formspree will email you each submission

---

## Deploying to GitHub Pages

### Step 1 — Push to GitHub

If you haven't already, create a repository on GitHub and push your files:

```bash
git init
git add index.html styles.css script.js README.md
git commit -m "Initial website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Open your repository on GitHub
2. Go to **Settings → Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Set the branch to **`main`** and the folder to **`/ (root)`**
5. Click **Save**

Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/` within a minute or two.

### Step 3 (Optional) — Add a Custom Domain

1. In GitHub Pages settings, enter your domain under **Custom domain** (e.g. `www.yourdomain.com`)
2. Click **Save** — this creates a `CNAME` file in your repo automatically
3. Log in to your domain registrar and add a CNAME DNS record:
   - **Name / Host:** `www`
   - **Value / Target:** `YOUR_USERNAME.github.io`
4. For an apex domain (e.g. `yourdomain.com` without `www`), add four A records pointing to GitHub's IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
5. DNS propagation can take up to 48 hours. GitHub will provision an HTTPS certificate automatically once your domain resolves.

---

## Local Development

No build step required. Just open `index.html` in your browser:

```bash
# macOS / Linux
open index.html

# Or use any local server to avoid CORS issues with fonts:
npx serve .
# or
python3 -m http.server 8000
```

---

## File Structure

```
.
├── index.html   # Full single-page site structure
├── styles.css   # All styles (CSS custom properties, responsive grid, animations)
├── script.js    # Nav toggle, sticky header, scroll reveal, form handler
└── README.md    # This file
```

---

## Accessibility Notes

- Semantic HTML5 throughout (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<aside>`)
- All interactive elements are keyboard-navigable with visible `:focus-visible` outlines
- `aria-label`, `aria-expanded`, `aria-controls`, `aria-live`, and `role` attributes applied where needed
- `prefers-reduced-motion` media query disables all CSS animations and JS transitions for users who prefer it
- `<svg>` icons have `aria-hidden="true"` to hide them from screen readers
- Form errors use `role="alert"` and `aria-live="polite"` for screen reader announcements

---

*IT Support & Network Setup · San Diego, CA*
