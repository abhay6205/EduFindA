from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.all_models import Teacher, User, School
from app.schemas.all_schemas import TeacherCreate, TeacherResponse
from app.auth.jwt import get_current_user

router = APIRouter()

@router.post("/add", response_model=TeacherResponse)
def add_teacher(teacher: TeacherCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "school":
        raise HTTPException(status_code=403, detail="Not authorized")
    school = db.query(School).filter(School.owner_id == current_user.id).first()
    if not school or school.id != teacher.school_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    new_teacher = Teacher(**teacher.dict())
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher

@router.get("/{school_id}", response_model=List[TeacherResponse])
def get_teachers(school_id: int, db: Session = Depends(get_db)):
    return db.query(Teacher).filter(Teacher.school_id == school_id).all()
