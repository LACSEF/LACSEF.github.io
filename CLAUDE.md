# Claude context — LACSEF website

Static HTML site for the LA County Science & Engineering Fair. No build step, no backend, no framework. README.md has the full editor-facing guide; this file is the short version with the rules I should always follow.

## Always use `uv` for Python

If a task calls for running Python — a one-off script, a local server, anything — invoke it through `uv`, not `python` / `python3` / `pip` directly.

- Run a script: `uv run script.py`
- Run a module: `uv run python -m http.server 8000`
- Add a dependency for a script: `uv add <pkg>` (or `uv run --with <pkg> ...` for one-offs)

Do not call bare `python`, `python3`, `pip`, or `pipx`. If `uv` isn't available, stop and tell the user instead of falling back.

## Stack at a glance

- Plain HTML at the repo root and in [students/](students/).
- Tailwind via CDN — theme tokens live in [js/tailwind-config.js](js/tailwind-config.js); custom CSS goes in [css/styles.css](css/styles.css) only when a utility can't express it.
- Header/footer are shared snippets in [components/](components/), injected at runtime by [js/components.js](js/components.js).
- Schedule data: [data/schedule.json](data/schedule.json) drives both the home timeline and the schedule page.
- News: metadata in [news/articles.json](news/articles.json), bodies as Markdown under `news/posts/<YYYY-MM>/<slug>/`.
- Design system reference: [DESIGN.md](DESIGN.md). Keep it in sync with `js/tailwind-config.js`.

## Local dev

- `npm start` runs `serve` on the static files. Don't open files via `file://` — `fetch()` for header/footer/JSON will fail.
- Python alternative (if asked): `uv run python -m http.server 8000`.

## House rules when editing

- Prefer editing existing files. The repo is intentionally small — don't add scaffolding, build steps, or frameworks.
- HTML: lowercase tags, double-quoted attrs, Tailwind utility classes. Don't strip existing utility classes when changing copy.
- Filenames: lowercase-with-hyphens (`how-to-participate.html`).
- Nav: new top-level pages need a `data-page="<filename>.html"` link in [components/header.html](components/header.html) so the active-link logic works.
- Design tokens: changing a color in `js/tailwind-config.js` means updating [DESIGN.md](DESIGN.md) too.
- Don't touch `node_modules/`, `package-lock.json`, or `downloads/` files unless the task is specifically about them.

## Formatting & commits

- Prettier runs via the husky pre-commit hook on staged `.html`/`.css`/`.js`/`.json`/`.md`. Don't bypass with `--no-verify`.
- If formatting fails on commit, fix it and re-stage — don't `--amend` and don't skip the hook.
- Rules in [.prettierrc](.prettierrc): 100-char lines, 2-space indent, double quotes, semicolons.

## Things to avoid

- No gradient-clipped text — solid colors only (reads as AI-generated otherwise).
- No introducing a build step, bundler, or JS framework.
- No mocking up "future" abstractions; this site is meant to stay simple enough for non-developers to edit.
- No emojis in committed files unless the user explicitly asks.
