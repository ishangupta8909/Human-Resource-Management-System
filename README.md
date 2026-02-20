# HRMS Lite

A lightweight Human Resource Management System (HRMS) designed for simplicity and efficiency. It allows organizations to manage employee records, track attendance, and visualize key metrics through a clean, modern dashboard.

## Deployed At:

- **Frontend**: https://human-resource-management-system-eight.vercel.app
- **Backend**: https://human-resource-management-system-7ha9.onrender.com

**If frontend is blank, please make sure backend is active by clicking the link above**



## Features
- **Employee Management**: Add, view, and delete employee records with ease.
- **Attendance Tracking**: Mark daily attendance (Present/Absent) and view historical records.
- **Dashboard**: Real-time summary of total employees and today's attendance metrics.
- **Responsive Design**: Built with modern web technologies for a smooth experience across devices.

## Tech Stack

### Frontend
- **React 19**: Modern UI library for building dynamic interfaces.
- **Vite**: Ultra-fast build tool and development server.
- **Axios**: Promise-based HTTP client for API interactions.
- **React Router 7**: Declarative routing for navigation.
- **Vanilla CSS**: Custom, flexible styling without heavy frameworks.

### Backend
- **FastAPI**: High-performance Python web framework for building APIs.
- **SQLAlchemy 2.0**: Powerful SQL Toolkit and Object-Relational Mapper (ORM).
- **Pydantic 2.0**: Modern data validation and settings management.
- **Uvicorn**: Lightning-fast ASGI server implementation.

### Database
- **PostgreSQL**: Robust, enterprise-grade relational database (required).

---

## Steps to Run Locally

### Prerequisites
- **Python 3.8+**
- **Node.js 18+ & npm**
- **PostgreSQL** (Service running locally)

### 1. Database Setup
1. Create a PostgreSQL database named `hrms_lite`.
2. Create a user and grant privileges (Refer to [POSTGRES_SETUP.md](file:///Users/lambi-lakeer/Projects/HRMS_lite/POSTGRES_SETUP.md) for detailed steps).

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` directory and add your database URL:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/hrms_lite
   ```
5. (Optional) Initialize the database tables:
   ```bash
   python init_db.py
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (if needed) for the API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## Assumptions & Limitations
- **Authentication**: This is a "Lite" version; no authentication or authorization is currently implemented. It is assumed the system is accessed by an administrator in a trusted environment.
- **Database**: PostgreSQL is the **required** database. 
- **Data Integrity**: Unique constraints are enforced for employee IDs and emails. Attendance can only be marked once per employee per day.
- **Scalability**: Designed for small to medium-sized teams. For larger scale, consider implementing pagination and more advanced caching.

---

## Deployment Guide
For detailed instructions on deploying to platforms like Vercel, Netlify, Render, or Railway, please refer to the deployment section in the original file or contact the maintainer. The project includes a `Dockerfile` in the backend for containerized deployments.
