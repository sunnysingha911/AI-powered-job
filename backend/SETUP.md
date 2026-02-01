# 🚀 QUICK START GUIDE (Windows)

This guide will help you set up and run the AI-Powered Job Tracker backend on Windows.

## ✅ Prerequisites Checklist

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed (optional)

## 📦 Step 1: Install Dependencies

Open PowerShell or CMD in the backend directory and run:

```cmd
npm install
```

This will install all required packages:

- Express.js (web framework)
- TypeScript (type safety)
- Prisma (database ORM)
- Winston (logging)
- Bcrypt (password hashing)
- JWT (authentication)
- Zod (validation)
- And more...

## 🔧 Step 2: Environment Setup

1. Copy the example environment file:

   ```cmd
   copy .env.example .env
   ```

2. Open `.env` in your text editor and update if needed:
   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/job_tracker_db?schema=public
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   ```

## 🐳 Step 3: Start PostgreSQL Database

Using Docker Compose (recommended):

```cmd
npm run docker:dev
```

Or manually:

```cmd
docker-compose -f docker-compose.dev.yml up -d
```

**Verify it's running:**

```cmd
docker ps
```

You should see `job-tracker-db-dev` container running.

## 🗄️ Step 4: Initialize Database

Generate Prisma Client:

```cmd
npm run prisma:generate
```

Run database migrations:

```cmd
npm run prisma:migrate
```

When prompted for a migration name, enter: `init`

## 🎯 Step 5: Start Development Server

```cmd
npm run dev
```

You should see:

```
🚀 Server running on port 4000
📝 Environment: development
🔗 Health check: http://localhost:4000/health
✅ Database connected successfully
```

## ✨ Step 6: Test the API

Open your browser or use curl/Postman:

**Health Check:**

```
GET http://localhost:4000/health
```

**Register a User:**

```
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**

```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test1234"
}
```

## 🛠️ Common Commands

### Development

```cmd
# Start dev server with hot-reload
npm run dev

# View database in GUI
npm run prisma:studio

# Stop PostgreSQL
npm run docker:dev:down
```

### Database

```cmd
# Create new migration
npm run prisma:migrate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database
npm run prisma:studio
```

### Docker

```cmd
# Start PostgreSQL only (development)
npm run docker:dev

# Stop PostgreSQL
npm run docker:dev:down

# Start full stack (production mode)
npm run docker:prod

# Stop full stack
npm run docker:prod:down

# View logs
docker-compose logs -f
```

## 🐛 Troubleshooting

### Port 4000 already in use

```cmd
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Port 5432 already in use (PostgreSQL)

```cmd
# Stop existing PostgreSQL service
net stop postgresql-x64-14

# Or use a different port in docker-compose.dev.yml
ports:
  - '5433:5432'  # Change 5432 to 5433
```

### Database connection failed

1. Ensure Docker Desktop is running
2. Check if PostgreSQL container is running: `docker ps`
3. Verify DATABASE_URL in `.env` matches docker-compose settings

### Prisma Client not found

```cmd
npm run prisma:generate
```

### TypeScript errors

```cmd
# Rebuild
npm run build
```

## 📚 Next Steps

1. **Explore the API:**
   - Try all auth endpoints
   - Check the health endpoint

2. **View the Database:**

   ```cmd
   npm run prisma:studio
   ```

   Opens at `http://localhost:5555`

3. **Read the Documentation:**
   - See `README.md` for full documentation
   - Check `prisma/schema.prisma` for database schema

4. **Implement More Features:**
   - Resume upload module
   - Job tracking module
   - AI analysis integration

## 🎓 Learning Resources

- **Express.js:** https://expressjs.com/
- **Prisma:** https://www.prisma.io/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Docker:** https://docs.docker.com/desktop/windows/

## 🆘 Need Help?

- Check the logs: Server logs are in console, Docker logs: `docker-compose logs -f`
- Prisma errors: Usually related to schema or migrations
- TypeScript errors: Check `tsconfig.json` and installed types

---

**Happy Coding! 🚀**
