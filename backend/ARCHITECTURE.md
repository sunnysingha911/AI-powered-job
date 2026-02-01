# 🏗️ ARCHITECTURE & DESIGN DECISIONS

## Overview

This document explains the architectural decisions made for the AI-Powered Job Tracker backend. Perfect for interviews and code reviews.

---

## 🎯 Architecture Pattern: Modular Monolith

### Why Not Microservices?

**Decision:** Modular Monolith with Clean Architecture principles

**Reasoning:**

1. **Simpler Deployment** - Single application, easier to deploy and monitor
2. **Lower Latency** - No network overhead between services
3. **Easier Development** - No need for service discovery, API gateways
4. **Cost-Effective** - Runs on free-tier platforms (Railway, Render)
5. **Can Split Later** - Modules are independent, can extract to microservices if needed

**Trade-offs:**

- ❌ Harder to scale individual components
- ✅ But: Most job trackers don't need microservice-level scale
- ✅ Vertical scaling is sufficient for this use case

---

## 🗄️ Database: PostgreSQL + Prisma

### Why PostgreSQL?

**Decision:** PostgreSQL as the primary database

**Reasoning:**

1. **JSONB Support** - Perfect for storing AI-generated data (flexible schema)
2. **ACID Compliance** - Ensures data integrity for job applications
3. **Rich Querying** - Complex queries for job matching
4. **Free Tier Available** - Supabase, Neon, Railway all offer free PostgreSQL
5. **Production-Ready** - Battle-tested, reliable

**Why Not MongoDB?**

- No need for horizontal scaling
- Relational data (users → resumes → applications)
- JSONB gives us flexibility where needed
- Better for complex queries and joins

### Why Prisma ORM?

**Decision:** Prisma as the database ORM

**Reasoning:**

1. **Type Safety** - Auto-generated TypeScript types from schema
2. **Developer Experience** - Excellent autocomplete, error messages
3. **Migration System** - Built-in, version-controlled migrations
4. **Prisma Studio** - Free database GUI
5. **Performance** - Optimized queries, connection pooling

**Example:**

```typescript
// Type-safe database access
const user = await prisma.user.findUnique({
  where: { email: "test@example.com" },
  include: { resumes: true } // TypeScript knows this structure
});
```

---

## 🏛️ Clean Architecture Layers

### Layer Separation

```
Controller → Service → Repository (Prisma)
```

**Controller Layer:**

- Handles HTTP requests/responses
- Validates input (Zod schemas)
- Delegates to service layer
- Thin layer, no business logic

**Service Layer:**

- Contains business logic
- Orchestrates data access
- Handles transactions
- Returns domain objects

**Repository Layer:**

- Prisma client (implicit)
- Data access only
- No business logic

**Benefits:**

1. **Testable** - Can mock each layer
2. **Maintainable** - Clear separation of concerns
3. **Flexible** - Easy to swap implementations
4. **Interview-Ready** - Shows architectural knowledge

---

## 🔐 Authentication Strategy

### JWT-Based Authentication

**Decision:** Stateless JWT authentication

**Reasoning:**

1. **Stateless** - No session storage needed
2. **Scalable** - No shared session store
3. **Mobile-Friendly** - Easy to use in mobile apps
4. **Standard** - Industry standard approach

**Implementation:**

```typescript
// Login flow
1. User sends email + password
2. Server verifies credentials (bcrypt)
3. Server generates JWT token
4. Client stores token
5. Client sends token in Authorization header
6. Server verifies token on each request
```

**Security Measures:**

- ✅ Bcrypt with 12 rounds for password hashing
- ✅ JWT secret from environment variables
- ✅ Token expiration (7 days default)
- ✅ User verification on each request

**Why Not Sessions?**

- Requires session store (Redis)
- Harder to scale horizontally
- More complex deployment

---

## 📊 Data Modeling: JSONB for AI Data

### Why JSONB Fields?

**Decision:** Use JSONB for AI-generated content

**Example Schema:**

```prisma
model Resume {
  id            String   @id @default(uuid())
  fileName      String
  fileUrl       String

  // JSONB fields for flexible AI data
  parsedContent Json?    // Raw parsed resume
  skills        Json?    // Extracted skills array
  analysis      Json?    // AI analysis results

  atsScore      Int?     // Structured data
}
```

**Reasoning:**

1. **Flexible Schema** - AI output varies, hard to predict structure
2. **Fast Iteration** - No migrations for AI format changes
3. **PostgreSQL Indexing** - Can index JSONB fields if needed
4. **Type Safety** - Zod validates JSON structure at runtime

**Example Data:**

```json
{
  "parsedContent": {
    "name": "John Doe",
    "email": "john@example.com",
    "experience": [...]
  },
  "skills": ["JavaScript", "TypeScript", "React"],
  "analysis": {
    "atsScore": 85,
    "strengths": ["Strong technical skills"],
    "improvements": ["Add more metrics"]
  }
}
```

**Why Not Separate Tables?**

- Too many tables for varying AI output
- Harder to query and maintain
- JSONB gives us best of both worlds

---

