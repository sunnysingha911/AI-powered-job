# AI-Powered Job Tracker + Resume Analyzer - Backend

Production-ready backend built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Prisma**.

## 🏗️ Architecture

**Modular Monolith** following **Clean Architecture** principles:

- **Controller** → Handles HTTP requests/responses
- **Service** → Business logic
- **Repository** → Data access (Prisma)

## 📁 Project Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server startup & graceful shutdown
├── config/                   # Configuration files
│   ├── env.ts               # Environment variables (Zod validated)
│   ├── db.ts                # Prisma client & connection
│   └── logger.ts            # Winston logger
├── modules/                  # Feature modules
│   ├── auth/                # Authentication
│   ├── users/               # User management
│   ├── resumes/             # Resume upload & parsing
│   ├── jobs/                # Job tracking
│   ├── applications/        # Application tracking
│   ├── analysis/            # AI analysis
│   └── notifications/       # Email notifications
├── shared/                   # Shared utilities
│   ├── middlewares/         # Express middlewares
│   ├── errors/              # Custom error classes
│   ├── utils/               # Helper functions
│   └── constants/           # Constants
├── infra/                    # Infrastructure services
│   ├── ai/                  # AI service integrations
│   ├── email/               # Email service
│   └── storage/             # File storage
└── prisma/
    └── schema.prisma        # Database schema
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Docker Desktop** (for Windows)
- **PostgreSQL** (via Docker or cloud provider)

### Installation (Windows)

1. **Clone and navigate to backend:**

   ```cmd
   cd d:\Learning\projects\ai-powered-job-search\backend
   ```

2. **Install dependencies:**

   ```cmd
   npm install
   ```

3. **Set up environment variables:**

   ```cmd
   copy .env.example .env
   ```

   Then edit `.env` with your configuration.

4. **Start PostgreSQL (Docker):**

   ```cmd
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. **Initialize Prisma:**

   ```cmd
   npx prisma generate
   npx prisma migrate dev --name init
   ```

6. **Start development server:**
   ```cmd
   npm run dev
   ```

Server will run at `http://localhost:4000`

## 🐳 Docker Commands (Windows)

### Development (PostgreSQL only)

```cmd
# Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# Stop PostgreSQL
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Reset database (WARNING: Deletes all data)
docker-compose -f docker-compose.dev.yml down -v
```

### Production (Full Stack)

```cmd
# Build and start all services
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api

# Restart API only
docker-compose restart api

# Reset everything (WARNING: Deletes all data)
docker-compose down -v
```

## 📊 Database Management

### Prisma Commands

```cmd
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

### Database Schema

The schema includes:

- **Users** - User accounts with authentication
- **Resumes** - Resume uploads with AI-parsed content (JSONB)
- **Jobs** - Job postings being tracked
- **Applications** - Job applications with status tracking
- **Interviews** - Interview scheduling and notes

## 🔑 Environment Variables

Required variables (see `.env.example`):

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/job_tracker_db
JWT_SECRET=your-secret-key-min-32-chars
```

Optional (for AI features):

```env
OPENAI_API_KEY=sk-...
EMAIL_SERVICE_API_KEY=...
```

## 🛠️ Development Scripts

```cmd
# Development with hot-reload
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run tests (when implemented)
npm test
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check

- `GET /health` - Server and database health status

## 🏛️ Architectural Decisions

### Why Modular Monolith?

- **Simpler deployment** than microservices
- **Easier to maintain** for small teams
- **Can split later** if needed
- **Better performance** (no network overhead)

### Why Prisma?

- **Type-safe** database access
- **Auto-generated** TypeScript types
- **Migration system** built-in
- **Works great** with PostgreSQL JSONB

### Why JSONB for AI Data?

- **Flexible schema** for AI-generated content
- **Fast queries** with PostgreSQL indexes
- **No need for separate** document database
- **Keeps everything** in one database

### Error Handling Strategy

- **Custom error classes** with HTTP status codes
- **Centralized error handler** middleware
- **Automatic Prisma error** translation
- **Zod validation errors** properly formatted

### Why Clean Architecture?

- **Testable** - Business logic isolated
- **Maintainable** - Clear separation of concerns
- **Scalable** - Easy to add new features
- **Interview-ready** - Shows architectural knowledge

## 🔒 Security Best Practices

- ✅ **Helmet** - Security headers
- ✅ **CORS** - Configured origins
- ✅ **Bcrypt** - Password hashing (12 rounds)
- ✅ **JWT** - Stateless authentication
- ✅ **Zod** - Input validation
- ✅ **Rate limiting** - Prevent abuse (TODO)
- ✅ **SQL injection** - Prevented by Prisma

## 🚢 Deployment

### Free-Tier Options

1. **Supabase** (Database):
   - Free PostgreSQL database
   - Update `DATABASE_URL` in `.env`

2. **Neon** (Database):
   - Serverless PostgreSQL
   - Update `DATABASE_URL` in `.env`

3. **Railway** (Full Stack):
   - Deploy entire Docker Compose
   - Free tier available

### Deployment Steps

1. **Set environment variables** on your platform
2. **Push code** to Git repository
3. **Connect** repository to deployment platform
4. **Run migrations**: `npx prisma migrate deploy`
5. **Start server**: `npm start`

## 📝 Next Steps

1. Implement remaining modules:
   - [ ] Resumes (upload, parse, analyze)
   - [ ] Jobs (CRUD, search)
   - [ ] Applications (tracking, status updates)
   - [ ] Analysis (AI-powered matching)
   - [ ] Notifications (email alerts)

2. Add AI integration:
   - [ ] OpenAI for resume parsing
   - [ ] Job-resume matching algorithm
   - [ ] ATS score calculation

3. Implement file storage:
   - [ ] AWS S3 or Cloudinary
   - [ ] Resume PDF storage

4. Add testing:
   - [ ] Unit tests (Jest)
   - [ ] Integration tests
   - [ ] E2E tests

## 🤝 Contributing

This is a learning project. Feel free to:

- Add new features
- Improve error handling
- Add tests
- Optimize performance

## 📄 License

MIT
