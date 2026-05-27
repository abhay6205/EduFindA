# 🎓 EduFind - School Discovery Platform

EduFind is a modern, full-stack school discovery platform built for Bihar, India. Explore schools, compare facilities, view teacher profiles, read reviews, and apply for admissions — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)

## ✨ Features

- **🏫 School Profiles** — Detailed school pages with info, facilities, teachers, reviews, gallery
- **🔍 Smart Search & Filter** — Search by name, location, board type with sidebar filters
- **👨‍🏫 Teacher Directory** — View faculty profiles with experience and subject details
- **⭐ Student Reviews** — Real student reviews with ratings
- **📋 Admission Forms** — In-app admission application with location/school picker
- **📄 PDF Brochure** — Auto-generated downloadable school brochures
- **🔐 Authentication** — JWT-based login for Students & School Admins
- **📊 Admin Dashboard** — School owners manage teachers, ads, and view analytics
- **📱 Fully Responsive** — Beautiful UI on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend** | FastAPI (Python), SQLAlchemy ORM, Pydantic v2 |
| **Database** | SQLite (dev) / PostgreSQL (production) |
| **Auth** | JWT (python-jose), bcrypt password hashing |
| **PDF** | jsPDF for brochure generation |

## 📁 Project Structure

```
EduFind/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── auth/         # JWT authentication
│   │   ├── database/     # DB connection & session
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   ├── seed_*.py         # Database seeding scripts
│   ├── main.py           # App entry point
│   └── requirements.txt  # Python dependencies
│
├── src/                  # Next.js frontend
│   ├── app/              # Pages & routes
│   ├── components/       # Reusable UI components
│   ├── services/         # API client & utilities
│   ├── types/            # TypeScript interfaces
│   └── public/           # Static assets
│
├── data/                 # CSV seed data
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/EduFind.git
cd EduFind
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and set SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_hex(32))")

# Seed the database
python seed_schools.py
python seed_teachers.py
python seed_facilities.py
python seed_extracurriculars.py
python seed_images.py
python seed_reviews.py
python seed_ads.py

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd src

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start dev server
npm run dev
```

### 4. Open in Browser

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🌐 Deployment (Render)

This project is designed to be deployed on **Render** with:
- **Backend**: Python Web Service
- **Frontend**: Node.js Web Service  
- **Database**: Render PostgreSQL

See the deployment guide in the project documentation for step-by-step instructions.

### Environment Variables

#### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key (64+ chars) |
| `CORS_ORIGINS` | Comma-separated allowed origins |

#### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for Bihar's education ecosystem.
