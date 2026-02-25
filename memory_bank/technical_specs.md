# Technical Specifications

## Frontend-Backend Interaction
- The Next.js frontend communicates with the FastAPI backend via RESTful API endpoints.
- Authentication is handled via POST requests to /register and /login endpoints.
- Watchlist management is handled via GET, POST, and DELETE requests to /favorites endpoints.

## Database Schema Requirements
- Users table: Stores user credentials (UUID, email, hashed password, created_at).
- User_favorites table: Stores user-specific favorite crypto symbols (UUID, user_id, symbol, created_at).
- Relational integrity enforced via foreign keys (user_id references users.id).
