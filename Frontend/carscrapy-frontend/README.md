# CarScrapy Frontend

React + TypeScript + Vite single-page app for the CarScrapy microservices
platform. One codebase serves five role areas, routed by the `role` claim in
the JWT.

| Area        | Route prefix   | Allowed roles |
| ----------- | -------------- | ------------- |
| Customer    | `/dashboard`   | `USER`        |
| Guest       | `/dashboard`   | `GUEST`       |
| Admin       | `/admin`       | `ADMIN`       |
| Staff       | `/staff`       | `STAFF`       |
| Super admin | `/super-admin` | `SUPER_ADMIN` |

Guests sign in through `POST /guest/register` (a throwaway account) and then
use the exact same screens as a normal customer. There is no reduced feature
set — the only differences are cosmetic (a guest banner and badge).

## Requirements

- Node.js 20+ (developed on 22)
- The backend gateway reachable on `http://localhost:8080` for local work

## Getting started

```bash
npm ci
cp .env.example .env   # optional; defaults work out of the box
npm run dev            # http://localhost:5173
```

### Scripts

| Command             | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server with API proxy                    |
| `npm run build`     | Type-check then production build to `dist/`  |
| `npm run preview`   | Serve the built output locally               |
| `npm run typecheck` | Types only, no emit                          |
| `npm run clean`     | Remove `dist/`                               |

## How API calls work

Every request goes through `src/api/client.ts`, which:

- prefixes the API base (`/api` by default, overridable with `VITE_API_BASE_URL`)
- attaches the `Bearer` token from `localStorage` unless the call is anonymous
- enforces a 20s timeout so the UI can never hang indefinitely
- tags each request with an `X-Request-Id` for log correlation
- broadcasts a `carscrapy:unauthorized` event on `401`, which `AuthProvider`
  turns into a clean sign-out
- parses backend errors into `HttpError`

The `/api` prefix works in both environments without code changes:

- **dev** — Vite proxies `/api/*` → `http://localhost:8080/*`
- **prod** — NGINX proxies `/api/` → `http://api-gateway:8080/`

### Collections

`api.list()` and `api.postList()` guarantee an array result even if the
server or a proxy returns something unexpected, so `.map()` / `.find()` in
components can never throw.

## Error handling

Three layers, so a failure never leaves a blank page:

1. **`ErrorBoundary`** — catches render crashes and shows a recoverable
   screen instead of white-screening.
2. **`ErrorState`** — inline, per-section failure UI with a retry button.
3. **`toastError()`** — user-facing toast that appends a short support
   reference for unexpected (5xx / network) failures.

## Deployment

Build a container image:

```bash
docker build -t carscrapy-frontend .
docker run -p 80:80 carscrapy-frontend
```

`nginx.conf` in the repo root is copied into the image and provides the SPA
fallback, gzip, static-asset caching, security headers, and the `/api`
reverse proxy. It expects a service named `api-gateway` on the Compose
network — adjust the `proxy_pass` host if yours differs.

### Caching behaviour

- `/assets/*` — fingerprinted by Vite, cached for one year (`immutable`)
- `index.html` — never cached, so users always receive the current bundle
- `404` fallback — unmatched routes serve `index.html` so client-side routing works

## Project layout

```
src/
  api/          one module per backend service (client, auth, car, yard, booking)
  components/   shell + shared UI primitives (Button, Field, Modal, …)
  features/     screens grouped by area (auth, dashboard, admin, staff, superadmin)
  lib/          auth context, token store, query client, toast helper
  routes/       router, guards, 404
  types/        API DTOs and enums mirroring the Java contracts
```

## Notes / known constraints

- Enum values in `src/types/enums.ts` must match the Java enums exactly.
  They are the single source of truth for every dropdown and payload.
- `CAR_CITIES` (car-service) and `INDIAN_CITIES` (yard-service) are two
  *different* enums and are intentionally kept separate.
- The dashboard figures are live counts from the API, not placeholders.