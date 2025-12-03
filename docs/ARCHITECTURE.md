# How IntakeAI Works

## Tech used

- React for the frontend
- Express for the backend
- PostgreSQL for database
- Gemini AI for summaries

## Main folders

- `client/` - the react app
- `server/` - the api

## Basic flow

1. Doctor logs in
2. Doctor adds patient and gets a link
3. Patient fills out form using that link
4. Doctor generates AI summary
5. AI finds red flags and summarizes everything

## Database

We have tables for users, patients, intakes, summaries, and intake links.

## Auth

JWT tokens - you get an access token when you login and send it with requests.
