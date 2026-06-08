# FLIP40.COM

Strategic asset evaluation engine for online business ideas. Client-side only — no backend, no trackers.

## Development

From the repository root:

```bash
npm install
npm run dev
```

Or from this directory (`flip4o/`):

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Static assets

Next.js serves files from `flip4o/public/` only. When adding logos, audio, or favicons, place them here:

- `public/assets/logo/` — WEBP logos
- `public/assets/audio/` — modal ambient MP3s
- `public/assets/svg/` — SVG wordmarks
- `public/` root — favicon.ico, PNG icons, site.webmanifest

A staging copy may exist at the repo root `public/` — sync into `flip4o/public/` before deploy.

## Environment variables

Copy `.env.example` to `.env.local` if needed:

- `NEXT_PUBLIC_COUNTER_ARGUMENTS` — `true` to enable stress counter-arguments in the Verdict card (default: off)

## Deploy on Vercel

1. Push this repository to GitHub/GitLab.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `flip4o`.
4. Build command: `npm run build` (default). Install: `npm ci`.
5. Add domain `flip40.com` and `www.flip40.com` in Vercel → Domains.
6. Set production env: `NEXT_PUBLIC_COUNTER_ARGUMENTS=false` (optional).

## Cloudflare DNS (flip40.com)

In Cloudflare DNS for `flip40.com` (start with **DNS only** / grey cloud):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

After Vercel verifies the domain, set SSL/TLS mode to **Full (strict)**.

Canonical URL: `https://flip40.com` (configured in `lib/constants.ts`).

## Privacy

All evaluation data stays in the browser `localStorage`. See `/privacy`.
