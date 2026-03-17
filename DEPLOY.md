# Deploying AI Interview Simulator to Vercel

This repo is a monorepo with three parts:
- `frontend` — Vite + React application (served as a static site)
- `backend` — Node/Express API (currently a standalone server)
- `ai-agent` — Python FastAPI agent (requires a Python runtime)

This project includes a `vercel.json` that tells Vercel to build the `frontend` as the primary project.

## Recommended deployment approach

1. Frontend (Vercel)
   - Deploy the `frontend` to Vercel (this repo's root has a `vercel.json` that builds `frontend/package.json`).
   - In the Vercel dashboard, set environment variables used by the frontend (e.g. API endpoints or keys) under Project Settings → Environment Variables.

2. Backend (two options)
   - Option A: Deploy the Express `backend` as a separate Vercel project by migrating endpoints to Vercel Serverless Functions (move routes into an `/api` directory and update handlers), or
   - Option B: Host the `backend` on a platform that supports Node processes (Render, Railway, Heroku) and set the frontend to call that backend URL.

3. AI Agent (`ai-agent`)
   - The `ai-agent` uses Python and is better hosted on a platform that supports Python/ASGI apps (e.g. Render, Fly, Railway, or a container service). Vercel currently supports Python functions but not long-running ASGI processes in a straightforward way.

## Quick deploy steps (frontend only)

1. Install Vercel CLI (optional locally):

```bash
npm i -g vercel
```

2. From the repo root, run:

```bash
vercel login
vercel --prod
```

When prompted, choose the current directory as the project root — `vercel.json` will make Vercel run the frontend build.

3. Add environment variables in the Vercel dashboard for any keys referenced by the frontend.

## Vercel Deployment (Recommended)

This project is optimized for deployment on Vercel as three separate services. Follow these steps in order:

### 1. AI Agent (`ai-agent`)
- **Root Directory**: `ai-agent`
- **Framework Preset**: `Other` (Vercel will detect `app.py` and `vercel.json`)
- **Environment Variables**:
  - `GROQ_API_KEY`: Your Groq API key.

### 2. Backend (`backend`)
- **Root Directory**: `backend`
- **Framework Preset**: `Other` (Vercel will detect `server.js` and `vercel.json`)
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB Atlas URI.
  - `AI_AGENT_URL`: The URL of your deployed AI Agent.
  - `INTERNAL_API_KEY`: A secret key for backend-to-agent talk.
  - `JWT_SECRET`: Secret for user tokens.

### 3. Frontend (`frontend`)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your deployed Backend.

---

## Local Development
Refer to the individual `README.md` files in each directory for local setup instructions.
