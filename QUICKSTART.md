# CryptoTracker - Quick Start Guide

## 🚀 Fastest Way to Run

### Prerequisites
- Docker Desktop installed ([download here](https://www.docker.com/products/docker-desktop))

### One-Command Start

```bash
cd /path/to/ai-crypto-tracker

# Option A: Automatic setup (macOS/Linux)
bash scripts/docker-setup.sh

# Option B: Manual setup (all platforms)
cp .env.docker .env
docker compose up --build
```

**Wait 2-3 minutes** for services to build and start.

---

## 🌐 Access the Application

Once running:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |
| **Database** | localhost:5432 |

---

## ✅ Test It Out

### 1. Register User
- Go to http://localhost:3000
- Click "Register"
- Enter: `test@example.com` / `password123`
- Click "Sign Up"

### 2. Add Symbols
- You're now in Dashboard
- Enter a symbol: `BTC`
- Click "Add to Watchlist"
- Add more: `ETH`, `SOL`, etc.
- Max 50 symbols per user

### 3. Verify Features
- ✅ Token persists (page refresh maintains session)
- ✅ 50-symbol limit (add 50+, see error)
- ✅ No duplicates (add same symbol twice, see error)
- ✅ Delete symbols (click "Remove")

---

## 🛑 Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove database (clean slate next run)
docker compose down -v
```

---

## 📊 Monitor Services

```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# View service status
docker compose ps
```

---

## 🔧 Make Changes

### Frontend Changes
```
Edit: frontend/app/page.tsx (or any component)
Result: Hot reload - changes appear automatically
```

### Backend Changes
```
Edit: backend/main.py (or any module)
Result: Process restarts with your changes
```

### Database Changes
```
1. Stop services: docker compose down
2. Start fresh: docker compose up
```

---

## 🐛 Common Issues

### Issue: "Port already in use"
```bash
# Change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=8001
DB_PORT=5433
```

### Issue: "Can't connect to database"
```bash
# Check database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up
```

### Issue: Frontend can't reach backend
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check logs
docker compose logs backend
docker compose logs frontend
```

---

## 📚 Full Documentation

- **Detailed Docker Guide**: [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Project Overview**: [Readme.md](Readme.md)
- **Backend API Docs**: [Backend README](backend/README.md)
- **Architecture**: [architecture.md](architecture.md)

---

## 🎯 Key Features

✅ **Type-Safe**: TypeScript frontend + Python Pydantic backend  
✅ **Secure**: JWT authentication + Bcrypt hashing  
✅ **Scalable**: FastAPI + Next.js + PostgreSQL  
✅ **Containerized**: Docker Compose for easy deployment  
✅ **Documented**: Comprehensive guides and examples  

---

**Ready to go!** 🎉 Run `docker compose up --build` and start tracking crypto!

For help, see [DOCKER_SETUP.md](DOCKER_SETUP.md) or [Readme.md](Readme.md).
