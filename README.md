<div align="center">

# 🧭 WanderMind

### *AI-Powered Travel Planning, Beautifully Crafted*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5/6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis)](https://upstash.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)

> **WanderMind** is a full-stack, AI-driven travel platform that helps travelers plan smarter trips. From AI-generated itineraries and smart packing lists to budget breakdowns and journal summaries — WanderMind is your intelligent travel companion.

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🧰 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#️-database-schema)
- [🤖 AI Features](#-ai-features)
- [🔌 API Reference](#-api-reference)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [🌐 Deployment](#-deployment)
- [🔐 Authentication](#-authentication)
- [📡 Real-time Features](#-real-time-features)

---

## ✨ Features

### 🤖 AI-Powered Tools
| Feature | Description |
|---|---|
| **AI Itinerary Builder** | Generate detailed day-by-day travel plans with activities, costs & local tips |
| **Smart Packing List** | Personalized packing checklists by destination, trip type & activities |
| **Budget Analyzer** | Smart spending breakdowns with saving tips and budget scoring |
| **Journal Summarizer** | Transform raw travel notes into polished, shareable journal entries |
| **Destination Chatbot** | Conversational AI travel assistant powered by your live destination database |

### 🗺️ Core Platform
- **Destination Discovery** — Browse featured destinations with geo-coordinates, climate info & ratings
- **Experience Booking** — Travelers can book host-led experiences with a full booking lifecycle (Pending → Confirmed → Completed)
- **Host Dashboard** — Hosts manage their experiences, track earnings and bookings
- **Traveler Dashboard** — Travelers view itineraries, journals, packing lists and booking history
- **Blog System** — AI-assisted travel blog publishing for the community
- **Wishlist** — Save favorite destinations to a personal wishlist
- **Reviews & Ratings** — Leave reviews on destinations and experiences post-booking
- **Real-time Notifications** — Live socket-based notification system across all dashboards
- **Admin Panel** — Platform management, content moderation, and stats oversight

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WanderMind Platform                    │
│                                                           │
│  ┌──────────────────┐        ┌───────────────────────┐   │
│  │  wandermind-client│        │  wandermind-server    │   │
│  │   (Next.js 16)   │◄──────►│   (Express 5 + TS)   │   │
│  │                  │  REST  │                       │   │
│  │  - App Router    │  +WS   │  - 12 REST modules    │   │
│  │  - TanStack Query│        │  - Socket.io          │   │
│  │  - Zustand Store │        │  - Zod validation     │   │
│  │  - Framer Motion │        │  - Pino logging       │   │
│  │  - shadcn/ui     │        │  - Rate limiting      │   │
│  └──────────────────┘        └──────────┬────────────┘   │
│                                         │                 │
│                    ┌────────────────────┼──────────────┐  │
│                    │                   │              │  │
│             ┌──────▼──────┐   ┌───────▼──────┐  ┌───▼──┐│
│             │  NeonDB     │   │  Upstash     │  │Cloud││
│             │ (PostgreSQL)│   │  Redis       │  │inary ││
│             │  + Prisma   │   │  (Cache +    │  │(CDN) ││
│             │             │   │   BullMQ)    │  │      ││
│             └─────────────┘   └──────────────┘  └──────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🧰 Tech Stack

### Frontend (`wandermind-client`)
| Category | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS v4** |
| UI Components | **shadcn/ui** + **Radix UI** |
| Animations | **Framer Motion 12** |
| Data Fetching | **TanStack Query v5** |
| Global State | **Zustand v5** |
| Forms | **React Hook Form** + **Zod** |
| Charts | **Recharts** |
| Real-time | **Socket.io Client** |
| Toasts | **Sonner** |

### Backend (`wandermind-server`)
| Category | Technology |
|---|---|
| Framework | **Express 5** |
| Language | **TypeScript 6** |
| ORM | **Prisma 5.22** |
| Database | **PostgreSQL** (NeonDB serverless) |
| Cache | **Redis** (Upstash via ioredis) |
| Queue | **BullMQ** |
| AI | **OpenAI SDK** (via OpenRouter) |
| Auth | **JWT** + **Google OAuth** |
| File Upload | **Multer** + **Cloudinary** |
| Real-time | **Socket.io** |
| Logging | **Pino** + **pino-http** |
| Security | **Helmet** + **express-rate-limit** |
| Validation | **Zod** |
| Monitoring | **Sentry** |

---

## 📁 Project Structure

```
STN AI-Driven Full-Stack Project/
├── wandermind-client/              # Next.js Frontend
│   └── src/
│       ├── app/                    # App Router pages
│       │   ├── page.tsx            # Landing page
│       │   ├── login/              # Auth pages
│       │   ├── register/
│       │   ├── dashboard/          # User dashboards (traveler & host)
│       │   ├── destinations/       # Destination listing & detail
│       │   ├── experiences/        # Experience listing & detail
│       │   ├── ai-planner/         # AI Itinerary builder page
│       │   ├── smart-packing/      # AI Packing list page
│       │   ├── budget-analyzer/    # AI Budget analyzer page
│       │   ├── journal-summarizer/ # AI Journal summarizer page
│       │   ├── blogs/              # Blog listing & posts
│       │   ├── notifications/      # Notification center
│       │   ├── my-profile/         # User profile management
│       │   ├── about/
│       │   ├── contact/
│       │   ├── faq/
│       │   └── privacy/
│       ├── components/
│       │   ├── home/               # Landing page sections
│       │   ├── dashboard/          # Dashboard widgets
│       │   ├── layout/             # Navbar, footer, sidebar
│       │   ├── shared/             # Reusable components
│       │   └── ui/                 # shadcn/ui base components
│       ├── services/               # Axios API service layer
│       ├── store/                  # Zustand auth store
│       └── lib/                    # Utilities
│
└── wandermind-server/              # Express Backend
    ├── prisma/
    │   ├── schema.prisma           # Full DB schema
    │   └── seed.ts                 # Database seeder
    └── src/
        ├── index.ts                # App entry, Socket.io setup
        ├── controllers/            # Business logic (12 modules)
        │   ├── ai.controller.ts    # All 5 AI features
        │   ├── auth.controller.ts  # JWT + Google OAuth
        │   ├── booking.controller.ts
        │   ├── blog.controller.ts
        │   ├── destination.controller.ts
        │   ├── experience.controller.ts
        │   ├── itinerary.controller.ts
        │   ├── review.controller.ts
        │   ├── stats.controller.ts
        │   ├── upload.controller.ts
        │   ├── user.controller.ts
        │   └── admin.controller.ts
        ├── routes/                 # Express routers (12 modules)
        ├── middleware/
        │   ├── auth.middleware.ts  # JWT verify, role guard
        │   ├── error.middleware.ts # Centralized error handler
        │   ├── rateLimit.middleware.ts
        │   └── upload.middleware.ts # Multer + Cloudinary
        ├── lib/
        │   ├── prisma.ts           # Prisma client singleton
        │   ├── redis.ts            # Redis client + cache helpers
        │   └── openai.ts           # OpenAI SDK config
        └── utils/
            ├── logger.ts           # Pino logger
            └── response.ts         # Standardized API responses
```

---

## 🗄️ Database Schema

The platform uses **PostgreSQL** managed through **Prisma ORM** with the following core models:

```
User ──┬── TravelerProfile ── Wishlist (Destination[])
       ├── HostProfile ──── Experience[]
       ├── Booking[] ──── Experience
       ├── Review[]
       ├── Itinerary[] (AI-generated)
       ├── JournalEntry[] (AI-summarized)
       ├── PackingList[] (AI-generated)
       ├── Notification[]
       └── BlogPost[]

Destination ──┬── Experience[]
              ├── Review[]
              └── Itinerary[]

Booking ── Review (1:1, post-completion)
```

### User Roles
| Role | Capabilities |
|---|---|
| `TRAVELER` | Browse, book, use AI tools, write reviews, manage personal content |
| `HOST` | Create & manage experiences, track bookings & earnings |
| `ADMIN` | Full platform access, content moderation, stats |

### Booking Lifecycle
```
PENDING → CONFIRMED → COMPLETED
    └──── CANCELLED
```

---

## 🤖 AI Features

All AI features use **GPT-4o-mini** via OpenRouter and return structured JSON responses.

### 1. 🗺️ AI Itinerary Builder
**Endpoint:** `POST /api/ai/itinerary`

Generates a complete multi-day itinerary saved to the user's account.

```json
{
  "destination": "Kyoto, Japan",
  "days": 5,
  "budget": 1500,
  "travelStyle": "cultural",
  "interests": ["temples", "food", "history"]
}
```

**Response includes:** Day-by-day activities with times, descriptions, costs, tips, packing suggestions, best time to visit, and local phrases.

---

### 2. 🧳 Smart Packing List Generator
**Endpoint:** `POST /api/ai/packing`

Produces a categorized packing checklist tailored to the destination, trip type, and planned activities.

```json
{
  "destination": "Bali",
  "tripType": "beach",
  "startDate": "2025-07-01",
  "endDate": "2025-07-10",
  "activities": ["snorkeling", "hiking", "temple visits"]
}
```

**Categories:** Clothing, Documents & Money, Toiletries, Electronics, Health & Safety, Snacks & Extras.

---

### 3. 💰 Budget Analyzer
**Endpoint:** `POST /api/ai/budget`

Breaks down estimated travel costs with a budget score, saving tips, and vs-budget comparison.

```json
{
  "destination": "Paris",
  "days": 7,
  "travelStyle": "moderate",
  "groupSize": 2,
  "totalBudget": 3000
}
```

**Response includes:** Per-category breakdown, budget score (0–100), label (Budget/Moderate/Comfortable/Luxury), saving tips, and splurge-worthy recommendations.

---

### 4. 📓 Journal Summarizer
**Endpoint:** `POST /api/ai/journal`

Transforms raw travel notes into a beautifully written journal entry with highlights, mood, hashtags, and an inspiring quote.

```json
{
  "rawNotes": "Woke up early, saw sunrise at Angkor Wat...",
  "destination": "Siem Reap, Cambodia",
  "travelDate": "2025-03-15"
}
```

---

### 5. 💬 Destination Discovery Chatbot
**Endpoint:** `POST /api/ai/chat`

A conversational travel assistant grounded in your live destination database, returning structured recommendations alongside natural language responses.

---

## 🔌 API Reference

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "string",
  "data": { ... }
}
```

### Endpoint Overview

| Module | Base Path | Auth Required |
|---|---|---|
| Authentication | `/api/auth` | Partial |
| Destinations | `/api/destinations` | Optional |
| Experiences | `/api/experiences` | Optional |
| Bookings | `/api/bookings` | ✅ Yes |
| Itineraries | `/api/itineraries` | ✅ Yes |
| Reviews | `/api/reviews` | ✅ Yes |
| Blogs | `/api/blogs` | Partial |
| AI Tools | `/api/ai` | Partial |
| Users | `/api/users` | ✅ Yes |
| Upload | `/api/upload` | ✅ Yes |
| Stats | `/api/stats` | ✅ Yes |
| Admin | `/api/admin` | ✅ Admin only |

### Auth Endpoints
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Email/password login
GET    /api/auth/google            Initiate Google OAuth
GET    /api/auth/google/callback   OAuth callback
GET    /api/auth/me                Get current user
POST   /api/auth/logout            Logout
```

### Health Check
```
GET    /health                     API health status
```

---

## ⚙️ Environment Variables

### Server (`wandermind-server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database (NeonDB PostgreSQL)
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3d

# AI (OpenAI / OpenRouter)
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1   # or https://api.openai.com/v1

# Cache
REDIS_URL="rediss://default:password@host:6379"

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# File Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS & OAuth redirect)
CLIENT_URL=http://localhost:3000

# Error Monitoring (optional)
SENTRY_DSN=your_sentry_dsn
```

### Client (`wandermind-client/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ⚠️ **Never commit `.env` files to version control.** Add them to `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20
- **npm** or **bun**
- PostgreSQL database (or a free [NeonDB](https://neon.tech) instance)
- Redis instance (or a free [Upstash](https://upstash.com) instance)
- OpenAI API key (or OpenRouter key)
- Cloudinary account (for image uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/sadik117/STN-AI-Driven-WanderMind-Project.git
cd "STN-AI-Driven-WanderMind-Project"
```

---

### 2. Set Up the Backend

```bash
cd wandermind-server

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env

# Push the database schema
npm run prisma:push

# (Optional) Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The server will start at `http://localhost:5000`.

---

### 3. Set Up the Frontend

```bash
cd ../wandermind-client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the development server
npm run dev
```

The client will start at `http://localhost:3000`.

---

## 🌐 Deployment

### Backend → Render (Web Service)

The backend is deployed as a **Render Web Service** with full Node.js support, which also enables long-lived **Socket.io** WebSocket connections — not possible with serverless platforms.

**Render Service Settings:**

| Setting | Value |
|---|---|
| **Environment** | Node |
| **Root Directory** | `wandermind-server` |
| **Build Command** | `npm install && npm run prisma:generate && npm run build` |
| **Start Command** | `npm run start` |
| **Instance Type** | Starter (or higher for WebSockets) |

> The build script runs `prisma generate` then bundles via `tsup` → `api/index.mjs`.

**Steps to deploy:**
1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repository
4. Set the **Root Directory** to `wandermind-server`
5. Fill in the Build & Start commands above
6. Add all environment variables from the [Environment Variables](#️-environment-variables) section in the Render dashboard
7. Click **Deploy**

> ⚠️ Make sure `CLIENT_URL` is set to your deployed frontend URL in Render's environment variables — this is required for CORS and Google OAuth redirects to work correctly.

> 💡 **Socket.io note:** Render Web Services support persistent WebSocket connections out of the box. No special configuration needed.

### Frontend → Vercel

```bash
cd wandermind-client
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your Render backend URL (e.g., `https://wandermind-server.onrender.com`).

---

## 🔐 Authentication

WanderMind supports two authentication methods:

### JWT (Email/Password)
1. `POST /api/auth/register` — creates user, returns JWT token
2. `POST /api/auth/login` — validates credentials, returns JWT token
3. All protected routes expect: `Authorization: Bearer <token>`

### Google OAuth 2.0
1. Redirect user to `GET /api/auth/google`
2. Server handles callback at `GET /api/auth/google/callback`
3. On success, redirects to frontend with JWT token as query param

### Role-Based Access Control
```typescript
// Middleware guards
authenticate          // Requires valid JWT
requireRole('ADMIN')  // Requires specific role
authenticateOptional  // Attaches user if token present, doesn't block
```

---

## 📡 Real-time Features

WanderMind uses **Socket.io** for real-time notifications across the platform.

### Server-side Setup
```typescript
io.on('connection', (socket) => {
  // Client joins their personal notification room
  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
  });
});
```

### Emitting Notifications
```typescript
// From any controller
const io = req.app.get('io');
io.to(`user:${userId}`).emit('notification', {
  title: 'Booking Confirmed!',
  message: 'Your experience has been confirmed.',
  type: 'booking',
});
```

### Client-side Connection
```typescript
const socket = io(process.env.NEXT_PUBLIC_API_URL!);
socket.emit('join', user.id);
socket.on('notification', (data) => { /* handle */ });
```

---

## 🧪 Scripts Reference

### Backend
| Script | Description |
|---|---|
| `npm run dev` | Start server with hot-reload (tsx watch) |
| `npm run build` | Generate Prisma client + bundle for production |
| `npm run start` | Start production server |
| `npm run prisma:push` | Sync schema to database |
| `npm run prisma:migrate` | Run migrations (dev) |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run seed` | Seed the database |

### Frontend
| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📦 Key Dependencies at a Glance

```
Backend                          Frontend
───────────────────────          ───────────────────────
express ^5.2                     next 16.2.5
prisma 5.22 / @prisma/client     react 19.2
socket.io ^4.8                   socket.io-client ^4.8
ioredis ^5.10                    @tanstack/react-query ^5
openai ^6.36                     zustand ^5
jsonwebtoken ^9                  framer-motion ^12
zod ^4                           zod ^4
cloudinary ^2.10                 recharts ^3
bullmq ^5.76                     react-hook-form ^7
helmet ^8                        shadcn + radix-ui
pino ^10                         tailwindcss ^4
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with ❤️ as part of the **STN AI-Driven Full-Stack Project**

*WanderMind — Plan Smart. Travel Far.*

</div>
