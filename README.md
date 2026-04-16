# Social Media Dashboard

This repository contains a full-stack social media dashboard with a Vite + React frontend and an Express backend. It currently runs as a polished prototype: the UI is functional, the API is active, and the backend also includes a partially prepared Sequelize/PostgreSQL layer for a future upgrade from mock data to persistent storage.

## Overview

The project is split into two applications:

- `social-media-dashboard-frontend`: React app for authentication, dashboard views, analytics, post management, and scheduling
- `social-media-dashboard-backend`: Express API with mock auth/post routes, plus Sequelize models/controllers for future database-backed behavior

This makes the repo useful in two ways:

- as a demo-ready social media management dashboard
- as a starter codebase for a more complete production backend

## Features

- User registration and login
- Protected frontend routes
- Dashboard summary screen
- Post creation, editing, deletion, and scheduling
- Analytics overview UI for multiple platforms
- Content scheduler with calendar view
- Backend API for auth and post management
- Sequelize models for users, posts, analytics, and social accounts

## Project Structure

```text
social-media-dashboard-main/
|-- README.md
|-- social-media-dashboard-backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- package.json
|   |-- server.js
|   |-- test-api.js
|   `-- test-database.js
`-- social-media-dashboard-frontend/
    |-- public/
    |-- src/
    |-- package.json
    `-- README.md
```

## Tech Stack

### Frontend

- React 18
- Vite
- React Router 6
- Material UI
- MUI X Date Pickers
- Axios
- react-big-calendar
- Chart.js and react-chartjs-2

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL driver (`pg`)
- bcryptjs
- jsonwebtoken
- helmet
- cors
- morgan
- express-validator

## Current Backend State

The backend has two layers right now:

### Active layer

The currently mounted routes in `server.js` use mock in-memory data:

- `routes/auth.js`
- `routes/posts.js`

These are what the frontend talks to today.

### Prepared layer

The repo also includes a more advanced backend path that is not yet wired into `server.js`:

- `controllers/authController.js`
- `controllers/postController.js`
- `middleware/auth.js`
- `middleware/validation.js`
- Sequelize models in `models/`

That code is the foundation for moving to real JWT auth and PostgreSQL persistence later.

## API Endpoints

The active backend exposes:

- `GET /`
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/scheduled`
- `GET /api/posts/:id`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

Typical success response:

```json
{
  "success": true,
  "data": {}
}
```

Typical error response:

```json
{
  "success": false,
  "error": "Something went wrong"
}
```

## Important Fixes Included

The current cleanup improves both correctness and maintainability:

- fixed route ordering so `/api/posts/scheduled` no longer conflicts with `/api/posts/:id`
- made mock auth return the actual logged-in user instead of a hardcoded user payload
- made mock post routes respect the user id encoded in the mock token
- migrated the frontend from Create React App to Vite to remove the vulnerable legacy build chain
- updated the post scheduling UI to use the MUI X v6 date picker API shape
- made the frontend auth redirect safer in non-browser contexts
- added useful backend scripts for running the server and smoke tests
- added a root package with one-command startup for the whole app

## Local Setup

## 1. Install Everything

From the repo root:

```powershell
cd c:\Users\HP\Desktop\social-media-dashboard-main
npm install
npm run install:all
```

This installs:

- the root helper package for one-command startup
- backend dependencies
- frontend dependencies

## 2. Configure Environment Variables

The active mock API can start with only a few values, but the Sequelize/database layer expects the following shape:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development

JWT_SECRET=change-me
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
```

## 3. Start The Whole Application

Single command from the repo root:

```powershell
npm run dev
```

That starts:

- backend on `http://localhost:5000`
- frontend on `http://localhost:3000`

## 4. Optional Per-App Commands

```powershell
cd social-media-dashboard-backend
npm run dev
```

Backend scripts:

- `npm start`: run the API
- `npm run dev`: run the API with nodemon
- `npm test`: run `test-api.js`
- `npm run test:db`: run `test-database.js`

Frontend:

```powershell
cd ..\social-media-dashboard-frontend
npm run dev
```

The frontend runs on `http://localhost:3000`.

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Demo Credentials

The mock auth route includes a seeded demo account:

- email: `admin@example.com`
- password: `Admin123!`

You can also register a new account from the UI.

Note: the current live auth and post routes store data in memory, so restarting the backend resets users and posts.

## Frontend Flow

### Authentication

1. User logs in or registers.
2. Backend returns a mock bearer token and a user object.
3. The token is stored in `localStorage`.
4. `AuthContext` loads the user and protects private routes.

### Post Management

1. `Posts.js` fetches posts from `/api/posts`.
2. Create and update actions send `content`, `platforms`, `postType`, and optional `scheduledAt`.
3. A scheduled post is rendered in both the posts page and the scheduler page.
4. `PostCard.js` displays status, platform icons, and timestamps.

## Database-Ready Files

These files point toward the next phase of the app:

- `social-media-dashboard-backend/models/User.js`
- `social-media-dashboard-backend/models/Post.js`
- `social-media-dashboard-backend/models/SocialAccount.js`
- `social-media-dashboard-backend/models/Analytics.js`
- `social-media-dashboard-backend/controllers/authController.js`
- `social-media-dashboard-backend/controllers/postController.js`
- `social-media-dashboard-backend/middleware/auth.js`
- `social-media-dashboard-backend/middleware/validation.js`

To fully activate them, the next step is wiring controller-based routes into `server.js` and connecting a live PostgreSQL database.

## Known Limitations

- active API routes are mock and in-memory
- analytics data is static in the frontend
- scheduler actions are mostly visual and not yet deeply interactive
- no end-to-end media upload flow is implemented
- no single root command starts frontend and backend together

## Suggested Next Steps

- add a root `package.json` with combined dev scripts
- add `.env.example` files for frontend and backend
- replace active mock routes with controller + database wiring
- add integration tests for auth and posts
- connect real social platform APIs
- make analytics dynamic and backend-driven

## Troubleshooting

### Frontend command changed

The frontend no longer uses `react-scripts`. Use:

```powershell
cd social-media-dashboard-frontend
npm run dev
```

### `Cannot find module 'express'`

Backend packages are not installed yet:

```powershell
cd social-media-dashboard-backend
npm install
```

### Why do registered users disappear after restart?

The active backend stores auth and posts in memory only. Restarting the backend clears that data.

## Summary

This is a solid social media dashboard prototype with a working frontend, a demo-friendly mock API, and a partially prepared real backend architecture. It is now in better shape for both showcasing and continuing development.
