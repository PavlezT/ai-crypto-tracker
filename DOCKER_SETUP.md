# CryptoTracker - Docker Compose Setup

This guide helps you run CryptoTracker using Docker and Docker Compose.

## Prerequisites

- Docker Desktop (includes Docker and Docker Compose)
  - [Download Docker](https://www.docker.com/products/docker-desktop)
  - Or for Linux: `apt-get install docker.io docker-compose`

## Quick Start

### 1. Clone and Navigate to Project

```bash
cd /path/to/ai-crypto-tracker
```

### 2. Prepare Environment

```bash
# Copy Docker environment file
cp .env.docker .env
```

Or customize it:
```bash
# Edit .env with your settings
nano .env
```

### 3. Build and Run All Services

```bash
# Build images (first time only)
docker-compose build

# Start all services
docker-compose up
```

Or in background:
```bash
docker-compose up -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 5. Monitor Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Common Commands

### Start Services

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Rebuild Services

```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild specific service
docker-compose build backend
```

### Execute Commands in Container

```bash
# Run command in backend
docker-compose exec backend python init_db.py

# Run command in frontend
docker-compose exec frontend npm run lint

# Access PostgreSQL
docker-compose exec postgres psql -U crypto_user -d crypto_tracker
```

### View Running Services

```bash
docker-compose ps
```

## Architecture

```
┌─────────────────────────────────────────┐
│         Docker Compose Network          │
│  ┌─────────────┬─────────────┬────────┐ │
│  │  Frontend   │  Backend    │Database│ │
│  │ (Next.js)   │ (FastAPI)   │(Postgres)│
│  │  :3000      │   :8000     │ :5432  │ │
│  └─────────────┴─────────────┴────────┘ │
└─────────────────────────────────────────┘
```

## Services

### PostgreSQL Database
- **Image**: `postgres:15-alpine`
- **Container**: `crypto_tracker_db`
- **Port**: `5432`
- **Volume**: `postgres_data` (persistent)
- **Health Check**: Enabled

### FastAPI Backend
- **Context**: `./backend`
- **Container**: `crypto_tracker_backend`
- **Port**: `8000`
- **Volume**: `./backend` (hot reload)
- **Depends On**: PostgreSQL (healthy)
- **Startup**: Automatic DB initialization

### Next.js Frontend
- **Context**: `./frontend`
- **Container**: `crypto_tracker_frontend`
- **Port**: `3000`
- **Volume**: `./frontend` (hot reload)
- **Depends On**: Backend

## Environment Variables

### Database Variables
```
DB_USER=crypto_user              # PostgreSQL user
DB_PASSWORD=crypto_password      # PostgreSQL password
DB_NAME=crypto_tracker          # Database name
DB_PORT=5432                    # PostgreSQL port
```

### Backend Variables
```
DATABASE_URL=postgresql://...    # Auto-generated
BACKEND_PORT=8000              # Backend port
JWT_SECRET_KEY=...              # JWT signing key
ALLOWED_ORIGINS=localhost:3000  # CORS origins
```

### Frontend Variables
```
FRONTEND_PORT=3000                        # Frontend port
NEXT_PUBLIC_API_URL=http://localhost:8000 # API URL
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000    # Frontend
lsof -i :8000    # Backend
lsof -i :5432    # Database

# Kill the process
kill -9 <PID>

# Or change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=8001
DB_PORT=5433
```

### Database Connection Error

```bash
# Check database logs
docker-compose logs postgres

# Verify database is running
docker-compose ps

# Check DATABASE_URL in backend logs
docker-compose logs backend
```

### Frontend Can't Connect to Backend

```bash
# Verify backend is running
curl http://localhost:8000/health

# Check NEXT_PUBLIC_API_URL in frontend
docker-compose logs frontend | grep API_URL
```

### Permission Denied on entrypoint.sh

```bash
# Fix permissions
chmod +x backend/entrypoint.sh

# Rebuild
docker-compose build --no-cache backend
```

## Development Workflow

### Make Changes to Backend

```bash
# Code changes are auto-reloaded
# Edit backend/*.py
# Changes take effect immediately

# View logs to verify
docker-compose logs -f backend
```

### Make Changes to Frontend

```bash
# Code changes trigger hot reload
# Edit frontend/**/*.tsx
# Changes appear in browser automatically

# View logs to verify
docker-compose logs -f frontend
```

### Reset Database

```bash
# Stop services
docker-compose down -v

# Remove volume
docker volume rm ai-crypto-tracker_postgres_data

# Start again
docker-compose up
```

## Production Considerations

### Before Production

```bash
# Update .env with production values
ALLOWED_ORIGINS=https://yourdomain.com
JWT_SECRET_KEY=<generate-secure-key>
DEBUG=False
```

### Build for Production

```bash
# Build without cache
docker-compose build --no-cache

# Tag images
docker tag crypto_tracker_backend:latest yourdomain/backend:1.0
docker tag crypto_tracker_frontend:latest yourdomain/frontend:1.0
```

### Deploy

```bash
# Push to registry
docker push yourdomain/backend:1.0
docker push yourdomain/frontend:1.0

# On production server
docker-compose pull
docker-compose up -d
```

## Network Overview

Services communicate via container names:
- Backend connects to database as `postgres:5432`
- Frontend connects to backend as `backend:8000`
- CORS allows requests from allowed origins

## Performance Tips

### Reduce Build Time

```bash
# Use Docker layer caching
docker-compose build --cache-from crypto_tracker_backend backend
```

### Reduce Image Size

Dockerfiles use `alpine` images (Python 3.11-slim, Node 18-alpine) for smaller size.

### Monitor Resource Usage

```bash
# View container stats
docker stats

# Limit resources in docker-compose.yml
# Add to services:
# resources:
#   limits:
#     cpus: '1'
#     memory: 512M
```

## Support

For issues:
1. Check logs: `docker-compose logs -f <service>`
2. Verify volumes: `docker volume ls`
3. Check network: `docker network inspect ai-crypto-tracker_crypto_network`
4. See [Readme.md](../Readme.md) for general setup

---

**Happy Docker-ing! 🐳**
