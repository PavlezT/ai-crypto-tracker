#!/bin/bash
# CryptoTracker Docker Quick Setup Script

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║  CryptoTracker - Docker Compose Setup         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "Please download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker installed: $(docker --version)"

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Docker Compose installed: $(docker compose version)"

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env from .env.docker..."
    cp .env.docker .env
    echo "✅ .env created (update as needed)"
else
    echo "✅ .env already exists"
fi

# Build images
echo ""
echo "🏗️  Building Docker images..."
docker compose build

# Start services
echo ""
echo "🚀 Starting services..."
docker compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check services health
echo ""
echo "🔍 Checking service status..."
docker compose ps

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                           ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Services running on:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Useful commands:"
echo "  View logs:     docker compose logs -f"
echo "  Stop services: docker compose down"
echo "  Rebuild:       docker compose build --no-cache"
echo ""
echo "📖 For more info, see DOCKER_SETUP.md"
echo ""
