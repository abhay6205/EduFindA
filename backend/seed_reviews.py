"""
Seed script to load student review data from 6_reviews/ folder CSV files
into the database.

Each CSV has columns: School Name, Student Name, Ratings Out of 10, Reviews

Matches each review to their school by school_name.
Handles duplicate school names (e.g., "Nalanda Public School" in both
Harnaut and Nalanda) by mapping CSV file location prefix to DB location.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import csv
import os
import sys
import glob

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Review

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

# Map CSV filename prefix to DB location for duplicate resolution
FILE_LOCATION_MAP = {
    "Biharsharif": "Biharsharif",
    "Harnaut": "Harnaut",
    "Nalanda": "Nalanda",
    "Nawada": "Nawada",
    "Rajgir": "Rajgir",
}


def seed_reviews():
    """Clear existing reviews and seed with real student review data from CSVs."""
    db = SessionLocal()

    try:
        # 1. Clear existing review data
        print("[DELETE] Clearing existing review data...")
        deleted_count = db.query(Review).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} reviews")

        # 2. Build school lookup
        all_schools = db.query(School).all()
        school_lookup = {}
        for school in all_schools:
            name = school.school_name.strip()
            if name not in school_lookup:
                school_lookup[name] = []
            school_lookup[name].append(school)

        print(f"   Found {len(all_schools)} schools in database")

        # 3. Find all review CSV files
        reviews_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "6_reviews"
        )

        csv_files = glob.glob(os.path.join(reviews_dir, "*_Schools_Student_Reviews.csv"))
        if not csv_files:
            print(f"[ERROR] No review CSV files found in: {reviews_dir}")
            return

        print(f"   Found {len(csv_files)} review CSV files")

        added = 0
        skipped = 0
        schools_matched = set()

        for csv_path in sorted(csv_files):
            filename = os.path.basename(csv_path)
            # Extract location from filename (e.g., "Biharsharif" from "Biharsharif_Schools_Student_Reviews.csv")
            file_location = filename.split("_")[0]
            db_location = FILE_LOCATION_MAP.get(file_location, file_location)

            print(f"\n   Processing: {filename} (location: {db_location})")

            with open(csv_path, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                file_added = 0

                for row in reader:
                    school_name = row.get("School Name", "").strip()
                    student_name = row.get("Student Name", "").strip()
                    rating_str = row.get("Ratings Out of 10", "").strip()
                    review_text = row.get("Reviews", "").strip()

                    if not school_name or not student_name or not rating_str or not review_text:
                        continue

                    try:
                        rating = float(rating_str)
                    except ValueError:
                        skipped += 1
                        continue

                    # Find matching school
                    candidates = school_lookup.get(school_name, [])

                    if not candidates:
                        print(f"      [WARN] No school found for: '{school_name}'")
                        skipped += 1
                        continue

                    if len(candidates) == 1:
                        target_school = candidates[0]
                    else:
                        # Use file location to disambiguate
                        target_school = next(
                            (s for s in candidates if s.location == db_location),
                            candidates[0]
                        )

                    review = Review(
                        student_name=student_name,
                        school_id=target_school.id,
                        rating=rating,
                        review=review_text,
                        student_id=None,
                    )
                    db.add(review)
                    added += 1
                    file_added += 1
                    schools_matched.add(f"{target_school.school_name} ({target_school.location})")

                print(f"      Added: {file_added} reviews")

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {added} reviews!")
        if skipped:
            print(f"   Skipped: {skipped} reviews (no matching school or bad data)")
        print(f"   Schools with reviews: {len(schools_matched)}/{len(all_schools)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            count = db.query(Review).filter(Review.school_id == school.id).count()
            status = "[OK]" if count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {count} reviews")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_reviews()
