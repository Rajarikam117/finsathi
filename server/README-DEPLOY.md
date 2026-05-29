# Deploying FinSathi Backend

This file explains how to deploy the `server` (Express) to Render or Railway and how to connect the frontend on Vercel.

Environment variables required:
- `GROQ_API_KEY` (from `server/.env`)
- `CORS_ORIGIN` (set to your frontend URL, e.g. `https://your-app.vercel.app` or `*`)

Render (GitHub integration):
1. Push your repo to GitHub.
2. In Render dashboard, create a new Web Service and connect the repo.
3. Set the Root to `/server` and the Build Command to `npm install`.
4. Start Command: `npm start`.
5. Add environment variables in the Render dashboard (`GROQ_API_KEY`, `CORS_ORIGIN`). Render will provide a URL once deployed.

Railway (GitHub or CLI):
1. Create a new Railway project and link your repo (choose the `server` folder as the service root).
2. Railway will detect a Node service. Set the Environment Variables (`GROQ_API_KEY`, `CORS_ORIGIN`).
3. Deploy; Railway provides a service URL.

Connecting to Vercel frontend:
1. Deploy the `client` to Vercel (set project root to `client`).
2. In Vercel Project Settings → Environment Variables, add `VITE_API_BASE_URL` (or whatever your client expects) with the backend URL from Render/Railway, e.g. `https://finsathi-backend.onrender.com/api`.
3. Set `CORS_ORIGIN` on the backend to your Vercel domain.

Notes:
- The server listens on `process.env.PORT` (default 5000). Hosts like Render/Railway set `PORT` automatically.
- If you prefer Docker, add a `Dockerfile` in `/server` and deploy via each provider's Docker option.
