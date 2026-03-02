# CryptoTracker Backend

FastAPI backend for managing cryptocurrency watchlists.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_tracker
JWT_SECRET_KEY=your-secret-key-change-this-in-production
```

### 3. Initialize Database

Make sure PostgreSQL is running, then:

```bash
python init_db.py
```

This will:
- Create the database if it doesn't exist
- Create all required tables

### 4. Run the Server

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- HTTP: http://localhost:8000
- OpenAPI/Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Watchlist

- `GET /watchlist` - Get user's watchlist (requires Bearer token)
- `POST /watchlist` - Add symbol to watchlist (requires Bearer token)
- `DELETE /watchlist/{id}` - Remove symbol from watchlist (requires Bearer token)

## Database Schema

The database uses PostgreSQL 18 with two main tables:

- `users` - User accounts (id, email, hashed_password, created_at)
- `user_favorites` - User watchlist items (id, user_id, symbol, created_at)

See [contracts/db_schema.sql](../contracts/db_schema.sql) for full schema.

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── config.py            # Settings management from .env
├── database.py          # SQLAlchemy setup and session
├── models.py            # ORM models (User, UserFavorite)
├── schemas.py           # Pydantic request/response schemas
├── security.py          # Password hashing and JWT handling
├── init_db.py           # Database initialization script
├── requirements.txt     # Python dependencies
├── .env                 # Local configuration (not in git)
├── .env.example         # Configuration template
└── routers/
    ├── auth.py          # /auth endpoints
    └── watchlist.py     # /watchlist endpoints
```

## Development

### Running with hot reload:

```bash
python main.py
```

### Running tests (when implemented):

```bash
pytest tests/
```

### Database migrations:

Currently using SQLAlchemy ORM for schema management. Tables are created automatically on app startup via `Base.metadata.create_all()`.

For manual schema changes, edit `models.py` and restart the application.

## Security Notes

⚠️ **Do not commit `.env` file to version control!**

- Update `JWT_SECRET_KEY` in production
- Use strong database password
- Enable HTTPS in production
- Configure CORS properly for your frontend URL
