# DevQuiz — AI‑Powered Programming Quiz Platform

DevQuiz is a full‑stack web application for practicing programming concepts with **AI‑generated multiple‑choice quizzes**. Users choose a language + topic, complete a quiz session, and then review results with analytics and mistake breakdowns.

## Key Features
- **Auth**: Email/password (Credentials) + Google OAuth (NextAuth)
- **AI question generation**: Dynamic MCQs generated on demand (Gemini API)
- **Quiz sessions**: Answers saved to database with score + metadata
- **Results analytics**:
  - Score summary (correct/missed)
  - Topic accuracy chart (Recharts)
  - Weak topic detection + quick practice links
  - Mistake review (wrong answer vs correct answer + explanation)
- **Streaks**: Completing at least one quiz per day increments streak
- **Modern UI**: Material UI theme with light/dark color schemes
- **Type safety + validation**: TypeScript + Zod validation on API routes

## Tech Stack
### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Material UI (MUI)** (+ Emotion)
- **Redux Toolkit** + **redux‑persist**
- **Recharts** (analytics charts)

### Backend
- **Next.js Route Handlers** (`src/app/api/**`)
- **NextAuth.js** (Credentials + Google provider)
- **Prisma** ORM
- **PostgreSQL**

### AI Provider
- **Google Gemini API** via `@google/generative-ai`

## Project Structure (high level)
```
src/
  app/
    (auth)/                  # login/register pages
    (dashboard)/             # protected app pages
    api/                     # route handlers (auth, quiz, topics, etc.)
  components/                # UI components (home, quiz, results, layout)
  lib/                       # db, auth, AI prompt/schema utilities
  store/                     # Redux store + slices
  types/                     # shared TS types
prisma/
  schema.prisma              # DB models (includes NextAuth models)
  seed.ts                    # seeds Languages + Topics
RUN.md                       # exact copy/paste run commands
```

## Environment Variables
DevQuiz expects environment variables in **`.env`** (project root).

Required:
- **`DATABASE_URL`**: Postgres connection string
- **`NEXTAUTH_SECRET`**: long random string
- **`NEXTAUTH_URL`**: typically `http://localhost:3000`
- **`GEMINI_API_KEY`**: Gemini API key from Google AI Studio

Optional (Google OAuth):
- **`GOOGLE_CLIENT_ID`**
- **`GOOGLE_CLIENT_SECRET`**

Important:
- Next.js loads **`.env.local` before `.env`**. Do **not** put `DATABASE_URL` in `.env.local` or it may override `.env`.

## Setup & Run
Use the step‑by‑step guide in `RUN.md` (includes Windows PowerShell and WSL/Ubuntu + Docker instructions).

Quick summary:
1. `npm install`
2. Start PostgreSQL (Docker or local)
3. Create `.env`
4. `npx prisma migrate dev --name init`
5. `npx prisma db seed`
6. `npm run dev`

## Scripts
- **`npm run dev`**: start dev server
- **`npm run build`**: production build
- **`npm run start`**: run production server
- **`npm run lint`**: lint
- **`npm run prisma:migrate`**: run migrations
- **`npm run prisma:seed`**: seed languages/topics
- **`npm run prisma:studio`**: open Prisma Studio

## Notes
- AI generation is network‑dependent. If Gemini returns **503 high demand**, DevQuiz automatically retries with fallback model IDs.
- Quiz option order is **shuffled server‑side** and `correctIndex` is re‑mapped so the correct answer is not always A.

