# 🚀 Quran Backend - Complete Setup Guide

## 📋 Step-by-Step Setup Instructions

### Prerequisites
- Node.js v18 or higher
- PostgreSQL v14 or higher
- npm or yarn package manager

---

## ⚡ Quick Setup (5 Minutes)

```bash
# ============================================
# STEP 1: Clone and Install Dependencies
# ============================================
git clone <repository-url>
cd quran-backend
npm install

# ============================================
# STEP 2: Database Setup
# ============================================
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE quran;
\q

# Create .env file with database connection string
echo DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/quran?schema=public" > .env
echo PORT=3077 >> .env

# ============================================
# STEP 3: Generate Prisma Client
# ============================================
# This generates type-safe database client from schema
npx prisma generate

# ============================================
# STEP 4: Run Database Migrations
# ============================================
# This creates all tables, indexes, and constraints
npx prisma migrate deploy

# ============================================
# STEP 5: Seed Database with Quran Data
# ============================================
# Populates surahs, ayahs, translations, tafsirs, and languages
# Requires: quran.json and languages.json in project root
npm run prisma:seed

# ============================================
# STEP 6: Start Development Server
# ============================================
npm run start:dev

# Access the API:
# - REST API: http://localhost:3077
# - GraphQL Playground: http://localhost:3077/graphql
```

---

## 📚 Detailed Instructions

### 1. Clone Repository and Install

```bash
# Clone the repository
git clone <repository-url>
cd quran-backend

# Install all dependencies (NestJS, Prisma, GraphQL, etc.)
npm install
```

### 2. Database Configuration

**Option A: Using psql command line**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE quran;

# Verify database created
\l

# Exit psql
\q
```

**Option B: Using pgAdmin or other GUI tools**
- Open pgAdmin
- Right-click "Databases" → "Create" → "Database"
- Name: `quran`
- Save

**Configure Environment Variables**

Create `.env` file in project root:
```env
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/quran?schema=public"

# Server port (optional, defaults to 3000)
PORT=3077

# Node environment
NODE_ENV=development
```

Replace:
- `username` → your PostgreSQL username (default: `postgres`)
- `password` → your PostgreSQL password
- `localhost` → your database host
- `5432` → your PostgreSQL port (default: 5432)

### 3. Generate Prisma Client

```bash
# Generate type-safe Prisma Client from schema.prisma
npx prisma generate
```

**What this does:**
- Reads `prisma/schema.prisma`
- Generates TypeScript types and client
- Creates `node_modules/@prisma/client`
- Enables type-safe database queries

### 4. Run Database Migrations

```bash
# Apply all pending migrations to create database tables
npx prisma migrate deploy
```

**What this does:**
- Creates all tables defined in schema.prisma
- Sets up relationships (foreign keys)
- Creates indexes for performance
- Applies all migrations from `prisma/migrations/`

**For development (alternative):**
```bash
# Creates migration history and applies changes
npx prisma migrate dev
```

### 5. Seed Database

```bash
# Populate database with Quran data
npm run prisma:seed
```

**Prerequisites:**
- `quran.json` must exist in project root
- `languages.json` must exist in project root

**What this does:**
1. Reads `quran.json` (contains 114 surahs with ayahs, translations, tafsirs)
2. Reads `languages.json` (contains language metadata)
3. For each surah:
   - Creates/updates surah record
   - Creates ayahs (verses) with Arabic text
   - Adds translations to each ayah
   - Adds tafsirs (commentaries) to each ayah
4. For each language:
   - Computes `translations_count`
   - Upserts language record

**Expected output:**
```
Surah 1 exists — updating translations and tafsirs
Updated Surah 1 with translations and tafsirs
...
Seeding finished.
Upserted language en (English) with 2 translations
Upserted language ar (Arabic) with 1 translations
...
```

### 6. Start Server

```bash
# Development mode (with hot-reload)
npm run start:dev
```

**Server runs on:**
- REST API: http://localhost:3077
- GraphQL Playground: http://localhost:3077/graphql

**Try it:**
```bash
# Test REST endpoint
curl http://localhost:3077/surahs

# Or open in browser
open http://localhost:3077/graphql
```

---

## 🔧 Available Commands

### Development

```bash
npm run start              # Start application
npm run start:dev          # Start with hot-reload (recommended)
npm run start:debug        # Start with debugger attached
```

### Production

```bash
npm run build              # Compile TypeScript to JavaScript
npm run start:prod         # Run compiled production build
```

### Database Operations

```bash
# Prisma Client
npx prisma generate              # Generate/regenerate Prisma Client

# Migrations
npx prisma migrate dev           # Create new migration (development)
npx prisma migrate deploy        # Apply migrations (production)
npx prisma migrate reset         # Reset DB and reapply all migrations
npx prisma migrate status        # Check migration status

