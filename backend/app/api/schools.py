from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database.connection import get_db
from app.models.all_models import School, User
from app.schemas.all_schemas import SchoolCreate, SchoolResponse, SchoolDetailResponse
from app.auth.jwt import get_current_user, get_password_hash

router = APIRouter()

@router.get("/", response_model=List[SchoolResponse])
def get_schools(skip: int = 0, limit: int = 100, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(School)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                School.school_name.ilike(search_term),
                School.location.ilike(search_term),
                School.board_type.ilike(search_term),
                School.principal_name.ilike(search_term),
            )
        )
    return query.offset(skip).limit(limit).all()

@router.get("/{id}", response_model=SchoolDetailResponse)
def get_school(id: int, db: Session = Depends(get_db)):
    school = db.query(School).filter(School.id == id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.post("/create", response_model=SchoolResponse)
def create_school(school: SchoolCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == school.reg_email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(name=school.principal_name or school.school_name, email=school.reg_email, password=get_password_hash(school.password), role="school")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    new_school = School(
        school_name=school.school_name, location=school.location, full_address=school.full_address,
        board_type=school.board_type, formation_year=school.formation_year, class_range=school.class_range,
        principal_name=school.principal_name, director_name=school.director_name, description=school.description,
        phone=school.phone, email=school.email, website=school.website, owner_id=new_user.id
    )
    db.add(new_school)
    db.commit()
    db.refresh(new_school)
    return new_school
