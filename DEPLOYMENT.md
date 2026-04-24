# Deployment Guide (Vercel + Render)

This project is configured for:

- Frontend: Vercel (Vite React app in `frontend`)
- Backend: Render Web Service (Node app in `backend`)

## 1. Backend on Render

Use the existing `render.yaml` from repo root.

Required backend env vars:

- `DB_URL`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL` (your Vercel production URL, e.g. `https://your-app.vercel.app`)

Optional backend env vars:

- `FRONTEND_URLS` (comma-separated extra allowed origins)
- `ALLOW_VERCEL_PREVIEWS` (`true` to allow all `*.vercel.app` preview origins)

Health endpoint:

- `GET /health`

## 2. Frontend on Vercel

Set Vercel project root directory to:

- `frontend`

Add frontend env var in Vercel:

- `VITE_API_URL=https://<your-render-service>.onrender.com`

`vercel.json` already includes SPA rewrite to `index.html`.

## 3. Cookie + CORS behavior

Backend now uses:

- `sameSite: none` and `secure: true` in production (`NODE_ENV=production`)
- CORS allowlist via `FRONTEND_URL` / `FRONTEND_URLS`

This is required for cross-site auth cookies between Vercel and Render.

## 4. Local development

- Frontend `.env`: use `VITE_API_URL=http://localhost:3000`
- Backend `.env`: use `FRONTEND_URL=http://localhost:5173`

Env templates are available at:

- `frontend/.env.example`
- `backend/.env.example`