# Farm Twin AI — Frontend

React 18 + Vite single-page app.

## Run locally

```bash
npm install
npm run dev
```

Runs on port `5173`. The Vite dev server proxies `/api/*` requests to
`http://localhost:8080` (see `vite.config.js`), so make sure the backend
is running too.

## Structure

```
src/
├── App.jsx            Router + sidebar layout
├── App.css             Design tokens & component styles
├── index.css            Base/reset styles
├── pages/               One page per feature module + Dashboard
├── components/           Shared UI: FormField, Badge
└── api/api.js            Axios client wrapping all backend calls
```

## Build for production

```bash
npm run build
```

Outputs to `dist/`. The included `Dockerfile` builds this and serves it
via Nginx, proxying `/api/*` to the `backend` container (see `nginx.conf`).
