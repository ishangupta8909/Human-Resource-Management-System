from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
import models, schemas
from database import get_db

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post(
    "/{employee_id}",
    response_model=schemas.Attendance,
    status_code=status.HTTP_201_CREATED,
)
def mark_attendance(
    employee_id: int,
    attendance: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
):
    # Check if employee exists
    db_employee = (
        db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    )
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already marked for this date
    existing_attendance = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee_id,
            models.Attendance.date == attendance.date,
        )
        .first()
    )

    if existing_attendance:
        # Update existing record
        existing_attendance.status = attendance.status
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance

    db_attendance = models.Attendance(
        **attendance.model_dump(), employee_id=employee_id
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


@router.get("/check/{employee_id}/{date}")
def check_attendance_exists(employee_id: int, date: str, db: Session = Depends(get_db)):
    """Check if attendance record exists for employee on specific date"""
    existing_attendance = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.employee_id == employee_id,
            models.Attendance.date == date,
        )
        .first()
    )

    if existing_attendance:
        return {
            "exists": True,
            "status": existing_attendance.status.value,
            "id": existing_attendance.id,
        }
    return {"exists": False}


@router.get("/{employee_id}", response_model=List[schemas.Attendance])
def get_employee_attendance(
    employee_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    )
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)
    return query.order_by(models.Attendance.date.desc()).all()


@router.get("/summary/today", response_model=schemas.DashboardSummary)
def get_today_summary(db: Session = Depends(get_db)):
    today = date.today()
    total_employees = db.query(models.Employee).count()
    present_today = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.date == today,
            models.Attendance.status == models.AttendanceStatus.PRESENT,
        )
        .count()
    )
    absent_today = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.date == today,
            models.Attendance.status == models.AttendanceStatus.ABSENT,
        )
        .count()
    )

    # Recent activity (last 5 records)
    recent_activity = (
        db.query(models.Attendance).order_by(models.Attendance.id.desc()).limit(5).all()
    )

    return {
        "total_employees": total_employees,
        "total_present_today": present_today,
        "total_absent_today": absent_today,
        "recent_activity": recent_activity,
    }
