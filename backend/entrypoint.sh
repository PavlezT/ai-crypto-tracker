#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
python << END
import socket
import time

for i in range(30):
    try:
        socket.create_connection(('postgres', 5432), timeout=1)
        print("PostgreSQL is ready!")
        break
    except (socket.timeout, ConnectionRefusedError):
        if i == 29:
            print("PostgreSQL is not available after 30 retries")
            exit(1)
        time.sleep(1)
END

echo "Initializing database..."
python init_db.py

echo "Starting FastAPI server..."
exec python main.py
