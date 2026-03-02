#!/bin/bash

# CryptoTracker Backend Setup Script for macOS
# This script helps set up PostgreSQL and initialize the database

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║   CryptoTracker Backend - macOS Setup Script           ║"
echo "╚════════════════════════════════════════════════════════╝"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo ""
    echo "❌ PostgreSQL is not installed"
    echo ""
    echo "Install PostgreSQL using Homebrew:"
    echo "  brew install postgresql@15"
    echo ""
    echo "Or download from: https://www.postgresql.org/download/macosx/"
    exit 1
fi

echo "✅ PostgreSQL found: $(psql --version)"

# Check if PostgreSQL server is running
if ! pg_isready > /dev/null 2>&1; then
    echo ""
    echo "⚠️  PostgreSQL server is not running"
    echo ""
    echo "Start PostgreSQL (if installed via Homebrew):"
    echo "  brew services start postgresql@15"
    echo ""
    echo "Or if you prefer to start manually:"
    echo "  pg_ctl -D /usr/local/var/postgres start"
    echo ""
    read -p "Press enter after starting PostgreSQL..."
fi

# Check if server is now running
if ! pg_isready > /dev/null 2>&1; then
    echo "❌ PostgreSQL server is still not running"
    exit 1
fi

echo "✅ PostgreSQL server is running"

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Copy env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created (update with your database credentials if needed)"
else
    echo "✅ .env file already exists"
fi

# Initialize database
echo ""
echo "🗄️  Initializing database..."
python init_db.py

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ Setup completed!                                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "1. Update .env with your database credentials if needed"
echo "2. Run the backend: python main.py"
echo "3. Visit: http://localhost:8000/docs"
echo ""
