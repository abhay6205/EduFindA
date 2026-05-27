from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.all_models import Review, User
from app.schemas.all_schemas import ReviewCreate, ReviewResponse
from app.auth.jwt import get_current_user

router = APIRouter()

@router.post("/add", response_model=ReviewResponse)
def add_review(review: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can add reviews")
    new_review = Review(**review.dict(), student_id=current_user.id)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/{school_id}", response_model=List[ReviewResponse])
def get_reviews(school_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.school_id == school_id).all()
