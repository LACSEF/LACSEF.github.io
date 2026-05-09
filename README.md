# LACSEF Website

The Los Angeles County Science & Engineering Fair website — a static HTML site rebuild of [lascifair.org](https://www.lascifair.org/).

This README is for **anyone editing site content or making small UI changes**. You don't need to be a JavaScript developer; most updates are editing HTML or JSON files.

---

## What's in this repo

It's a **static website**. No backend, no database, no build step. You can open the HTML files in a browser (via a local server — see below) and what you see is what ships.

- HTML pages live at the repo root and in [students/](students/).
- Styling uses **Tailwind CSS** loaded from a CDN at runtime (no compile step).
- A few small JavaScript files load shared components (header/footer), render the schedule, and render the news feed.
- Data that changes often (schedule, news articles) lives in JSON files so you don't have to touch HTML to update it.

### Tech stack

| Thing                  | What it is                                        | Where                                          |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------- |
| Markup                 | Plain HTML                                        | `*.html` files                                 |
| Styling                | Tailwind CSS via CDN + a few custom rules         | [css/styles.css](css/styles.css)               |
| Tailwind theme         | Custom colors / typography                        | [js/tailwind-config.js](js/tailwind-config.js) |
| Header/footer          | Shared HTML snippets injected at runtime          | [components/](components/)                     |
| Schedule data          | One JSON file drives the home + schedule pages    | [data/schedule.json](data/schedule.json)       |
| News data              | One JSON file lists articles; bodies are Markdown | [news/](news/)                                 |
| Design tokens          | Colors, type scale, spacing — the visual system   | [DESIGN.md](DESIGN.md)                         |
| Old site nav reference | Map of the previous nav structure for parity      | [nav-links.md](nav-links.md)                   |

---

## Repo layout

```
.
├── home.html                 ← homepage (entry point)
├── schedule.html             ← full schedule + fair day itinerary
├── news.html                 ← news feed listing
├── article.html              ← single-article view (loads ?id=… from URL)
├── judges.html               ← judges info
├── students.html             ← students landing
├── students/                 ← sub-pages linked from students.html
│   ├── how-to-participate.html
│   ├── pre-approval-faq.html
│   ├── student-project-registration.html
│   ├── supervisor-qualifications.html
│   └── understanding-src-results.html
├── category-descriptions.html
├── components/               ← injected at runtime by js/components.js
│   ├── header.html
│   └── footer.html
├── css/
│   └── styles.css            ← custom CSS (most styling is Tailwind classes)
├── js/
│   ├── tailwind-config.js    ← Tailwind theme (colors/fonts/spacing tokens)
│   ├── components.js         ← injects header/footer, marks active nav link
│   ├── schedule.js           ← reads data/schedule.json, renders timelines
│   └── news-feed.js          ← reads news/articles.json, renders ticker + feed
├── data/
│   └── schedule.json         ← schedule single source of truth
├── news/
│   ├── articles.json         ← list of articles (metadata + ordering)
│   └── posts/<YYYY-MM>/<slug>/
│       ├── <slug>.md         ← article body in Markdown
│       └── *.jpg / *.png     ← images for this post live alongside it
├── downloads/                ← static PDFs linked from pages
├── DESIGN.md                 ← design system reference
├── nav-links.md              ← old-site nav inventory
├── package.json              ← dev tooling only (Prettier + git hook)
├── .prettierrc               ← formatting rules
├── .prettierignore           ← files Prettier shouldn't touch
└── .husky/pre-commit         ← runs Prettier on staged files before commit
```

---

## Running the site locally

You **can't** just double-click `home.html`. The page uses `fetch()` to pull in the header, footer, schedule, and news data — and browsers block `fetch()` on `file://` URLs for security. You need a tiny local web server.

Pick whichever you have installed:

```bash
# Option 1: Python 3 (preinstalled on macOS / most Linux)
python3 -m http.server 8000

# Option 2: Node (you'll have it after running `npm install`)
npx serve .

# Option 3: VS Code "Live Server" extension — right-click home.html → Open with Live Server
```

Then open <http://localhost:8000/home.html> in your browser.

> The home page is `home.html`, not `index.html`. If you're hosting somewhere that requires `index.html`, ask whoever set up hosting — it's likely configured at the host level.

---

## How to update common things

### Update the schedule

Edit [data/schedule.json](data/schedule.json). It's the single source of truth for:

- The "2025 Fair Timeline" section on the homepage
- The full "Master Timeline" on the schedule page
- The registration phase boxes and fair-day itinerary on the schedule page

Inside the file:

- `milestones[]` — each milestone has a date, title, short + long description, status (`past` / `current` / `future`), and `featuredOnHome` (true = also show on homepage).
- Other arrays drive the registration phases and fair-day itinerary. The top-of-file `_comment` field documents what each section feeds.

After saving, refresh the page. No code changes needed.

### Add a news article

1. **Write the article body** as a Markdown file at:

   ```
   news/posts/<YYYY-MM>/<slug>/<slug>.md
   ```

   Example: `news/posts/2024-03/judging-tips/judging-tips.md`

2. **Add a metadata entry** to [news/articles.json](news/articles.json):

   ```json
   {
     "id": "judging-tips",
     "file": "2024-03/judging-tips/judging-tips",
     "title": "Tips for First-Time Judges",
     "category": "For Judges",
     "date": "2024-03-10",
     "excerpt": "A short summary that shows up in the feed.",
     "image": "https://…optional cover image URL…",
     "featured": false
   }
   ```

   - `id` must be unique — it's what `article.html?id=…` looks up.
   - `file` is the path under `news/posts/` **without** the `.md` extension.
   - `category` should be one of: `Announcement`, `For Judges`, `Success Stories`, `For Teachers`, `For Students` (anything else falls back to a default style).
   - `date` is `YYYY-MM-DD`. Articles are sorted newest-first by this field.
   - `featured: true` highlights the article on the homepage.

3. **Drop any images** the article references into the **same folder as the post** (e.g., `news/posts/2024-03/judging-tips/cover.jpg`) and link them with a relative path from the Markdown file (`![Cover](cover.jpg)`).

### Edit page text

For most pages, just open the `.html` file and edit the text between the tags. The HTML uses Tailwind utility classes (e.g., `class="text-primary font-headline-lg"`) — leave those alone unless you're intentionally restyling.

### Update the header or footer

Both are shared across every page. Edit them in **one** place:

- [components/header.html](components/header.html) — top nav
- [components/footer.html](components/footer.html) — bottom links

When the page loads, [js/components.js](js/components.js) replaces `<div id="site-header">` / `<div id="site-footer">` placeholders with these files' contents. It also reads `data-page="…"` on each nav link and visually marks the one matching the current page.

So if you add a new top-level nav link, give the `<a>` a `data-page="<filename>.html"` attribute matching the page it links to.

### Add a new page

1. Copy an existing page (e.g., `judges.html`) as your starting point — it already has the right `<head>` setup, header/footer placeholders, and styling.
2. Rename it (e.g., `volunteers.html`) and edit the body.
3. If it should appear in the top nav, add a link in [components/header.html](components/header.html) with `data-page="volunteers.html"`.

### Change colors, fonts, or spacing

Visual tokens are defined in two coordinated places:

- [DESIGN.md](DESIGN.md) — the human-readable spec. Read this first to understand the system before changing values.
- [js/tailwind-config.js](js/tailwind-config.js) — where those tokens become actual Tailwind classes (`bg-primary`, `text-on-surface`, etc.).

If you change a color in `tailwind-config.js`, update DESIGN.md to match so they stay in sync.

For one-off custom styles that don't fit Tailwind, add them to [css/styles.css](css/styles.css).

### Add or replace a downloadable PDF

Drop the file in [downloads/](downloads/) and link to it with a relative path:

```html
<a href="downloads/judging-interviews.pdf">Judging & Interviews Guide</a>
```

---

## First-time setup

You'll need [Node.js](https://nodejs.org/) installed (any recent LTS works). Then, in this directory:

```bash
npm install
```

That's it. This:

- Installs Prettier (formatter), husky (git hook manager), and lint-staged (runs the formatter on only the files you're committing).
- Wires up the pre-commit hook automatically (via husky's `prepare` script).

You only need to do this **once per clone** of the repo.

---

## Pre-commit hook (auto-formatting)

Every time you run `git commit`, the hook runs Prettier on the files you staged and re-stages the formatted versions before the commit completes. You don't have to think about it — just write code and commit.

It formats:

- `.html`, `.css`, `.js`, `.json`, `.md`

It ignores:

- Anything in [.prettierignore](.prettierignore) (`node_modules/`, `downloads/`, `.git/`, `package-lock.json`)

### Useful commands

```bash
# Format every file in the repo (run once if you want to clean up the backlog)
npm run format

# Check formatting without changing anything (useful in CI)
npm run format:check
```

### Tweak the formatting rules

Edit [.prettierrc](.prettierrc). Current defaults: 100-char lines, 2-space indent, double quotes, semicolons. After changing, run `npm run format` to apply the new rules everywhere.

### If the hook misbehaves

```bash
# See what the hook actually runs
cat .husky/pre-commit

# Run it manually to debug
.husky/pre-commit

# Re-install hooks (if they got removed somehow)
npm run prepare
```

To **bypass the hook for a single commit** (rare — usually only for an emergency or a commit that's intentionally not in our format):

```bash
git commit --no-verify -m "…"
```

Use sparingly. The hook exists so the repo stays consistent.

---

## Code style notes

- **HTML:** Tailwind utility classes, lowercase tags, double-quoted attributes. Prettier handles indentation.
- **JS:** Plain ES modules, no framework. Keep it small and readable; if a file is starting to get complicated, that's a signal to ask before adding more.
- **CSS:** Add to [css/styles.css](css/styles.css) only when Tailwind utilities can't express what you need.
- **Filenames:** Lowercase with hyphens (`how-to-participate.html`, not `HowToParticipate.html`).

---

## Workflow for a typical change

1. Pull latest: `git pull`
2. Make your edits.
3. Open the site locally (`python3 -m http.server 8000`) and check it looks right — including the page on a narrow window (mobile layout).
4. `git add <files>` and `git commit -m "short message"` — the hook will format on the way through.
5. `git push`.

If you're working on something bigger, make a branch (`git checkout -b your-change`) and open a pull request instead of pushing directly to `main`.

---

## Where to ask for help

- **Design questions** ("what color should this be?", "what's the right type size?") → [DESIGN.md](DESIGN.md) first; if it's not there, ask in chat.
- **Old site behavior** ("what was on this page before?") → [nav-links.md](nav-links.md) is a map of the legacy site's URLs.
- **Something broke after I edited a file** → check the browser console (F12 → Console tab); errors there usually point at the problem (typo in JSON, missing file, etc.).
- **Anything else** → ask the maintainer.
