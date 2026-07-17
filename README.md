# React Style Guide

Dark-themed React + Tailwind component style guide page with some standard React components, bundled with webpack (HMR) and served via Docker.

## Run

```
cp .env.example .env
docker compose up
```

`.env` is gitignored and `docker-compose.yml` requires it (`env_file: .env`) —
skip the `cp` and `docker compose up` fails immediately with `env file .env
not found`, before the container even starts.

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

## "Module not found" errors after adding a package

If `docker compose up` shows `Module not found` errors for packages that are clearly in `package.json`, it's caused by `docker-compose.yml` mounting `node_modules` as an anonymous volume (`- /app/node_modules`). That volume persists across container recreates independent of the image, so it can keep serving a stale `node_modules` even after rebuilding the image with the right dependencies.

Fix:

```
docker compose down -v
docker compose up -d --build
```

`down -v` drops the stale anonymous volume, `--build` forces a fresh `npm install` against the current `package.json`. A plain `docker compose up` or `--build` alone is not enough after adding a new npm package.
