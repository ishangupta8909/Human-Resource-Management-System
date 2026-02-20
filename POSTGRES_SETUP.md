# PostgreSQL Setup Guide for HRMS Lite

**Note:** This project now uses PostgreSQL exclusively. SQLite support has been removed.

This guide documents the PostgreSQL setup for your HRMS Lite application.

## Current Configuration

The application is already configured to use PostgreSQL with the following credentials:

## Prerequisites

- PostgreSQL installed on your system
- Python virtual environment activated

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Or start manually
pg_ctl -D /opt/homebrew/var/postgresql@15 start
```

### Verify Installation
```bash
psql --version
```

## Step 2: Create Database and User

```bash
# Connect to PostgreSQL
psql postgres

# In the PostgreSQL prompt, run:
CREATE DATABASE hrms_lite;
CREATE USER hrms_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hrms_lite TO hrms_user;

# Exit PostgreSQL
\q
```

## Step 3: Install PostgreSQL Driver

```bash
cd backend
source venv/bin/activate  # Activate your virtual environment
pip install psycopg2-binary
```

## Step 4: Create/Update .env File

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

Add the following content to `.env`:

```env
DATABASE_URL=postgresql://hrms_user:your_secure_password@localhost:5432/hrms_lite
```

**Important:** Replace `your_secure_password` with the password you set in Step 2.

## Step 5: Update requirements.txt

Add PostgreSQL driver to your dependencies:

```bash
cd backend
echo "psycopg2-binary==2.9.9" >> requirements.txt
```

## Step 6: Initialize Database Tables

Your application will automatically create tables on first run. To manually initialize:

```python
# In Python shell or create a script
from database import engine, Base
from models import Employee, Attendance

Base.metadata.create_all(bind=engine)
```

Or create a migration script:

```bash
cd backend
cat > init_db.py << 'EOF'
from database import engine, Base
import models

def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
EOF

python init_db.py
```

## Step 8: Restart Your Application

```bash
# Stop the current server (Ctrl+C)
# Restart with the new PostgreSQL connection
cd backend
./venv/bin/uvicorn main:app --reload --port 8000
```

## Verification

1. Check that your application starts without errors
2. Try creating a new employee
3. Verify data persistence by restarting the server

## Connection String Format

```
postgresql://username:password@host:port/database_name
```

Example:
```
postgresql://hrms_user:mypassword@localhost:5432/hrms_lite
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running: `brew services list`
- Check PostgreSQL is listening: `lsof -i :5432`

### Authentication Failed
- Verify username and password in `.env`
- Check PostgreSQL user permissions

### Database Does Not Exist
- Ensure you created the database: `psql -l` to list databases

### Module Not Found: psycopg2
- Install the driver: `pip install psycopg2-binary`

## Production Considerations

For production deployment:

1. Use environment variables for sensitive data
2. Enable SSL connections
3. Set up regular backups
4. Configure connection pooling
5. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)

Example production connection string:
```
postgresql://user:password@host:5432/dbname?sslmode=require
```
