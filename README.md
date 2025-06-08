# 🗂️ Task Manager App

A full-stack task management application built with **Next.js**, **tRPC**, **Prisma**, **PostgreSQL**, **NextAuth**, and **MUI (Material UI)**. It supports task tracking, project and team management, and role-based authentication.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, MUI
- **Backend**: tRPC, Next.js API routes
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **State Management**: React Query (via tRPC)
- **Styling**: MUI Components + CSS
- **Deployment**: Vercel / Docker-ready

---

## ⚙️ Setup Instructions

### 1. Clone the repository

###Create a .env file in the root of your project and add the following variables:
# Database connection URLs for Prisma
DATABASE_URL="postgresql://postgres.irykywahtotjykpsapca:Google%401710@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.irykywahtotjykpsapca:Google%401710@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"

# Generate a strong secret for NextAuth and put it here
NEXTAUTH_SECRET=your_long_secret

# Discord OAuth provider credentials (replace with your own)
DISCORD_CLIENT_ID="dummy"
DISCORD_CLIENT_SECRET="dummy"

# JWT secret key for token signing
JWT_SECRET=your_super_secret_key

```bash
git clone https://github.com/sumitabh1710/easy-slr.git
cd easy-slr/apps/web
npm install
npx prisma generate --schema=prisma/schema.prisma
npm run dev

