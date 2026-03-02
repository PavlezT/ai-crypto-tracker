# CryptoTracker

A full-stack cryptocurrency watchlist application. Users can register, log in, and manage personal watchlists of crypto symbols.

## 🏗️ Architecture

```
┌─────────────────────────┐
│   Frontend (Next.js)    │
│   - React 19            │
│   - TypeScript          │
│   - Tailwind CSS        │
└────────────┬────────────┘
             │ HTTP/JSON
             │
┌────────────▼────────────┐
│  Backend (FastAPI)      │
│   - Python              │
│   - RESTful API         │
│   - JWT Auth            │
└────────────┬────────────┘
             │ SQL
             │
┌────────────▼────────────┐
│ Database (PostgreSQL)   │
│ - Users                 │
│ - Watchlists            │
└─────────────────────────┘
```

## 📚 Project Structure

```
ai-crypto-tracker/
├── frontend/                 # Next.js 16 application
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   ├── context/              # React context
│   ├── lib/                  # Utilities and API client
│   ├── middleware.ts         # Route protection
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── routers/              # API endpoints
│   ├── main.py               # FastAPI app
│   ├── models.py             # SQLAlchemy ORM
│   ├── schemas.py            # Pydantic validation
│   ├── security.py           # Auth & encryption
│   ├── config.py             # Settings
│   ├── database.py           # DB connection
│   ├── init_db.py            # DB initialization
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Local config
│
├── contracts/                # API specifications
│   ├── swagger.json          # OpenAPI spec
│   └── db_schema.sql         # Database schema
│
├── memory_bank/              # Documentation
│   ├── activeContext.md      # Active status
│   ├── decisions.md          # Architecture decisions
│   ├── progress.md           # Development progress
│   ├── technical_specs.md    # Technical specifications
│   └── product_requirements.md
│
├── tests/                    # Test suite
│
├── architecture.md           # Architecture documentation
├── AGENTS.md                 # Agent rules
└── Readme.md                 # This file
```

## 🚀 Quick Start

### Option 1: Docker (Recommended) 🐳

Fastest way to get running - all services containerized.

**Prerequisites:**
- Docker Desktop ([download](https://www.docker.com/products/docker-desktop))

**Steps:**
```bash
# Clone and navigate
cd /path/to/ai-crypto-tracker

# Run setup script (macOS/Linux)
bash scripts/docker-setup.sh

# Or manual setup
cp .env.docker .env
docker compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Docs: http://localhost:8000/docs

**Useful commands:**
```bash
make logs          # View logs
make down          # Stop services
make restart       # Restart services
```

See [QUICKSTART.md](QUICKSTART.md) for more details.

---

### Option 2: Local Setup

If you prefer running services locally.

**Prerequisites:**

- **Node.js** 18+ (for frontend)
- **Python** 3.10+ (for backend)
- **PostgreSQL** 15+ (for database)

### 1. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
# Update .env.local:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Initialize database (macOS with Homebrew)
chmod +x setup.sh
./setup.sh

# Or manually initialize:
python init_db.py

# Start server
python main.py
```

Backend will be available at: **http://localhost:8000**

### 3. PostgreSQL Setup (macOS)

```bash
# Install PostgreSQL with Homebrew
brew install postgresql@15

# Start the server
brew services start postgresql@15

# Verify it's running
pg_isready
```

For other operating systems, see [PostgreSQL downloads](https://www.postgresql.org/download/).

## 🔑 Features

### Authentication
- **User Registration** - Create account with email/password
- **Login** - Authenticate and receive JWT token
- **Auto-login** - Get access token immediately after registration
- **Protected Routes** - Dashboard accessible only to authenticated users

### Watchlist Management
- **Add Symbols** - Add up to 50 crypto symbols to watchlist
- **View Watchlist** - Display all tracked symbols
- **Remove Symbols** - Delete symbols from watchlist
- **User Isolation** - Each user has their own watchlist

## 📖 API Documentation

### Interactive Docs

Once backend is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/watchlist` | Get user's watchlist |
| POST | `/watchlist` | Add symbol |
| DELETE | `/watchlist/{id}` | Remove symbol |

## 🔐 Authentication

The application uses **Bearer Token** authentication:

1. User registers/logs in → receives `access_token`
2. Token stored in localStorage and cookies
3. Token sent in `Authorization: Bearer {token}` header for protected routes
4. Backend validates JWT and extracts user ID
5. User isolation enforced via `user_id` in database queries

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Watchlist Table
```sql
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, symbol)
);
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing

### Database
- **PostgreSQL 18** - Relational database
- **UUID** - Primary keys

## 💻 Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start with hot reload
npm run build        # Production build
npm run lint         # Run ESLint
```

### Backend Development

```bash
cd backend
python main.py       # Start with auto-reload
# or
uvicorn main:app --reload
```

### Database Management

```bash
cd backend

# Initialize/reset database
python init_db.py

# Connect to database
psql postgresql://user:password@localhost:5432/crypto_tracker
```

## 🧪 Testing

Tests will be added as development progresses.

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
pytest
```

## 📝 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_tracker
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
ALLOWED_ORIGINS=http://localhost:3000
DEBUG=True
```

## 🚢 Deployment

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or any static host
- Environment: `NEXT_PUBLIC_API_URL` should point to production backend

### Backend
- Build Docker image (if needed)
- Deploy to: AWS, DigitalOcean, Heroku, or any VPS
- Ensure PostgreSQL is provisioned
- Set production environment variables

## 📚 Documentation

- [Architecture](./architecture.md) - System design and component interactions
- [Backend README](./backend/README.md) - Backend-specific documentation
- [Frontend Setup](./frontend/README.md) - Frontend-specific documentation
- [Technical Specs](./memory_bank/technical_specs.md) - Detailed specifications
- [Product Requirements](./memory_bank/product_requirements.md) - Feature requirements

## 🔄 Development Workflow

1. **Plan** - Define requirements and architecture
2. **Implement** - Develop features
3. **Test** - Verify functionality
4. **Deploy** - Release to production

All work is tracked in [memory_bank](./memory_bank/) for continuity and context preservation.

## 🤝 Contributing

Guidelines TBD

## 📄 License

MIT

## 📞 Support

For issues or questions, refer to the [architecture documentation](./architecture.md).
