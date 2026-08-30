# Task Tracker

A full-stack MERN task manager with cookie-based JWT authentication. Every account
gets a private workspace — tasks are scoped to their owner at the database query
level, so no session can read or modify another user's data.

**Live demo:** [Frontend](https://task-tracker-six-plum-38.vercel.app/) · [API](https://task-tracker-7rss.onrender.com)

---

## Features

**Authentication**
- Register, log in, and log out with an httpOnly JWT session cookie
- Passwords hashed with bcrypt (10 salt rounds) and never returned by the API
- Login failures return one generic message so registered emails can't be enumerated
- Protected routes on both the API (middleware) and the client (route guards)
- Session survives a refresh — the app revalidates the cookie against `/auth/me` on load

**Account management**
- Edit name and email, with a uniqueness check on change
- Change password, gated on the current password
- Delete account, which cascades and removes every task the user owns
- Per-user task statistics

**Tasks**
- Full CRUD, scoped to the signed-in user
- Status (Pending / In Progress / Completed) and priority (Low / Medium / High)
- Optional due dates
- Light and dark theme, persisted to `localStorage`
- Responsive layout with toast feedback on every action

---

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, Vite, React Router 7, Axios, react-hot-toast       |
| Backend  | Node.js, Express 5, Mongoose 9                               |
| Database | MongoDB Atlas                                                |
| Auth     | JSON Web Tokens in httpOnly cookies, bcryptjs                |

---

## Project Structure

```
task-tracker/
├── client/
│   └── src/
│       ├── components/     # Navbar, task UI, route guards, loader
│       ├── context/        # AuthProvider + useAuth hook
│       ├── pages/          # Login, Register, Dashboard, Profile, NotFound
│       └── services/       # Axios instance (withCredentials)
└── server/
    ├── config/             # Database connection
    ├── controllers/        # auth, user, task
    ├── middleware/         # protect, notFound, errorHandler
    ├── models/             # User, Task
    ├── routes/             # /api/auth, /api/users, /api/tasks
    └── utils/              # JWT signing and cookie helpers
```

---

## API Reference

Base URL: `/api`. All private routes require the session cookie, which the browser
sends automatically when the client is configured with `withCredentials: true`.

### Auth

| Method | Endpoint         | Access  | Description                     |
| ------ | ---------------- | ------- | ------------------------------- |
| POST   | `/auth/register` | Public  | Create an account and sign in   |
| POST   | `/auth/login`    | Public  | Sign in, sets the token cookie  |
| POST   | `/auth/logout`   | Private | Clear the token cookie          |
| GET    | `/auth/me`       | Private | Current user                    |

### Users

| Method | Endpoint          | Access  | Description                         |
| ------ | ----------------- | ------- | ----------------------------------- |
| PUT    | `/users/profile`  | Private | Update name and email               |
| PUT    | `/users/password` | Private | Change password                     |
| DELETE | `/users/profile`  | Private | Delete account and all of its tasks |
| GET    | `/users/stats`    | Private | Task counts by status               |

### Tasks

| Method | Endpoint     | Access  | Description                    |
| ------ | ------------ | ------- | ------------------------------ |
| GET    | `/tasks`     | Private | List the user's tasks          |
| POST   | `/tasks`     | Private | Create a task                  |
| GET    | `/tasks/:id` | Private | Get one task the user owns     |
| PUT    | `/tasks/:id` | Private | Update one task the user owns  |
| DELETE | `/tasks/:id` | Private | Delete one task the user owns  |

Requests for a task belonging to someone else return `404`, not `403`, so the API
never confirms that an unowned resource exists.

---

## Getting Started

### Prerequisites
Node.js 18+ and a MongoDB connection string.

### Server

```bash
cd server
npm install
cp .env.example .env    # then fill in the values below
npm run dev
```

`server/.env`:

| Variable         | Description                                       |
| ---------------- | ------------------------------------------------- |
| `PORT`           | API port, defaults to `5000`                      |
| `NODE_ENV`       | `development` or `production`                     |
| `MONGO_URI`      | MongoDB connection string                         |
| `JWT_SECRET`     | Long random string — `openssl rand -base64 32`    |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                         |
| `CLIENT_URL`     | Exact client origin allowed to send credentials   |

### Client

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

`client/.env`:

| Variable       | Description                                        |
| -------------- | -------------------------------------------------- |
| `VITE_API_URL` | API base URL including `/api`, e.g. `http://localhost:5000/api` |

---

## Security Notes

- The JWT lives in an httpOnly cookie, so client-side JavaScript — including any
  injected script — cannot read it. This is why the token is not in `localStorage`.
- `CLIENT_URL` must name the client origin exactly. CORS cannot use a wildcard
  origin together with credentials, so the browser would reject the response.
- In production the cookie is sent with `secure: true` and `SameSite=None`, which
  a cross-site deployment (client and API on different domains) requires. Both
  sides must be served over HTTPS.
- Password hashing happens in a Mongoose `pre("save")` hook, so it applies to
  registration and password changes alike, and the field is `select: false` so it
  is never returned by an ordinary query.
