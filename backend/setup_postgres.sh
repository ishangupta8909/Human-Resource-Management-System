#!/bin/bash

# PostgreSQL Setup Script for HRMS Lite
# This script creates the database and user for the HRMS Lite application

# Add PostgreSQL to PATH
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

echo "Creating PostgreSQL database and user for HRMS Lite..."
echo ""

# Create database and user
/opt/homebrew/opt/postgresql@15/bin/psql postgres << EOF
-- Create database
CREATE DATABASE hrms_lite;

-- Create user
CREATE USER hrms_user WITH PASSWORD 'hrms_password_2026';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hrms_lite TO hrms_user;

-- Grant schema privileges (for PostgreSQL 15+)
\c hrms_lite
GRANT ALL ON SCHEMA public TO hrms_user;

-- Exit
\q
EOF

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Database: hrms_lite"
echo "User: hrms_user"
echo "Password: hrms_password_2026"
echo ""
echo "Next steps:"
echo "1. Create a .env file in the backend directory"
echo "2. Add this line to .env:"
echo "   DATABASE_URL=postgresql://hrms_user:hrms_password_2026@localhost:5432/hrms_lite"
echo "3. Install psycopg2-binary: pip install psycopg2-binary"
echo "4. Restart your application"
echo ""