# Seeding
npm run prisma:seed              # Seed database with Quran data

# Database Tools
npx prisma studio                # Open visual database browser
npx prisma db pull               # Pull schema from existing database
npx prisma db push               # Push schema changes without migration
npx prisma validate              # Validate schema.prisma syntax
npx prisma format                # Format schema.prisma file
```

### Code Quality

```bash
npm run lint                     # Run ESLint and auto-fix issues
npm run format                   # Format code with Prettier
npm run test                     # Run unit tests
npm run test:watch               # Run tests in watch mode
npm run test:e2e                 # Run end-to-end tests
npm run test:cov                 # Run tests with coverage report
```

---

## 🔄 Development Workflow

### Making Database Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# Example: Add a new field to Surah model

# 2. Create migration
npx prisma migrate dev --name add_surah_description

# 3. Prisma Client auto-regenerates
# (If not, run: npx prisma generate)

# 4. Update your TypeScript code to use new field

# 5. Test changes
npm run start:dev
```

### Adding New Data

```bash
# 1. Update quran.json or languages.json

# 2. Re-run seed
npm run prisma:seed

# 3. Verify in Prisma Studio
npx prisma studio
```

### Resetting Database (Fresh Start)

```bash
# WARNING: This deletes ALL data!

# Reset and reapply all migrations
npx prisma migrate reset

# Re-seed database
npm run prisma:seed

# Start server
npm run start:dev
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npx prisma generate
```

**Cause:** Prisma Client not generated or out of sync with schema.

---

### Issue: "Error: P1001: Can't reach database server"

**Solutions:**

1. **Check PostgreSQL is running:**
```bash
# Windows
services.msc  # Look for PostgreSQL service

# Mac/Linux
pg_isready
```

2. **Verify DATABASE_URL in .env:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/quran"
```

3. **Test connection:**
```bash
psql -U postgres -d quran -c "SELECT 1"
```

---

### Issue: "Migration failed" or "Schema is out of sync"

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# If needed, reset and reapply
npx prisma migrate reset
npx prisma migrate deploy
```

---

### Issue: Seeding fails with "Table does not exist"

**Cause:** Migrations not applied

**Solution:**
```bash
# Apply migrations first
npx prisma migrate deploy

# Then seed
npm run prisma:seed
```

---

### Issue: "quran.json not found" during seeding

**Solution:**
```bash
# Verify files exist in project root
ls quran.json languages.json

# If missing, ensure they're in the correct location:
# quran-backend/quran.json
# quran-backend/languages.json
```

---

### Issue: Port 3077 already in use

**Solution:**

1. **Change port in .env:**
```env
PORT=3078
```

2. **Or kill process using port:**
```bash
# Windows
netstat -ano | findstr :3077
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3077 | xargs kill -9
```

---

### Issue: TypeScript compilation errors after schema changes

**Solution:**
```bash
# 1. Regenerate Prisma Client
npx prisma generate

# 2. Restart development server
npm run start:dev
```

---

## 📊 Verifying Installation

### Check Database Tables

```bash
# Open Prisma Studio
npx prisma studio

# Or use psql
psql -U postgres -d quran
\dt  # List all tables
SELECT COUNT(*) FROM "Surah";  # Should show 114
SELECT COUNT(*) FROM "Ayah";   # Should show 6000+
\q
```

### Test API Endpoints

```bash
# REST API - Get all surahs
curl http://localhost:3077/surahs

# REST API - Get specific surah
curl http://localhost:3077/surah/1?includeAyahs=true

# REST API - Get verse by key
curl http://localhost:3077/verses/by_key/2:255

# REST API - Get languages
curl http://localhost:3077/resources/languages
```

### Test GraphQL

Open http://localhost:3077/graphql and run:

```graphql
query {
  surahs(language: "en") {
    id
    number
    name_ar
    name_en
    total_ayahs
  }
}
```

---

## 📖 Next Steps

1. **Explore API Documentation**
   - Check available endpoints in controller files
   - Try different query parameters
   - Explore GraphQL schema

2. **Customize Configuration**
   - Modify `prisma/schema.prisma` for your needs
   - Adjust ESLint/Prettier rules
   - Configure CORS settings in `main.ts`

3. **Add Features**
   - Implement authentication
   - Add caching layer
   - Create custom endpoints
   - Build frontend integration

4. **Deploy to Production**
   - Build: `npm run build`
   - Set production DATABASE_URL
   - Run migrations: `npx prisma migrate deploy`
   - Start: `npm run start:prod`

---

## 🆘 Getting Help

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **GraphQL Docs**: https://graphql.org/learn
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**Happy Coding! 🎉**
