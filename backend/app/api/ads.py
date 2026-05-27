from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.all_models import Ad, User, School
from app.schemas.all_schemas import AdCreate, AdResponse
from app.auth.jwt import get_current_user

router = APIRouter()

@router.post("/create", response_model=AdResponse)
def create_ad(ad: AdCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "school":
        raise HTTPException(status_code=403, detail="Not authorized")
    school = db.query(School).filter(School.owner_id == current_user.id).first()
    if not school or school.id != ad.school_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    new_ad = Ad(**ad.dict())
    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)
    return new_ad

@router.get("/", response_model=List[AdResponse])
def get_ads(db: Session = Depends(get_db)):
    return db.query(Ad).all()
