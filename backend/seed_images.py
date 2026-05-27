"""
Seed script to assign gallery images to all schools in the database.

Uses 6 pre-generated school images stored in src/public/school-images/.
Each school gets all 6 images with different image_types:
  - campus, classroom, science-lab, playground, library, computer-lab

The image_url is set to the Next.js public path (e.g., /school-images/campus.png)
which is served automatically by Next.js from the public/ directory.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import os
import sys

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Image

# Ensure all tables exist
Base.metadata.create_all(bind=engine)

# Image definitions: (filename, image_type)
GALLERY_IMAGES = [
    ("campus.png", "campus"),
    ("classroom.png", "classroom"),
    ("science-lab.png", "lab"),
    ("playground.png", "playground"),
    ("library.png", "library"),
    ("computer-lab.png", "computer_lab"),
]


def seed_images():
    """Clear existing images and seed with gallery images for all schools."""
    db = SessionLocal()

    try:
        # 1. Clear existing image data
        print("[DELETE] Clearing existing image data...")
        deleted_count = db.query(Image).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} images")

        # 2. Get all schools
        all_schools = db.query(School).all()
        print(f"   Found {len(all_schools)} schools in database")

        # 3. Assign images to each school
        added = 0

        for school in all_schools:
            for filename, image_type in GALLERY_IMAGES:
                image = Image(
                    image_url=f"/school-images/{filename}",
                    image_type=image_type,
                    school_id=school.id,
                )
                db.add(image)
                added += 1

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {added} images!")
        print(f"   Images per school: {len(GALLERY_IMAGES)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            count = db.query(Image).filter(Image.school_id == school.id).count()
            status = "[OK]" if count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {count} images")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_images()
