#!/bin/bash
# CryptoTracker - Complete Implementation Verification

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   CryptoTracker - Implementation Verification Script       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1 (MISSING)"
        ((FAILED++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $1/ (MISSING)"
        ((FAILED++))
    fi
}

echo "🔍 Checking core files..."
echo ""

# Root files
check_file "docker-compose.yml"
check_file ".env.docker"
check_file "Makefile"
check_file "Readme.md"
check_file "QUICKSTART.md"
check_file "DOCKER_SETUP.md"
check_file "PRE_RUN_CHECKS.md"
check_file "IMPLEMENTATION_SUMMARY.md"
check_file "architecture.md"

echo ""
echo "🔍 Checking backend files..."
echo ""

# Backend files
check_file "backend/Dockerfile"
check_file "backend/entrypoint.sh"
check_file "backend/main.py"
check_file "backend/config.py"
check_file "backend/database.py"
check_file "backend/models.py"
check_file "backend/schemas.py"
check_file "backend/security.py"
check_file "backend/init_db.py"
check_file "backend/requirements.txt"
check_file "backend/.env"
check_file "backend/routers/auth.py"
check_file "backend/routers/watchlist.py"
check_file "backend/README.md"

echo ""
echo "🔍 Checking frontend files..."
echo ""

# Frontend files
check_file "frontend/Dockerfile"
check_file "frontend/package.json"
check_file "frontend/middleware.ts"
check_file "frontend/lib/api-client.ts"
check_file "frontend/lib/config.ts"
check_file "frontend/context/AuthContext.tsx"
check_file "frontend/app/page.tsx"
check_file "frontend/app/dashboard/page.tsx"
check_file "frontend/app/login/page.tsx"
check_file "frontend/app/register/page.tsx"
check_file "frontend/.env.local"

echo ""
echo "🔍 Checking documentation..."
echo ""

# Documentation
check_file "memory_bank/activeContext.md"
check_file "memory_bank/progress.md"
check_file "memory_bank/decisions.md"
check_file "contracts/db_schema.sql"
check_file "contracts/swagger.json"

echo ""
echo "🔍 Checking directories..."
echo ""

# Directories
check_dir "backend/routers"
check_dir "frontend/components"
check_dir "frontend/context"
check_dir "frontend/lib"
check_dir "frontend/app"
check_dir "memory_bank"
check_dir "contracts"

echo ""
echo "📋 Verification Summary"
echo "═══════════════════════════════════════════════════════════"
echo -e "✅ Passed: ${GREEN}${PASSED}${NC}"
echo -e "❌ Failed: ${RED}${FAILED}${NC}"
echo "═══════════════════════════════════════════════════════════"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Ready to run:"
    echo "   bash make-executable.sh    # Make scripts executable"
    echo "   docker compose up --build  # Start services"
    echo ""
    echo "📱 Access application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    exit 0
else
    echo ""
    echo -e "${RED}❌ SOME FILES ARE MISSING${NC}"
    echo "Please check the missing files and try again."
    exit 1
fi
