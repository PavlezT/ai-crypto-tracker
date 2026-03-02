.PHONY: help build up down logs stop restart clean dev-logs db-logs backend-logs frontend-logs test lint format

help:
	@echo "╔════════════════════════════════════════════╗"
	@echo "║  CryptoTracker - Makefile Commands         ║"
	@echo "╚════════════════════════════════════════════╝"
	@echo ""
	@echo "Setup & Run:"
	@echo "  make setup        - Setup .env and build images"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs         - View all service logs"
	@echo "  make db-logs      - View database logs"
	@echo "  make backend-logs - View backend logs"
	@echo "  make frontend-logs- View frontend logs"
	@echo "  make status       - Show service status"
	@echo ""
	@echo "Development:"
	@echo "  make shell-backend - Shell into backend container"
	@echo "  make shell-frontend- Shell into frontend container"
	@echo "  make shell-db     - Connect to PostgreSQL"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean        - Remove all services and volumes"
	@echo "  make clean-images - Remove Docker images"
	@echo ""

setup:
	@echo "Setting up CryptoTracker..."
	@test -f .env || cp .env.docker .env
	@echo "✅ .env created"
	@echo "📝 Making scripts executable"
	@bash make-executable.sh
	@echo "📝 Running: docker compose build"
	@docker compose build
	@echo "✅ Setup complete. Run 'make up' to start services"

build:
	@echo "Building Docker images..."
	@docker compose build --no-cache
	@echo "✅ Build complete"

up:
	@echo "Starting services..."
	@docker compose up -d
	@sleep 2
	@echo ""
	@echo "✅ Services started!"
	@make status
	@echo ""
	@echo "Frontend:  http://localhost:3000"
	@echo "Backend:   http://localhost:8000"
	@echo "API Docs:  http://localhost:8000/docs"

down:
	@echo "Stopping services..."
	@docker compose down
	@echo "✅ Services stopped"

restart:
	@echo "Restarting services..."
	@docker compose restart
	@echo "✅ Services restarted"
	@make status

clean:
	@echo "Cleaning up everything..."
	@docker compose down -v
	@echo "✅ All services and volumes removed"

clean-images:
	@echo "Removing Docker images..."
	@docker compose rm --force
	@docker rmi ai-crypto-tracker-backend ai-crypto-tracker-frontend 2>/dev/null || true
	@echo "✅ Images removed"

logs:
	@docker compose logs -f

dev-logs:
	@echo "Backend logs (press Ctrl+C to stop):"
	@docker compose logs backend

db-logs:
	@echo "PostgreSQL logs (press Ctrl+C to stop):"
	@docker compose logs postgres

backend-logs:
	@echo "FastAPI backend logs (press Ctrl+C to stop):"
	@docker compose logs -f backend

frontend-logs:
	@echo "Next.js frontend logs (press Ctrl+C to stop):"
	@docker compose logs -f frontend

status:
	@docker compose ps

shell-backend:
	@docker compose exec backend /bin/bash

shell-frontend:
	@docker compose exec frontend /bin/bash

shell-db:
	@docker compose exec postgres psql -U crypto_user -d crypto_tracker

# Database operations
db-init:
	@echo "Initializing database..."
	@docker compose exec backend python init_db.py
	@echo "✅ Database initialized"

db-reset:
	@echo "Resetting database..."
	@docker compose down -v
	@docker compose up -d
	@sleep 5
	@echo "✅ Database reset"

# Testing (placeholder for future automation)
test:
	@echo "Running tests..."
	@echo "Tests not yet implemented"

lint:
	@echo "Running linters..."
	@echo "Linters not yet configured"

format:
	@echo "Formatting code..."
	@echo "Formatters not yet configured"

# View container environments
env-backend:
	@docker compose exec backend env | grep -E "DB_|JWT_|ALLOWED"

env-frontend:
	@docker compose exec frontend env | grep NEXT_PUBLIC

# Stats and monitoring
stats:
	@docker stats --no-stream

# Production-ready build
build-prod:
	@echo "Building production images..."
	@docker compose build --no-cache --pull
	@echo "✅ Production build complete"

# Quick health check
health:
	@echo "Checking service health..."
	@echo "Frontend: $(shell curl -s http://localhost:3000 > /dev/null && echo '✅' || echo '❌')"
	@echo "Backend:  $(shell curl -s http://localhost:8000/health > /dev/null && echo '✅' || echo '❌')"
	@echo "Database: $(shell docker compose exec postgres pg_isready > /dev/null 2>&1 && echo '✅' || echo '❌')"

# Documentation
docs:
	@echo "Opening documentation..."
	@open DOCKER_SETUP.md || xdg-open DOCKER_SETUP.md || echo "See DOCKER_SETUP.md"

# Quick workflow
dev: down setup up logs
prod: build-prod up status
test-run: up health

.DEFAULT_GOAL := help
