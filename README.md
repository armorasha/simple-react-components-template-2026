# React Style Guide

Dark-themed React + Tailwind component style guide page with some standard React components, bundled with webpack (HMR) and served via Docker.

## Run

```
docker compose up
```

Visit http://style-guide-2026.local:3000 (or http://localhost:3000).

## Build (static, no npm/Docker needed to view)

```
docker compose exec web npm run build
```

Output is written to `dist/` on the host (bundle.js + index.html), which is committed to this repo.

## Run dist/index.html on another machine

`dist/` folder is not gitignored for this project, so that the index page can be ran on other machines without building first - which requires build tools.

Copy the `dist/` folder to the other machine, then serve it with any static file server — don't open `index.html` directly via `file://`, since the browser may block the script load. Simplest option (needs only Python 3):

```
cd dist
python3 -m http.server 8000
```

Then visit http://localhost:8000.
