from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
import logging

logger = logging.getLogger("hrms_lite")

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Check for duplicate employee_id
    db_employee_id = (
        db.query(models.Employee)
        .filter(models.Employee.employee_id == employee.employee_id)
        .first()
    )
    if db_employee_id:
        raise HTTPException(status_code=409, detail="Employee ID already registered")

    # Check for duplicate email
    db_email = (
        db.query(models.Employee)
        .filter(models.Employee.email == employee.email)
        .first()
    )
    if db_email:
        raise HTTPException(status_code=409, detail="Email already registered")

    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


from sqlalchemy import func


@router.get("/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()

    # Add present_count to each employee
    for emp in employees:
        emp.present_count = (
            db.query(models.Attendance)
            .filter(
                models.Attendance.employee_id == emp.id,
                models.Attendance.status == models.AttendanceStatus.PRESENT,
            )
            .count()
        )

    return employees


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db_employee = (
        db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    )
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    # Perform delete inside explicit commit/rollback to avoid "transaction already begun" errors
    try:
        # delete attendance rows explicitly (relationship has cascade, but be explicit)
        db.query(models.Attendance).filter(
            models.Attendance.employee_id == employee_id
        ).delete(synchronize_session=False)
        db.delete(db_employee)
        db.commit()
    except Exception as exc:
        # rollback and log
        try:
            db.rollback()
        except Exception:
            pass
        logger.exception("Error deleting employee %s: %s", employee_id, exc)
        raise HTTPException(status_code=500, detail="Failed to delete employee")
    return None


@router.put("/{employee_id}", response_model=schemas.Employee)
def update_employee(
    employee_id: int, employee: schemas.EmployeeCreate, db: Session = Depends(get_db)
):
    db_employee = (
        db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    )
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check email duplicate (if changed)
    if employee.email != db_employee.email:
        db_email = (
            db.query(models.Employee)
            .filter(models.Employee.email == employee.email)
            .first()
        )
        if db_email:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Check employee_id duplicate (if changed)
    if employee.employee_id != db_employee.employee_id:
        db_eid = (
            db.query(models.Employee)
            .filter(models.Employee.employee_id == employee.employee_id)
            .first()
        )
        if db_eid:
            raise HTTPException(
                status_code=400, detail="Employee ID already registered"
            )

    for key, value in employee.model_dump().items():
        setattr(db_employee, key, value)

    db.commit()
    db.refresh(db_employee)
    return db_employee
