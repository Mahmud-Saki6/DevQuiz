# DevQuiz — Run Guide

## Prerequisites
- Node.js **18+**
- npm **9+**
- PostgreSQL running locally (or a hosted Postgres URL)
DevQuiz — Simple Run Guide
📋 What You Need
Windows PC with Docker Desktop installed

Internet connection

🚀 Just Copy & Paste These Commands
Step 1: Open PowerShell as Administrator
Press Windows + X → Select "Windows Terminal (Admin)" or "PowerShell (Admin)"

Step 2: Copy and paste this ENTIRE block:
powershell
# Go to project folder
cd "E:\Quiz App"

# Install dependencies
npm install

# Start database (Docker)
docker run --name devquiz-postgres -e POSTGRES_USER=devquiz -e POSTGRES_PASSWORD=devquiz123 -e POSTGRES_DB=devquiz -p 5432:5432 -d postgres:15

# Create environment file
@"
DATABASE_URL="postgresql://devquiz:devquiz123@localhost:5432/devquiz?schema=public"
NEXTAUTH_SECRET="my-super-secret-key-12345"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="YOUR_API_KEY_HERE"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
"@ | Out-File -FilePath .env -Encoding utf8

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start the app
npm run dev
Step 3: Get a Free Gemini API Key
Open browser → Go to: https://aistudio.google.com/

Sign in with Google

Click "Get API Key" → Create API key

Copy the key

Open E:\Quiz App\.env file

Replace YOUR_API_KEY_HERE with your real key

Save the file

Step 4: Restart the app
Press Ctrl + C to stop

Run: npm run dev

Step 5: Open your browser
Go to: http://localhost:3000

Step 6: Create an account
Click "Register"

Enter name, email, password

Start taking quizzes!

🔧 If Something Goes Wrong
Problem	Fix
port is already allocated	Run: docker start devquiz-postgres
Can't reach database	Run: docker start devquiz-postgres
GEMINI_API_KEY invalid	Get a real key from AI Studio
Registration failed	Run: npx prisma migrate dev --name init
✅ Done!
The app is running at http://localhost:3000