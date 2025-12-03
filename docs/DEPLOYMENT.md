# IntakeAI Deployment Guide

This guide explains how to deploy IntakeAI to Render using Docker.

## Prerequisites

- GitHub account with your code pushed
- Render account (free tier works)
- Neon account for PostgreSQL database
- Google AI Studio account for Gemini API key

## Step 1: Set Up Neon Database

1. Go to [Neon](https://neon.tech) and create an account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:pass@host/db?sslmode=require`)
4. Save this for later - this is your `DATABASE_URL`

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Save this for later - this is your `GEMINI_API_KEY`

## Step 3: Generate JWT Secret

Run this command to generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save this for later - this is your `JWT_SECRET`

## Step 4: Deploy Backend to Render

### Option A: Deploy with Docker (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | Name | `intakeai-server` |
   | Region | Oregon (US West) |
   | Branch | `main` |
   | Root Directory | `server` |
   | Runtime | Docker |
   | Instance Type | Free |

5. Add environment variables:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `JWT_SECRET` | Your generated secret |
   | `NODE_ENV` | `production` |
   | `PORT` | `3001` |
   | `FRONTEND_URL` | `https://intakeai-client.onrender.com` (update after deploying frontend) |

6. Click "Create Web Service"

### Option B: Deploy without Docker

1. Same steps as above, but choose:
   - Runtime: Node
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`

## Step 5: Deploy Frontend to Render

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | Name | `intakeai-client` |
   | Branch | `main` |
   | Root Directory | `client` |
   | Build Command | `npm install && npm run build` |
   | Publish Directory | `dist` |

5. Add environment variable:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://intakeai-server.onrender.com/api` |

6. Click "Create Static Site"

## Step 6: Update CORS

After both services are deployed, update the backend's `FRONTEND_URL`:

1. Go to your backend service on Render
2. Click "Environment"
3. Update `FRONTEND_URL` to your frontend's URL (e.g., `https://intakeai-client.onrender.com`)
4. Click "Save Changes" (this will trigger a redeploy)

## Step 7: Run Database Migrations

After the backend is deployed:

1. Go to your backend service on Render
2. Click "Shell" tab
3. Run: `npx prisma migrate deploy`

Or, if you have Render CLI installed:

```bash
render shell intakeai-server
npx prisma migrate deploy
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           RENDER                                     │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐ │
│  │     intakeai-client         │    │     intakeai-server         │ │
│  │     (Static Site)           │    │     (Web Service)           │ │
│  │                             │    │                             │ │
│  │  - React build (dist/)      │───▶│  - Express API              │ │
│  │  - Served by Render CDN     │    │  - Runs in Docker           │ │
│  │                             │    │                             │ │
│  └─────────────────────────────┘    └─────────────────────────────┘ │
│                                                   │                  │
└───────────────────────────────────────────────────│──────────────────┘
                                                    │
                                     ┌──────────────┴──────────────┐
                                     │                             │
                        ┌────────────▼────────────┐  ┌─────────────▼─────────────┐
                        │     NEON                │  │     GOOGLE CLOUD          │
                        │     PostgreSQL          │  │     Gemini AI             │
                        │                         │  │                           │
                        │  Stores all app data    │  │  Generates AI summaries   │
                        └─────────────────────────┘  └───────────────────────────┘
```

## Environment Variables Summary

### Backend (intakeai-server)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection | `postgresql://...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `JWT_SECRET` | Secret for JWT signing | Random 64-char hex |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://intakeai-client.onrender.com` |

### Frontend (intakeai-client)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://intakeai-server.onrender.com/api` |

## Docker Commands Reference

### Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild a specific service
docker-compose build server
docker-compose build client
```

### Testing Docker Builds Locally

```bash
# Build server image
cd server
docker build -t intakeai-server .

# Run server container
docker run -p 3001:3001 --env-file .env intakeai-server

# Build client image
cd client
docker build -t intakeai-client --build-arg VITE_API_URL=http://localhost:3001/api .

# Run client container
docker run -p 80:80 intakeai-client
```

## Troubleshooting

### Backend won't start

1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Make sure DATABASE_URL includes `?sslmode=require`

### CORS errors

1. Check FRONTEND_URL is set correctly (no trailing slash)
2. Redeploy backend after updating FRONTEND_URL

### Database connection errors

1. Verify DATABASE_URL is correct
2. Check Neon dashboard - database might be paused (free tier)
3. Wake up database by visiting Neon dashboard

### Prisma migration errors

Run migrations manually:
```bash
# In Render shell
npx prisma migrate deploy
```

### Frontend can't reach backend

1. Check VITE_API_URL is correct
2. Make sure backend is running (check health endpoint)
3. Check for HTTPS/HTTP mismatches

## Costs

### Free Tier Limitations

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| Render Web Service | Free | Spins down after 15 min inactivity |
| Render Static Site | Free | 100 GB bandwidth/month |
| Neon PostgreSQL | Free | 0.5 GB storage, auto-pause after 5 min |
| Gemini AI | Free | 15 requests/minute, 1500/day |

### Tips for Free Tier

- Backend spins down after inactivity - first request after sleep takes ~30 seconds
- Neon pauses after 5 minutes - first query after pause takes ~2 seconds
- Consider upgrading for production use
