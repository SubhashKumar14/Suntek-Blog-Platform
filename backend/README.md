# Backend (Express + MongoDB)

This folder contains the API server for the Suntek Blog Platform.

## Tech Stack

- **Express** (API server)
- **Mongoose** (MongoDB ODM)
- **JWT** stored in an **httpOnly cookie** (`token`)
- **Cloudinary** for profile image uploads

## Running Locally

### 1) Install

```bash
cd backend
npm install
```

### 2) Configure environment

Create `backend/.env`:

```bash
# Required
DB_URL=mongodb+srv://.../your-db
JWT_SECRET=your-dev-secret

# Optional (recommended)
PORT=3000
NODE_ENV=development

# CORS allowlist (recommended)
FRONTEND_URL=http://localhost:5173
# Comma-separated list of additional allowed origins
FRONTEND_URLS=https://your-vercel-app.vercel.app,https://your-custom-domain.com

# Allow *.vercel.app preview deployments
ALLOW_VERCEL_PREVIEWS=false

# Optional (required only if you upload profile images)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Notes:

- Cloudinary config also supports legacy variable names: `CLOUD_NAME`, `API_KEY`, `API_SECRET`.

### 3) Start

```bash
npm start
```

Server starts on `http://localhost:3000` (or `PORT`).

Optional dev mode (uses installed `nodemon`):

```bash
npx nodemon server.js
```

## Concepts

### Auth model (JWT + Cookie)

- Login (`POST /common-api/authenticate`) generates a JWT with `{ userId, role, email }`.
- JWT is stored in an **httpOnly cookie** named `token` (expires in 1 hour).
- Protected routes use `verifyToken(...allowedRoles)`:
  - If roles are passed, access is restricted to those roles.
  - If no roles are passed, any authenticated user is allowed.

### Cookie options

- In **development** (`NODE_ENV !== production`): `sameSite=lax`, `secure=false`
- In **production** (`NODE_ENV=production`): `sameSite=none`, `secure=true`

This is required for cross-site cookies (e.g., Vercel frontend + Render backend).

### CORS allowlist

`server.js` builds an allowlist from:

- `FRONTEND_URL` (single origin)
- `FRONTEND_URLS` (comma-separated origins)
- Default dev origin: `http://localhost:5173`

Optional:

- If `ALLOW_VERCEL_PREVIEWS=true`, any origin ending in `*.vercel.app` is allowed.

## Data Model (MongoDB)

### User

- `firstName` (required)
- `lastName`
- `email` (required, unique)
- `password` (hashed with bcrypt)
- `profileImageUrl` (Cloudinary URL)
- `role`: `USER | AUTHOR | ADMIN`
- `isActive` (default `true`)

### Article

- `author` (User ObjectId, required)
- `title` (required)
- `category` (required)
- `content` (required)
- `comments[]`: `{ user: User, comment: string, createdAt }`
- `isArticleActive` (soft delete flag)

## API Reference (Overview)

Base URL: `http://localhost:3000`

### Health

- `GET /health` → `{ message: "ok" }`

### Common (`/common-api`)

- `POST /common-api/authenticate` (public)
  - Body: `{ email, password, role }`
  - Sets cookie `token` and returns the user payload
- `GET /common-api/check-auth` (public)
  - Returns `{ authenticated: boolean, payload }`
- `GET /common-api/logout` (public)
  - Clears cookie `token`
- `PUT /common-api/change-password` (protected)
  - Body: `{ currentPassword, newPassword }`

### Users (`/user-api`)

- `POST /user-api/users` (public)
  - `multipart/form-data` (recommended): fields + optional file `profileImageUrl`
- `GET /user-api/articles` (protected: `USER`)
  - Returns active articles (`isArticleActive=true`)
- `GET /user-api/article/:id` (protected: any logged-in user)
  - Returns an article with populated author + comments
- `POST /user-api/articles/:articleId/comments` (protected: `USER`)
  - Body: `{ comment }`
- `PUT /user-api/articles` (protected: `USER`, legacy)
  - Body: `{ user, articleId, comment }`

### Authors (`/author-api`)

- `POST /author-api/users` (public)
  - `multipart/form-data` (recommended): fields + optional file `profileImageUrl`
- `POST /author-api/articles` (protected: `AUTHOR`)
  - Body: `{ author, title, category, content }`
- `GET /author-api/articles/:authorId` (protected: `AUTHOR`)
- `PUT /author-api/articles` (protected: `AUTHOR`)
  - Body: `{ articleId, title, category, content, author }`
- `PATCH /author-api/articles/:id/status` (protected: `AUTHOR`)
  - Body: `{ isArticleActive: boolean }`

### Admin (`/admin-api`)

Routes exist for user moderation:

- `GET /admin-api/users`
- `PUT /admin-api/users/:userId/block`
- `PUT /admin-api/users/:userId/unblock`

Note: at the moment, admin routes do not have auth middleware applied in code.

## Testing Requests

The file `req.http` contains example requests for the VS Code REST Client.

## Deployment (Render)

`render.yaml` configures the backend service (build `npm install`, start `npm start`, health check `/health`).

Make sure to set all required env vars in Render:

- `DB_URL`, `JWT_SECRET`
- `FRONTEND_URL` / `FRONTEND_URLS`
- `CLOUDINARY_*` (if using image uploads)
