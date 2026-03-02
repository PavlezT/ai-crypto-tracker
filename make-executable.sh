#!/bin/bash
# Make scripts executable before running Docker

echo "Setting executable permissions on scripts..."

# Backend entrypoint
chmod +x backend/entrypoint.sh
chmod +x backend/setup.sh

# Setup script
chmod +x scripts/docker-setup.sh

echo "✅ All scripts are now executable"
echo ""
echo "Ready to run: docker compose up --build"
