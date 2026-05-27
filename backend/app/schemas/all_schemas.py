from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class LoginData(BaseModel):
    email: EmailStr
    password: str

class ImageBase(BaseModel):
    image_url: str
    image_type: str

class ImageCreate(ImageBase):
    pass

class ImageResponse(ImageBase):
    id: int
    school_id: int
    class Config:
        from_attributes = True

class TeacherBase(BaseModel):
    teacher_name: str
    subject: str
    experience: int
    class_range: str

class TeacherCreate(TeacherBase):
    school_id: int

class TeacherResponse(TeacherBase):
    id: int
    school_id: int
    class Config:
        from_attributes = True

class AdBase(BaseModel):
    title: str
    description: str
    start_date: date
    end_date: date

class AdCreate(AdBase):
    school_id: int

class AdResponse(AdBase):
    id: int
    school_id: int
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: float
    review: str

class ReviewCreate(ReviewBase):
    school_id: int

class ReviewResponse(ReviewBase):
    id: int
    student_id: Optional[int] = None
    student_name: Optional[str] = None
    school_id: int
    class Config:
        from_attributes = True

class FacilityBase(BaseModel):
    facility_name: str
    facility_description: Optional[str] = None

class FacilityCreate(FacilityBase):
    school_id: int

class FacilityResponse(FacilityBase):
    id: int
    school_id: int
    class Config:
        from_attributes = True

class ExtracurricularBase(BaseModel):
    activity_type: str
    activity_name: str

class ExtracurricularCreate(ExtracurricularBase):
    school_id: int

class ExtracurricularResponse(ExtracurricularBase):
    id: int
    school_id: int
    class Config:
        from_attributes = True

class SchoolBase(BaseModel):
    school_name: str
    location: str
    full_address: Optional[str] = None
    board_type: str
    formation_year: Optional[int] = None
    class_range: str
    principal_name: Optional[str] = None
    director_name: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class SchoolCreate(SchoolBase):
    reg_email: EmailStr
    reg_phone: str
    password: str

class SchoolResponse(SchoolBase):
    id: int
    owner_id: Optional[int] = None
    images: List[ImageResponse] = []
    teachers: List[TeacherResponse] = []
    facilities: List[FacilityResponse] = []
    extracurriculars: List[ExtracurricularResponse] = []
    class Config:
        from_attributes = True

class SchoolDetailResponse(SchoolResponse):
    ads: List[AdResponse] = []
    reviews: List[ReviewResponse] = []
