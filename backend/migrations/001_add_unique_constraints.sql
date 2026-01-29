-- Migration: Add UNIQUE constraints on employee_id and email
-- Run this against your staging/production database (e.g., psql)

ALTER TABLE IF EXISTS employees
ADD CONSTRAINT IF NOT EXISTS employees_employee_id_unique UNIQUE (employee_id);

ALTER TABLE IF EXISTS employees
ADD CONSTRAINT IF NOT EXISTS employees_email_unique UNIQUE (email);

