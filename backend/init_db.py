#!/usr/bin/env python3
"""
Database initialization script for CryptoTracker.
This script creates the database and tables if they don't exist.
"""

import sys
import os
from sqlalchemy import text, create_engine, inspect
from config import get_settings
from database import engine, Base
from models import User, UserFavorite

settings = get_settings()


def create_database():
    """Create the database if it doesn't exist."""
    # Extract connection parameters
    db_url = settings.DATABASE_URL
    
    # Parse connection string
    # Format: postgresql://user:password@host:port/dbname
    if "://" not in db_url:
        print("❌ Invalid DATABASE_URL format")
        return False
    
    scheme, credentials_and_host = db_url.split("://")
    credentials, host_and_db = credentials_and_host.rsplit("@", 1)
    host_port, dbname = host_and_db.rsplit("/", 1)
    
    # Create connection to default postgres database
    if ":" in host_port:
        host, port = host_port.split(":")
    else:
        host = host_port
        port = "5432"
    
    user, password = credentials.split(":", 1)
    
    # Connect to default postgres database
    default_db_url = f"postgresql://{user}:{password}@{host}:{port}/postgres"
    
    try:
        default_engine = create_engine(default_db_url)
        with default_engine.connect() as conn:
            conn.execute(text("COMMIT"))  # Close any open transaction
            # Check if database exists
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{dbname}'")
            )
            if result.fetchone():
                print(f"✅ Database '{dbname}' already exists")
                return True
            else:
                # Create database
                conn.execute(text(f"CREATE DATABASE {dbname}"))
                conn.commit()
                print(f"✅ Database '{dbname}' created successfully")
                return True
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        print("Make sure PostgreSQL is running and your DATABASE_URL is correct")
        return False


def create_tables():
    """Create all tables using SQLAlchemy ORM."""
    try:
        # Check if tables already exist
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if "users" in existing_tables and "user_favorites" in existing_tables:
            print("✅ Tables already exist")
            return True
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully")
        
        # Verify tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"   Tables: {', '.join(tables)}")
        
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False


def main():
    """Main initialization process."""
    print("=" * 50)
    print("🚀 CryptoTracker Database Initialization")
    print("=" * 50)
    
    # Step 1: Create database
    print("\n1️⃣  Creating database...")
    if not create_database():
        sys.exit(1)
    
    # Step 2: Create tables
    print("\n2️⃣  Creating tables...")
    if not create_tables():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ Database initialization completed successfully!")
    print("=" * 50)
    print("\nNext steps:")
    print("1. Update .env with your database credentials if needed")
    print("2. Run: cd backend && python main.py")
    print("3. Visit: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
