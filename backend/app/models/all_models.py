from sqlalchemy import Column, Integer, String, Date, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    school = relationship("School", back_populates="owner", uselist=False)

class School(Base):
    __tablename__ = "schools"
    id = Column(Integer, primary_key=True, index=True)
    school_name = Column(String, index=True)
    location = Column(String, index=True)
    full_address = Column(String, nullable=True)
    board_type = Column(String, index=True)
    formation_year = Column(Integer, nullable=True)
    class_range = Column(String)
    principal_name = Column(String, nullable=True)
    director_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", back_populates="school")
    teachers = relationship("Teacher", back_populates="school", cascade="all, delete-orphan")
    images = relationship("Image", back_populates="school", cascade="all, delete-orphan")
    ads = relationship("Ad", back_populates="school", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="school", cascade="all, delete-orphan")
    facilities = relationship("Facility", back_populates="school", cascade="all, delete-orphan")
    extracurriculars = relationship("Extracurricular", back_populates="school", cascade="all, delete-orphan")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    teacher_name = Column(String, index=True)
    subject = Column(String)
    experience = Column(Integer)
    class_range = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="teachers")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    image_type = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="images")

class Ad(Base):
    __tablename__ = "ads"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date)
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="ads")

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    facility_name = Column(String, index=True)
    facility_description = Column(Text, nullable=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="facilities")

class Extracurricular(Base):
    __tablename__ = "extracurriculars"
    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String, index=True)
    activity_name = Column(String)
    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="extracurriculars")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    student_name = Column(String, nullable=True)
    school_id = Column(Integer, ForeignKey("schools.id"))
    rating = Column(Float)
    review = Column(Text)
    school = relationship("School", back_populates="reviews")
    student = relationship("User")

