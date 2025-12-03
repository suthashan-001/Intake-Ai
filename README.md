# IntakeAI

AI-powered patient intake system for doctors in Ontario. IntakeAI transforms lengthy patient intake forms into structured clinical summaries, saving healthcare providers 20-30 minutes per patient.

## Features

- **Smart Intake Forms** - Guided 3-step patient intake form with mobile-friendly design
- **AI-Powered Summaries** - Gemini AI generates structured clinical summaries from patient responses
- **Red Flag Detection** - Safety concerns are automatically identified and highlighted
- **Secure Authentication** - JWT-based authentication with access/refresh token pattern
- **Patient Management** - Full CRUD operations for managing patient records
- **Shareable Intake Links** - Generate unique, expiring links to send to patients

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS |
| Backend    | Node.js, Express 5, TypeScript           |
| Database   | PostgreSQL (Neon)                        |
| ORM        | Prisma                                   |
| AI         | Google Gemini API                        |
| Auth       | JWT (access + refresh tokens), bcrypt    |
| Deployment | Docker, Render                           |

## Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database (or Neon account)
- Google Gemini API key

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/intakeai.git
cd intakeai
```

### 2. Set up environment variables

```bash
# Server environment
cp .env.example server/.env
```

Edit `server/.env` with your values:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 3. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Set up the database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Start the development servers

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The app will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Running with Docker

```bash
# Build and start all containers
docker-compose up --build

# Access the app
# Frontend: http://localhost
# Backend: http://localhost:3001
```

## API Endpoints

| Method | Endpoint                            | Description               | Auth |
| ------ | ----------------------------------- | ------------------------- | ---- |
| POST   | `/api/auth/register`                | Register new account      | No   |
| POST   | `/api/auth/login`                   | Login and get tokens      | No   |
| POST   | `/api/auth/refresh`                 | Refresh access token      | No   |
| POST   | `/api/auth/logout`                  | Revoke refresh token      | No   |
| GET    | `/api/patients`                     | List all patients         | Yes  |
| POST   | `/api/patients`                     | Create a patient          | Yes  |
| GET    | `/api/patients/:id`                 | Get patient details       | Yes  |
| POST   | `/api/intake-links`                 | Create intake link        | Yes  |
| GET    | `/api/public/intake/:token`         | Get intake form (patient) | No   |
| POST   | `/api/public/intake/:token`         | Submit intake form        | No   |
| POST   | `/api/intakes/:id/generate-summary` | Generate AI summary       | Yes  |

See [docs/API.md](docs/API.md) for complete API documentation.

## Screenshots

in screenshot folder : C:\intakeAI\screenshots

## Environment Variables

| Variable         | Description                          | Required |
| ---------------- | ------------------------------------ | -------- |
| `DATABASE_URL`   | PostgreSQL connection string         | Yes      |
| `GEMINI_API_KEY` | Google Gemini API key                | Yes      |
| `JWT_SECRET`     | Secret for JWT signing               | Yes      |
| `PORT`           | Server port (default: 3001)          | No       |
| `NODE_ENV`       | Environment (development/production) | No       |
| `FRONTEND_URL`   | Frontend URL for CORS                | No       |

## Documentation

- [API Reference](docs/API.md) - Complete API documentation
- [Architecture](docs/ARCHITECTURE.md) - System design and data flow
- [Deployment](docs/DEPLOYMENT.md) - How to deploy to Render

## Team

- **Suthashan** 100-748-346 - Full Stack Developer
