"""
Seed script to load teacher data from data/2_teachers.csv into the database.

Matches each teacher to their school by school_name.
Handles duplicate school names (e.g., "Nalanda Public School" in both
Harnaut and Nalanda) by matching against the location context from the
original source CSV files.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import csv
import os
import sys

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Teacher

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

# --- Duplicate school name resolution ---
# "Nalanda Public School" appears in BOTH Harnaut and Nalanda locations.
# We use the original source CSV files to determine which teachers belong
# to which location's version of the school.

# Schools from Harnaut source file
HARNAUT_SCHOOLS = {
    "S S Academy", "Nalanda Public School", "Holy Mission School",
    "Bihar Public School", "Oxford Public School", "Shivam Convent School",
}

# Schools from Nalanda source file (Nalanda Public School also appears here)
NALANDA_SCHOOLS = {
    "Sainik School Nalanda", "Nav Nalanda Mahavihara School",
    "Nalanda Heritage School", "Buddhist Mission School",
    "Nalanda Public School", "Oxford International School",
}

# Teachers belonging to Harnaut's "Nalanda Public School" (from Harnaut CSV)
HARNAUT_NPS_TEACHERS = {
    ("Kajal Kumari", "Mathematics", 7),
    ("Sanjay Verma", "Biology", 9),
    ("Preeti Sinha", "Science", 11),
    ("Pooja Sinha", "Mathematics", 13),
    ("Amit Kumar", "Biology", 11),
    ("Neha Kumari", "Social Science", 9),
    ("Shalini Mishra", "Chemistry", 1),
    ("Sneha Gupta", "Physics", 19),
    ("Rakesh Sinha", "Economics", 4),
    ("Abhishek Raj", "Social Science", 15),
}

# Teachers belonging to Nalanda's "Nalanda Public School" (from Nalanda CSV)
NALANDA_NPS_TEACHERS = {
    ("Deepak Kumar", "Economics", 2),
    ("Anjali Kumari", "Computer Science", 15),
    ("Pooja Sinha", "Chemistry", 25),
    ("Rohit Sharma", "Science", 18),
    ("Ankit Raj", "Physics", 25),
    ("Abhishek Raj", "Computer Science", 15),
    ("Ashutosh Kumar", "Physics", 13),
    ("Kajal Kumari", "Computer Science", 24),
    ("Rahul Kumar", "Biology", 5),
    ("Nidhi Sharma", "English", 2),
}


def seed_teachers():
    """Clear existing teachers and seed with real teacher data from CSV."""
    db = SessionLocal()

    try:
        # 1. Clear existing teacher data
        print("[DELETE] Clearing existing teacher data...")
        deleted_count = db.query(Teacher).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} teachers")

        # 2. Build a lookup of school_name -> school object(s)
        all_schools = db.query(School).all()
        school_lookup = {}
        for school in all_schools:
            name = school.school_name.strip()
            if name not in school_lookup:
                school_lookup[name] = []
            school_lookup[name].append(school)

        print(f"   Found {len(all_schools)} schools in database")

        # 3. Parse the consolidated CSV
        csv_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "data", "2_teachers.csv"
        )

        if not os.path.exists(csv_path):
            print(f"[ERROR] CSV file not found: {csv_path}")
            return

        teachers_added = 0
        teachers_skipped = 0
        schools_matched = set()

        with open(csv_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                school_name = row.get("school_name", "").strip()
                teacher_name = row.get("teacher_name", "").strip()
                subject = row.get("subject", "").strip()
                experience = int(row.get("experience_years", "0").strip())
                class_range = row.get("class_range", "").strip()

                if not school_name or not teacher_name:
                    continue

                # Find matching school
                candidates = school_lookup.get(school_name, [])

                if not candidates:
                    print(f"   [WARN] No school found for: '{school_name}' — skipping teacher {teacher_name}")
                    teachers_skipped += 1
                    continue

                if len(candidates) == 1:
                    target_school = candidates[0]
                else:
                    # Handle duplicate school names (e.g., Nalanda Public School)
                    teacher_key = (teacher_name, subject, experience)

                    if school_name == "Nalanda Public School":
                        if teacher_key in HARNAUT_NPS_TEACHERS:
                            # Find the Harnaut version
                            target_school = next(
                                (s for s in candidates if s.location == "Harnaut"), candidates[0]
                            )
                        elif teacher_key in NALANDA_NPS_TEACHERS:
                            # Find the Nalanda version
                            target_school = next(
                                (s for s in candidates if s.location == "Nalanda"), candidates[0]
                            )
                        else:
                            target_school = candidates[0]
                    else:
                        target_school = candidates[0]

                teacher = Teacher(
                    teacher_name=teacher_name,
                    subject=subject,
                    experience=experience,
                    class_range=class_range,
                    school_id=target_school.id,
                )
                db.add(teacher)
                teachers_added += 1
                schools_matched.add(target_school.school_name)

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {teachers_added} teachers!")
        if teachers_skipped:
            print(f"   Skipped: {teachers_skipped} teachers (no matching school)")
        print(f"   Schools with teachers: {len(schools_matched)}/{len(all_schools)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            teacher_count = db.query(Teacher).filter(Teacher.school_id == school.id).count()
            status = "[OK]" if teacher_count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {teacher_count} teachers")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_teachers()
