from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import employees, attendance
import models
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import HTTPException
import logging
from typing import Any, Dict

# Create database tables
# In a production app, we would use migrations (Alembic)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# Basic logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hrms_lite")
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}


# Standardized error response helper
def _error_response(message: str, code: int, details: Any = None) -> Dict[str, Any]:
    payload = {"error": {"message": message, "code": code}}
    if details is not None:
        payload["error"]["details"] = details
    return payload


# Map Request validation errors (body/query/path) to 400 with standardized format
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    logger.debug("Request validation error: %s", exc)
    return JSONResponse(
        status_code=400,
        content=_error_response("Invalid request", 400, details=exc.errors()),
    )


# Map HTTPException to standardized format
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    # exc.detail may be string or dict
    detail = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    logger.info("HTTP error %s: %s", exc.status_code, detail)
    return JSONResponse(status_code=exc.status_code, content=_error_response(detail, exc.status_code))


# Generic exception handler for 500
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(
        status_code=500,
        content=_error_response("Internal server error", 500),
    )
