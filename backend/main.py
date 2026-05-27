import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.api import auth_router, schools_router, teachers_router, ads_router, reviews_router
import os

# Load .env file if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduFind API")

# CORS: Read allowed origins from env var, default to "*" for local dev
cors_origins_str = os.environ.get("CORS_ORIGINS", "*")
if cors_origins_str == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(schools_router, prefix="/api/schools", tags=["schools"])
app.include_router(teachers_router, prefix="/api/teachers", tags=["teachers"])
app.include_router(ads_router, prefix="/api/ads", tags=["ads"])
app.include_router(reviews_router, prefix="/api/reviews", tags=["reviews"])

@app.get("/")
def read_root():
    return {"message": "Welcome to EduFind API"}
