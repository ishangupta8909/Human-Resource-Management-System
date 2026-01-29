#!/usr/bin/env python3
"""
Database Initialization Script for HRMS Lite
This script creates all database tables in PostgreSQL
"""

from database import engine, Base
import models


def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("\nTables created:")
    print("  - employees")
    print("  - attendance")
    print("\nYour HRMS Lite database is ready to use!")


if __name__ == "__main__":
    init_db()
