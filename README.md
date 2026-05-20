# Suntek Blog Platform

Full‑stack blog platform built with **React (Vite)** + **Express** + **MongoDB**.

- **Frontend**: React 19, React Router, Tailwind CSS, Zustand, Axios
- **Backend**: Express, Mongoose, JWT auth in an **httpOnly cookie**, Cloudinary for profile images

## Features

- Role-based accounts: **USER**, **AUTHOR**, **ADMIN**
- Registration with optional **profile image upload** (JPG/PNG, up to 2MB)
- Login creates a JWT session stored in an **httpOnly cookie** (no localStorage tokens)
- Session restore on refresh (`/common-api/check-auth`)
- Articles
  - Author: create, edit, soft delete/restore
  - User: browse active articles
- Comments: users can add comments to articles and see commenter details
- Production-ready CORS + cookie settings (supports Vercel + Render)

## Repo Structure

```
.
├─ backend/                 # Express API + MongoDB models
├─ frontend/                # React UI (Vite)
└─ render.yaml              # Render deployment config for backend
```

For deeper docs:

- Backend docs: `backend/README.md`
- Frontend docs: `frontend/README.md`

## Quick Start (Local)

### 1) Backend

Create `backend/.env` (see the backend README for full list):

```bash
DB_URL=mongodb+srv://.../your-db
JWT_SECRET=your-dev-secret
FRONTEND_URL=http://localhost:5173
```

Run:

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:3000` by default.

### 2) Frontend

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Run:

```bash
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Environment Variables (Summary)

### Backend (`backend/.env`)

- `DB_URL` (required): MongoDB connection string
- `JWT_SECRET` (required): secret used to sign JWT cookies
- `PORT` (optional): server port (default `3000`)
- `NODE_ENV` (optional): set to `production` on deploy (affects cookie + CORS)
- `FRONTEND_URL` / `FRONTEND_URLS` (recommended): CORS allowlist
- `ALLOW_VERCEL_PREVIEWS` (optional): `true` to allow `*.vercel.app`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional but needed for profile image uploads)

### Frontend (`frontend/.env`)

- `VITE_API_URL` (recommended): base URL of the backend, e.g. `https://your-render-app.onrender.com`

## Deployment Notes

- Backend is configured for **Render** using `render.yaml`.
- Frontend is configured for **Vercel** (SPA rewrites in `frontend/vercel.json`).

Important for deployments:

- When frontend and backend are on different domains, the app relies on **cross-site cookies**.
- Set backend `NODE_ENV=production` so cookies use `secure: true` and `sameSite: none`.
- Add your Vercel domain(s) to backend CORS allowlist using `FRONTEND_URL` or `FRONTEND_URLS`.

## Troubleshooting

- **CORS: “Not allowed by CORS”**
  - Set `FRONTEND_URL` (and/or `FRONTEND_URLS`) on backend to include your frontend origin.
- **Logged out after refresh on Vercel**
  - Ensure backend uses `NODE_ENV=production` and both sites are served over HTTPS.
  - Verify `VITE_API_URL` points to the correct backend and that backend CORS allowlist includes the frontend origin.
