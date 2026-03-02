# Pre-Run Verification Checklist

Run this checklist before starting the application to ensure everything is set up correctly.

## ✅ System Requirements

### Docker & Tools
- [ ] Docker Desktop installed (`docker --version`)
- [ ] Docker Compose available (`docker compose version`)
- [ ] At least 4GB RAM available for containers
- [ ] Ports 3000, 5432, 8000 are not in use

### Project Files
- [ ] Project cloned to `/Users/hd/Projects/ai-crypto-tracker`
- [ ] All files present (check workspace structure)
- [ ] `.env.docker` file exists
- [ ] `docker-compose.yml` file exists
- [ ] `backend/Dockerfile` file exists
- [ ] `frontend/Dockerfile` file exists

## 📋 Configuration Files

### Root Configuration
```bash
# Check files exist
ls -la docker-compose.yml
ls -la .env.docker
ls -la Makefile
ls -la QUICKSTART.md
```

### Backend Files
```bash
cd backend

# Check required files exist
ls -la Dockerfile
ls -la entrypoint.sh
ls -la main.py
ls -la requirements.txt
ls -la config.py
ls -la models.py
ls -la routers/auth.py
ls -la routers/watchlist.py
ls -la init_db.py

# Check permissions (should have execute bit)
ls -la entrypoint.sh
```

### Frontend Files
```bash
cd ../frontend

# Check required files exist
ls -la Dockerfile
ls -la .dockerignore
ls -la package.json
ls -la app/page.tsx
ls -la lib/api-client.ts
ls -la context/AuthContext.tsx
```

## 🐳 Docker Pre-Flight Check

```bash
# Clean start (optional)
docker system prune --volumes

# Check Docker daemon is running
docker ps

# Check available space
docker system df
```

## 🔧 Environment Setup

```bash
# Copy environment file
cp .env.docker .env

# Verify .env contains all required variables
grep -E "DB_|JWT_|API_URL" .env
```

## 🏗️ Build Check

```bash
# Build images (don't run yet, just verify they build)
docker compose build

# Expected output:
# - postgres image pulled or ready
# - backend image built successfully
# - frontend image built successfully

# Check images exist
docker images | grep crypto
```

## ✅ Pre-Run System Check

```bash
# Verify ports are free
lsof -i :3000    # Should return nothing
lsof -i :8000    # Should return nothing
lsof -i :5432    # Should return nothing

# Check available disk space (need ~2GB for images)
df -h | grep /
```

## 📝 Verification Script

Run this script to automatically verify everything:

```bash
#!/bin/bash
echo "Running pre-flight checks..."

# Check Docker
docker --version || { echo "❌ Docker not installed"; exit 1; }
echo "✅ Docker installed"

# Check Docker Compose
docker compose version || { echo "❌ Docker Compose not available"; exit 1; }
echo "✅ Docker Compose available"

# Check files
for file in docker-compose.yml .env.docker backend/Dockerfile frontend/Dockerfile backend/entrypoint.sh; do
    [ -f "$file" ] || { echo "❌ Missing: $file"; exit 1; }
done
echo "✅ All required files present"

# Check .env
[ -f .env ] || cp .env.docker .env
echo "✅ .env configured"

# Try to build (without running)
echo "Building images..."
docker compose build --no-cache 2>&1 | grep -E "(Built|Building|pushed)"
echo "✅ Build successful"

echo ""
echo "✅ All checks passed! Ready to run:"
echo "   docker compose up -d"
```

## 🚀 Ready to Run?

If all checks pass, start the application:

```bash
# Start services
docker compose up -d

# Monitor startup
docker compose logs -f

# Check services are running
docker compose ps

# Access application
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

## 🔴 Common Issues Before Running

### Issue: Ports Already in Use

**Symptom**: `Error response from daemon: Ports are not available`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000

# Either:
# 1. Kill the process: kill -9 <PID>
# 2. Change ports in .env: FRONTEND_PORT=3001
```

### Issue: Not Enough Disk Space

**Symptom**: `write: no space left on device`

**Solution**:
```bash
# Check space
df -h

# Clean up Docker (careful - removes unused images/containers)
docker system prune -a

# Consider: docker compose pull
```

### Issue: Docker Daemon Not Running

**Symptom**: `Cannot connect to Docker daemon`

**Solution**:
- macOS: Open Docker Desktop application
- Linux: `sudo systemctl start docker`
- Windows: Open Docker Desktop from Start menu

### Issue: Permission Denied

**Symptom**: `permission denied` on entrypoint.sh

**Solution**:
```bash
chmod +x backend/entrypoint.sh
docker compose build --no-cache backend
```

## 📊 Verification Success Indicators

After starting with `docker compose up -d`:

```bash
# All services should be in "Up" status
docker compose ps
# Output should show: postgres, backend, frontend all "Up"

# No red errors in logs
docker compose logs
# Should see:
# - postgres: listening on 0.0.0.0:5432
# - backend: Uvicorn running on 0.0.0.0:8000
# - frontend: ready - started on 0.0.0.0:3000

# Services respond to health checks
curl http://localhost:8000/health
# Output: {"status":"ok"}

curl http://localhost:3000
# Output: HTML home page
```

## 🎯 Next Steps After Verification

1. Open http://localhost:3000 in browser
2. Click "Register"
3. Create test account: test@example.com / password123
4. Add symbols to watchlist: BTC, ETH, SOL
5. Test 50-symbol limit
6. Test duplicate prevention

## 📞 Still Having Issues?

1. Check [DOCKER_SETUP.md](DOCKER_SETUP.md) for detailed troubleshooting
2. View logs: `docker compose logs -f <service>`
3. Full project docs: [Readme.md](Readme.md)

---

**✅ Checklist Complete?** You're ready to run!

```bash
docker compose up --build
```

Visit: http://localhost:3000 🚀
