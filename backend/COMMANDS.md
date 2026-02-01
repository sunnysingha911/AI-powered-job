# 📋 WINDOWS COMMAND REFERENCE

All commands for running the AI-Powered Job Tracker backend on Windows.

---

## 🚀 INITIAL SETUP

### 1. Install Dependencies

```cmd
npm install
```

### 2. Setup Environment

```cmd
copy .env.example .env
```

### 3. Start PostgreSQL (Docker)

```cmd
npm run docker:dev
```

Or manually:

```cmd
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Initialize Database

```cmd
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start Development Server

```cmd
npm run dev
```

---

## 💻 DEVELOPMENT COMMANDS

### Server

```cmd
# Start development server (hot-reload)
npm run dev

# Build TypeScript
npm run build

# Start production build
npm start
```

### Database

```cmd
# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Apply migrations (production)
npm run prisma:deploy
```

---

## 🐳 DOCKER COMMANDS

### Development (PostgreSQL Only)

```cmd
# Start PostgreSQL
npm run docker:dev
# OR
docker-compose -f docker-compose.dev.yml up -d

# Stop PostgreSQL
npm run docker:dev:down
# OR
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View logs for specific container
docker-compose -f docker-compose.dev.yml logs -f postgres

# Restart PostgreSQL
docker-compose -f docker-compose.dev.yml restart

# Remove PostgreSQL and data (WARNING: Deletes all data)
docker-compose -f docker-compose.dev.yml down -v
```

### Production (Full Stack)

```cmd
# Build and start all services
npm run docker:prod
# OR
docker-compose up --build -d

# Stop all services
npm run docker:prod:down
# OR
docker-compose down

# View logs
docker-compose logs -f

# View API logs only
docker-compose logs -f api

# View PostgreSQL logs only
docker-compose logs -f postgres

# Restart API only
docker-compose restart api

# Rebuild and restart API
docker-compose up --build -d api

# Remove all containers and data (WARNING: Deletes all data)
docker-compose down -v
```

### Docker Utility Commands

```cmd
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs job-tracker-api
docker logs job-tracker-db

# Execute command in container
docker exec -it job-tracker-api sh
docker exec -it job-tracker-db psql -U postgres -d job_tracker_db

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a

# Remove all unused volumes (WARNING: Deletes data)
docker volume prune
```

---

## 🗄️ DATABASE COMMANDS

### PostgreSQL (via Docker)

```cmd
# Connect to PostgreSQL
docker exec -it job-tracker-db-dev psql -U postgres -d job_tracker_db

# Backup database
docker exec job-tracker-db-dev pg_dump -U postgres job_tracker_db > backup.sql

# Restore database
docker exec -i job-tracker-db-dev psql -U postgres -d job_tracker_db < backup.sql

# Drop and recreate database
docker exec -it job-tracker-db-dev psql -U postgres -c "DROP DATABASE job_tracker_db;"
docker exec -it job-tracker-db-dev psql -U postgres -c "CREATE DATABASE job_tracker_db;"
```

### Prisma Commands

```cmd
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# View database in browser
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull database schema (from existing DB)
npx prisma db pull

# Push schema to database (without migrations)
npx prisma db push
```

---

## 🔍 DEBUGGING COMMANDS

### Check Ports

```cmd
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Check if port 5432 is in use
netstat -ano | findstr :5432

# Kill process by PID
taskkill /PID <PID> /F
```

### View Logs

```cmd
# View server logs (in console where npm run dev is running)
# OR check logs/ directory in production

# View Docker logs
docker-compose logs -f

# View specific container logs
docker logs job-tracker-api
docker logs job-tracker-db-dev
```

### Health Checks

```cmd
# Check server health
curl http://localhost:4000/health

# OR open in browser
start http://localhost:4000/health

# Check PostgreSQL connection
docker exec job-tracker-db-dev pg_isready -U postgres
```

---

## 🧪 TESTING API ENDPOINTS

### Using curl (Windows)

```cmd
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test1234\",\"firstName\":\"John\"}"

# Login
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Test1234\"}"

# Get profile (replace TOKEN with actual JWT)
curl http://localhost:4000/api/auth/me ^
  -H "Authorization: Bearer TOKEN"
```

### Using PowerShell

```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:4000/health

# Register user
$body = @{
    email = "test@example.com"
    password = "Test1234"
    firstName = "John"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:4000/api/auth/register `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Login
$body = @{
    email = "test@example.com"
    password = "Test1234"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:4000/api/auth/login `
  -Method Post `
  -ContentType "application/json" `
  -Body $body

# Get profile
$token = $response.data.token
Invoke-RestMethod -Uri http://localhost:4000/api/auth/me `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 🧹 CLEANUP COMMANDS

### Remove Dependencies

```cmd
# Remove node_modules
rmdir /s /q node_modules

# Remove package-lock.json
del package-lock.json

# Reinstall
npm install
```

### Clean Build

```cmd
# Remove dist folder
rmdir /s /q dist

# Rebuild
npm run build
```

### Reset Everything (Nuclear Option)

```cmd
# Stop all Docker containers
docker-compose down -v
docker-compose -f docker-compose.dev.yml down -v

# Remove node_modules
rmdir /s /q node_modules

# Remove dist
rmdir /s /q dist

# Remove logs
rmdir /s /q logs

# Reinstall
npm install

# Regenerate Prisma
npx prisma generate

# Start fresh
npm run docker:dev
npx prisma migrate dev --name init
npm run dev
```

---

## 📦 DEPLOYMENT COMMANDS

### Build for Production

```cmd
# Install production dependencies only
npm ci --only=production

# Build TypeScript
npm run build

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start server
npm start
```

### Docker Production Build

```cmd
# Build Docker image
docker build -t job-tracker-api .

# Run container
docker run -p 4000:4000 --env-file .env job-tracker-api

# Or use docker-compose
docker-compose up --build -d
```

---

## 🔧 TROUBLESHOOTING COMMANDS

### Fix Common Issues

```cmd
# Prisma Client not found
npx prisma generate

# Database connection failed
docker ps
docker-compose -f docker-compose.dev.yml up -d

# Port already in use
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# TypeScript errors
npm run build

# Module not found
npm install

# Docker issues
docker-compose down
docker-compose up -d

# Reset Prisma
npx prisma migrate reset
npx prisma generate
```

---

## 📚 USEFUL SHORTCUTS

### Create npm scripts in package.json

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "docker:dev": "docker-compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker-compose -f docker-compose.dev.yml down",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

Then use:

```cmd
npm run dev
npm run docker:dev
npm run prisma:studio
```

---

**💡 TIP:** Save this file for quick reference during development!
