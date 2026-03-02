# Decisions

## Architecture Decisions
- Tech stack and directory structure defined as per requirements
- React Context for state management (no Redux for simplicity)
- FastAPI for high performance and automatic documentation
- PostgreSQL for data persistence and relationships

## Docker Decisions
- **Docker Compose** for local development and deployment
  - Simpler than Kubernetes for current project scope
  - Easy to understand for team members
  - Good balance between power and simplicity

- **Multi-stage builds**: Not implemented (services are lightweight)
  - Python 3.11-slim already optimized for size
  - Node 18-alpine minimizes frontend image

- **Health checks**: Implemented for PostgreSQL
  - Backend depends on PostgreSQL health
  - Frontend depends on backend availability
  - Proper startup ordering prevents race conditions

- **Volume strategy**:
  - Development: Mount source code for hot reload
  - Data: PostgreSQL data persisted in named volume
  - Dependencies: node_modules and venv in containers

## Authentication Strategy
- JWT tokens with 24-hour expiration
- Bcrypt with cost factor 12
- Dual storage: localStorage (app access) + cookies (middleware access)
- Bearer token in Authorization header

## Database Design
- UUID primary keys (not incremental integers)
- Unique constraints on email and (user_id, symbol) pairs
- Cascade delete for referential integrity
- No soft deletes (clean architecture)

## Error Handling
- HTTP status codes: 400, 401, 403, 404, 409, 422
- Validation errors include field details
- Consistent error response format

## Configuration Management
- Environment variables for all secrets
- Separate .env files for development and Docker
- Pydantic Settings for validation
- CORS whitelist instead of allow-all

## Testing Strategy (For Future)
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for user workflows

