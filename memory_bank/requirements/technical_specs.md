# Technical Specifications

- Frontend: Next.js 16 (App Router)
- Backend: FastAPI (Python 3.12+)
- Database: PostgreSQL 18
- Communication: REST API (Swagger/OpenAPI)

## Integration
- Next.js frontend interacts with FastAPI backend via REST endpoints.
- FastAPI manages authentication and watchlist logic, connects to PostgreSQL.
- PostgreSQL stores users and watchlist data.
