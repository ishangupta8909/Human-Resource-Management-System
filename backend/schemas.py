from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List, Optional
from models import AttendanceStatus


# Attendance Schemas
class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus


class AttendanceCreate(AttendanceBase):
    pass


class Attendance(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True


# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str = Field(..., description="Unique Employee ID")
    full_name: str
    email: EmailStr
    department: str


class EmployeeCreate(EmployeeBase):
    pass


class Employee(EmployeeBase):
    id: int
    attendance_records: List[Attendance] = []

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    total_employees: int
    total_present_today: int
    total_absent_today: int
