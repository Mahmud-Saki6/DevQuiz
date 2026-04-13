# DevQuiz — Run Guide

## Prerequisites
- Node.js **18+**
- npm **9+**
- PostgreSQL running locally (or a hosted Postgres URL)

## 1) Install dependencies

```bash
cd "e:\Quiz App"
npm install
```

## 2) Start PostgreSQL (pick one option)

### Option A (recommended): Docker PostgreSQL (copy/paste)

```powershell
docker run --name devquiz-postgres `
  -e POSTGRES_USER=devquiz `
  -e POSTGRES_PASSWORD=devquiz123 `
  -e POSTGRES_DB=devquiz `
  -p 5432:5432 `
  -d postgres:15
```

If you already created it before, start it with:

```powershell
docker start devquiz-postgres
```

### Option B: Local PostgreSQL install

- Ensure Postgres is running and you have a database named `devquiz`.

## 2) Create environment variables

Create a file named **`.env`** in the project root (same folder as `package.json`).

### PowerShell (copy/paste) — creates `.env` with correct Postgres URL

Run this exactly (this is what went wrong in your terminal: you used `file:./dev.db`, but this project is **PostgreSQL**, so it must start with `postgresql://`):

```powershell
cd "e:\Quiz App"

Set-Content -Path .env -Value 'DATABASE_URL="postgresql://devquiz:devquiz123@localhost:5432/devquiz?schema=public"'
Add-Content -Path .env -Value 'NEXTAUTH_SECRET="replace_me_with_a_long_random_string"'
Add-Content -Path .env -Value 'NEXTAUTH_URL="http://localhost:3000"'
Add-Content -Path .env -Value 'GEMINI_API_KEY="replace_me"  # Google AI Studio API key'
Add-Content -Path .env -Value 'GOOGLE_CLIENT_ID=""'
Add-Content -Path .env -Value 'GOOGLE_CLIENT_SECRET=""'
```

Important:
- If your `.env` still contains `postgresql://USER:PASSWORD@...`, Prisma will fail with “credentials for USER are not valid”. Replace it with the `devquiz:devquiz123` URL above (or your real username/password).

### WSL/Ubuntu + Docker (copy/paste) — if you run commands in Ubuntu

If you run `docker` + `prisma` from **Ubuntu/WSL**, use **127.0.0.1** (not `host.docker.internal`).

1) Clean up any old container using the same name:

```bash
docker stop devquiz-postgres 2>/dev/null || true
docker rm devquiz-postgres 2>/dev/null || true
```

2) If port `5432` is already in use, either stop the other Postgres container **or** use a different host port (example: `5433`):

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
```

3) Start Postgres (choose ONE):

- Use host port **5432**:

```bash
docker run --name devquiz-postgres \
  -e POSTGRES_USER=devquiz \
  -e POSTGRES_PASSWORD=devquiz123 \
  -e POSTGRES_DB=devquiz \
  -p 5432:5432 \
  -d postgres:15
```

- Or use host port **5433** (if 5432 is taken):

```bash
docker run --name devquiz-postgres \
  -e POSTGRES_USER=devquiz \
  -e POSTGRES_PASSWORD=devquiz123 \
  -e POSTGRES_DB=devquiz \
  -p 5433:5432 \
  -d postgres:15
```

4) Verify Postgres is ready:

```bash
docker exec -it devquiz-postgres psql -U devquiz -d devquiz -c "SELECT 1"
```

5) Create `.env` (IMPORTANT: use the same host port you started with):

- If you used **5432**:

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://devquiz:devquiz123@127.0.0.1:5432/devquiz?schema=public"
NEXTAUTH_SECRET="my-super-secret-key-12345"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="replace_me"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF
```

- If you used **5433**:

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://devquiz:devquiz123@127.0.0.1:5433/devquiz?schema=public"
NEXTAUTH_SECRET="my-super-secret-key-12345"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="replace_me"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF
```

### What the `.env` must contain (reference)

```env
DATABASE_URL="postgresql://devquiz:devquiz123@localhost:5432/devquiz?schema=public"
NEXTAUTH_SECRET="replace_me_with_a_long_random_string"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="replace_me"
GOOGLE_CLIENT_ID="replace_me"
GOOGLE_CLIENT_SECRET="replace_me"
```

Notes:
- Prisma CLI reads **`.env`** (not `.env.local`) when running migrations/seeding.
- Next.js loads **`.env.local` before `.env`**. Make sure `.env.local` does **not** contain `DATABASE_URL`, or it will override `.env` and break Prisma.

## 3) Setup database (Prisma)

Generate Prisma client, run migrations, then seed Languages/Topics:

```powershell
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## 4) Start the app

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Optional

### Prisma Studio

```bash
npm run prisma:studio
```

### Production build

```bash
npm run build
npm run start
```

