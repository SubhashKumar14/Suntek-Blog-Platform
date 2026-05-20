# Frontend (React + Vite)

This folder contains the React UI for the Suntek Blog Platform.

## Tech Stack

- **React 19**
- **React Router** (routing)
- **Tailwind CSS** (styling)
- **Zustand** (auth state)
- **Axios** (API calls)
- **react-hot-toast** (notifications)

## Running Locally

### 1) Install

```bash
cd frontend
npm install
```

### 2) Configure environment

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
```

Notes:

- If `VITE_API_URL` is not set in dev mode, the app falls back to `http://localhost:3000`.
- In production (Vercel), you should always set `VITE_API_URL`.

### 3) Start

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Concepts

### Cookie-based auth

The frontend does not store tokens. Instead:

- Login calls `POST /common-api/authenticate`.
- Backend sets an **httpOnly cookie**.
- Axios is configured with `withCredentials: true` so cookies are included automatically.
- On refresh, `RootLayout` calls `GET /common-api/check-auth` to restore the session.

### API client

The shared Axios instance is in `src/lib/apiClient.js` and uses:

- `baseURL = VITE_API_URL` (trimmed and without trailing slashes)
- `withCredentials = true` (required for cookie auth)

## Routes / Screens

Defined in `src/App.jsx`:

- `/` — home (placeholder)
- `/register` — user/author registration (supports profile image upload)
- `/login` — login with role selection (USER/AUTHOR/ADMIN)
- `/user-profile` — shows active articles (grid)
- `/author-profile/*` — author dashboard
  - `/author-profile/articles` — author’s own articles
  - `/author-profile/write-article` — create article
- `/article/:id` — article details + comments + author actions
- `/edit-article/:id` — edit article

## Key UI Behaviors

### Toast notifications

`react-hot-toast` is mounted in `App.jsx`:

```jsx
<Toaster position="top-center" reverseOrder={false} />
```

Example usage:

```js
import { toast } from "react-hot-toast";

toast.success("Account created successfully");
toast.error("Something went wrong");
```

### Responsive article grids

Both User and Author article lists render as card grids that adapt by screen size:

- 1 card (extra small)
- 2 cards (small)
- 3 cards (medium)
- 4 cards (large and up)

### Article view (IST timestamps)

When a User/Author opens an article:

- The page fetches `GET /user-api/article/:id`.
- Title/category/content are displayed along with author name.
- Timestamps are formatted in `Asia/Kolkata`.

### Comments

- If logged in as `USER`, the article page shows a comment form.
- Comment submission calls `POST /user-api/articles/:articleId/comments`.

## Deployment (Vercel)

- SPA routing is handled by `vercel.json` rewrite to `/index.html`.
- Set `VITE_API_URL` for:
  - Production environment
  - Preview environment (if you use preview deployments)

If you see CORS issues on Vercel, update the backend allowlist (`FRONTEND_URL` / `FRONTEND_URLS`) and ensure backend runs with `NODE_ENV=production`.

