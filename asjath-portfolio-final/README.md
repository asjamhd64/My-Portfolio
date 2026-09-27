# Asjath Mubeen — Portfolio

Full-stack personal portfolio:

- **Frontend:** React 18 + Vite, Three.js / React Three Fiber, GSAP
- **Backend:** Node.js + Express (contact API, health check)

## Requirements

- Node.js **18+** (recommended 20+)
- npm 9+

## Project structure

```
portfolio/
├── index.html
├── package.json              # frontend deps
├── vite.config.js
├── .env.example              # VITE_API_URL
├── public/                   # static assets (favicon, almas preview, etc.)
├── src/                      # React app
│   ├── components/
│   ├── sections/
│   ├── config/               # social + contact details
│   ├── hooks/
│   └── lib/api.js
└── server/                   # Express API
    ├── package.json
    ├── .env.example
    ├── server.js
    ├── routes/
    ├── controllers/
    ├── middleware/
    └── utils/
```

## Quick start

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:5000`  
Health: `GET http://localhost:5000/api/health`  
Contact: `POST http://localhost:5000/api/contact`

### 2. Frontend

```bash
# from portfolio root
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

### Production frontend build

```bash
npm run build
npm run preview
```

Output: `dist/`

## Environment variables

### Frontend (`.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend origin, e.g. `http://localhost:5000` |

### Backend (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Default `5000` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) |
| `JSON_BODY_LIMIT` | Body size (default `32kb`) |
| `CONTACT_RATE_MAX` | Max contact posts per window |
| `CONTACT_RATE_WINDOW_MS` | Rate-limit window (default 15 min) |
| `TRUST_PROXY` | `1` if behind nginx/Cloudflare |

Never commit real SMTP passwords, API keys, or database URLs.

## Optional local assets

Place these in `public/` when ready (placeholders are included):

| File | Purpose |
|------|---------|
| `Asjath_Mubeen_CV.pdf` | Download CV button |
| `profile.jpg` | About section photo |

Configure social URLs in `src/config/socialLinks.js` (empty strings hide each network).

## Features overview

- Loader + 3D welcome (WebGL fallback + reduced-motion path)
- Interactive 3D hero (lazy-loaded)
- Projects, skills, about, contact form
- Mobile navigation, SEO meta, accessibility basics
- Hardened contact API (validation, sanitization, rate limit, honeypot)

## Troubleshooting

- **Contact form fails:** Ensure the backend is running and `VITE_API_URL` matches.
- **CORS errors:** Add your frontend origin to `CORS_ORIGIN` in `server/.env`.
- **3D blank:** GPU/WebGL unavailable — CSS fallbacks should appear; try another browser.
- **Port in use:** Change `PORT` or Vite’s port (`npm run dev -- --port 5174`).

## License

Personal portfolio project — © Asjath Mubeen.
