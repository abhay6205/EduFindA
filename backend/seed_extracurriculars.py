"""
Seed script to load extracurricular activity data from data/4_extracurricular.csv
into the database.

Matches each activity to their school by school_name.
Handles duplicate school names (e.g., "Nalanda Public School" in both
Harnaut and Nalanda) by using activity sets from the original source CSVs.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import csv
import os
import sys

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Extracurricular

# Ensure all tables exist (creates the new extracurriculars table if needed)
Base.metadata.create_all(bind=engine)

# --- Duplicate school name resolution ---
# "Nalanda Public School" appears in BOTH Harnaut and Nalanda.
# Activities from Harnaut CSV
HARNAUT_NPS_ACTIVITIES = {
    ("club", "Photography Club"), ("club", "Debate Club"),
    ("club", "Art & Culture"), ("club", "Music & Band"),
    ("competitive_prep", "Spoken English Training"), ("competitive_prep", "NTSE Preparation"),
    ("competitive_prep", "Olympiad Foundation"), ("competitive_prep", "CUET Preparation"),
    ("sports_activity", "Athletics Training"), ("sports_activity", "Cricket Coaching"),
    ("sports_activity", "Football Training"), ("sports_activity", "Yoga Sessions"),
}

# Activities from Nalanda CSV
NALANDA_NPS_ACTIVITIES = {
    ("club", "NCC"), ("club", "Debate Club"),
    ("club", "Art & Culture"), ("club", "Music & Band"),
    ("competitive_prep", "CUET Preparation"), ("competitive_prep", "Olympiad Foundation"),
    ("competitive_prep", "Scholarship Exam Coaching"), ("competitive_prep", "Spoken English Training"),
    ("sports_activity", "Yoga Sessions"), ("sports_activity", "Athletics Training"),
    ("sports_activity", "Football Training"), ("sports_activity", "Basketball Academy"),
}


def seed_extracurriculars():
    """Clear existing extracurriculars and seed with real data from CSV."""
    db = SessionLocal()

    try:
        # 1. Clear existing data
        print("[DELETE] Clearing existing extracurricular data...")
        deleted_count = db.query(Extracurricular).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} extracurriculars")

        # 2. Build school lookup
        all_schools = db.query(School).all()
        school_lookup = {}
        for school in all_schools:
            name = school.school_name.strip()
            if name not in school_lookup:
                school_lookup[name] = []
            school_lookup[name].append(school)

        print(f"   Found {len(all_schools)} schools in database")

        # 3. Parse CSV
        csv_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "data", "4_extracurricular.csv"
        )

        if not os.path.exists(csv_path):
            print(f"[ERROR] CSV file not found: {csv_path}")
            return

        added = 0
        skipped = 0
        schools_matched = set()

        # Track assignments for duplicate NPS
        harnaut_nps_done = set()

        with open(csv_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                school_name = row.get("school_name", "").strip()
                activity_type = row.get("activity_type", "").strip()
                activity_name = row.get("activity_name", "").strip()

                if not school_name or not activity_type or not activity_name:
                    continue

                candidates = school_lookup.get(school_name, [])

                if not candidates:
                    print(f"   [WARN] No school found for: '{school_name}' -- skipping {activity_name}")
                    skipped += 1
                    continue

                if len(candidates) == 1:
                    target_school = candidates[0]
                else:
                    # Handle duplicate Nalanda Public School
                    if school_name == "Nalanda Public School":
                        key = (activity_type, activity_name)
                        in_harnaut = key in HARNAUT_NPS_ACTIVITIES
                        in_nalanda = key in NALANDA_NPS_ACTIVITIES

                        if in_harnaut and not in_nalanda:
                            target_school = next(
                                (s for s in candidates if s.location == "Harnaut"), candidates[0]
                            )
                        elif in_nalanda and not in_harnaut:
                            target_school = next(
                                (s for s in candidates if s.location == "Nalanda"), candidates[0]
                            )
                        elif in_harnaut and in_nalanda:
                            if key not in harnaut_nps_done:
                                target_school = next(
                                    (s for s in candidates if s.location == "Harnaut"), candidates[0]
                                )
                                harnaut_nps_done.add(key)
                            else:
                                target_school = next(
                                    (s for s in candidates if s.location == "Nalanda"), candidates[0]
                                )
                        else:
                            target_school = candidates[0]
                    else:
                        target_school = candidates[0]

                extra = Extracurricular(
                    activity_type=activity_type,
                    activity_name=activity_name,
                    school_id=target_school.id,
                )
                db.add(extra)
                added += 1
                schools_matched.add(target_school.school_name)

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {added} extracurricular activities!")
        if skipped:
            print(f"   Skipped: {skipped} activities (no matching school)")
        print(f"   Schools with activities: {len(schools_matched)}/{len(all_schools)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            count = db.query(Extracurricular).filter(Extracurricular.school_id == school.id).count()
            status = "[OK]" if count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {count} activities")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_extracurriculars()