## 🛡️ Error Handling Strategy

### Centralized Error Handler

**Decision:** Single error handler middleware

**Implementation:**

```typescript
// Custom error classes
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Centralized handler
app.use(errorHandler); // Catches all errors
```

**Benefits:**

1. **Consistent Responses** - All errors formatted the same
2. **Proper Logging** - All errors logged automatically
3. **Type-Safe** - TypeScript knows error structure
4. **Client-Friendly** - Clean error messages

**Error Types Handled:**

- ✅ AppError (custom errors)
- ✅ Prisma errors (database)
- ✅ Zod errors (validation)
- ✅ JWT errors (authentication)
- ✅ Unknown errors (500)

---

## 🔍 Input Validation: Zod

### Why Zod?

**Decision:** Zod for runtime validation

**Reasoning:**

1. **Type Safety** - Infers TypeScript types
2. **Runtime Validation** - Validates at runtime
3. **Great Errors** - Clear validation messages
4. **Composable** - Easy to reuse schemas

**Example:**

```typescript
const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/),
  }),
});

// Middleware validates automatically
router.post("/register", validate(RegisterSchema), controller.register);
```

**Why Not Manual Validation?**

- Error-prone
- No type inference
- Harder to maintain

---

## 📝 Logging: Winston

### Why Winston?

**Decision:** Winston for application logging

**Reasoning:**

1. **Flexible** - Multiple transports (console, file)
2. **Production-Ready** - Log rotation, levels
3. **Structured Logging** - JSON format
4. **Integration** - Works with Morgan for HTTP logs

**Configuration:**

```typescript
// Development: Colorized console logs
// Production: JSON logs to files with rotation
```

---

## 🐳 Containerization: Docker

### Multi-Stage Dockerfile

**Decision:** Multi-stage build for optimization

**Benefits:**

1. **Smaller Image** - Production image ~150MB
2. **Faster Builds** - Cached layers
3. **Security** - No dev dependencies in production
4. **Prisma Support** - Generates client in build stage

**Stages:**

```dockerfile
Stage 1 (builder): Build TypeScript + Generate Prisma
Stage 2 (production): Copy dist + Install prod deps only
```

### Docker Compose

**Two Configurations:**

1. **dev** - PostgreSQL only (local development)
2. **prod** - Full stack (PostgreSQL + API)

**Why Separate?**

- Development: Hot-reload with ts-node-dev
- Production: Optimized Node.js runtime

---

## 🚀 Deployment Strategy

### Free-Tier Friendly

**Database Options:**

1. **Supabase** - Free PostgreSQL + Auth + Storage
2. **Neon** - Serverless PostgreSQL
3. **Railway** - Free tier with PostgreSQL

**Application Hosting:**

1. **Railway** - Docker support, free tier
2. **Render** - Free tier, auto-deploy
3. **Fly.io** - Free tier, global deployment

**Why These Platforms?**

- ✅ Free tier available
- ✅ Easy deployment
- ✅ PostgreSQL support
- ✅ Environment variables
- ✅ Auto-scaling

---

## 🔄 Graceful Shutdown

### Why It Matters

**Decision:** Implement graceful shutdown

**Implementation:**

```typescript
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown() {
  1. Stop accepting new requests
  2. Finish ongoing requests
  3. Close database connections
  4. Exit process
}
```

**Benefits:**

- ✅ No data loss
- ✅ No corrupted database state
- ✅ Clean Docker restarts
- ✅ Production-ready

---

## 📈 Scalability Considerations

### Current Architecture

**Vertical Scaling:**

- Increase server resources (CPU, RAM)
- Sufficient for most use cases

**Horizontal Scaling (Future):**

- Load balancer + Multiple instances
- Shared PostgreSQL database
- Stateless JWT (no session store needed)

**Database Scaling:**

- Connection pooling (Prisma)
- Read replicas (if needed)
- Caching layer (Redis, future)

---

## 🎓 Interview Talking Points

### Key Highlights

1. **Clean Architecture** - Separation of concerns, testable
2. **Type Safety** - TypeScript + Prisma + Zod
3. **Error Handling** - Centralized, consistent
4. **Security** - Bcrypt, JWT, Helmet, CORS
5. **Production-Ready** - Logging, graceful shutdown, Docker
6. **Scalable** - Stateless, can scale horizontally
7. **Cost-Effective** - Free-tier friendly

### Common Questions

**Q: Why not microservices?**
A: Modular monolith is simpler, cheaper, and sufficient for this scale. Can split later if needed.

**Q: Why PostgreSQL over MongoDB?**
A: Relational data model, JSONB for flexibility, better for complex queries, ACID compliance.

**Q: How do you handle AI data variability?**
A: JSONB fields for flexible schema, Zod for runtime validation.

**Q: How do you ensure type safety?**
A: TypeScript + Prisma (compile-time) + Zod (runtime).

**Q: How would you scale this?**
A: Horizontal scaling with load balancer, read replicas, caching layer (Redis).

---

**This architecture balances simplicity, maintainability, and production-readiness while remaining cost-effective and interview-ready.**
