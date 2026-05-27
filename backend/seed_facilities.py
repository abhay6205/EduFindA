"""
Seed script to load facility data from data/3_facilities.csv into the database.

Matches each facility to their school by school_name.
Handles duplicate school names (e.g., "Nalanda Public School" in both
Harnaut and Nalanda) by matching against the facility sets from the
original source CSV files.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import csv
import os
import sys

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Facility

# Ensure all tables exist (creates the new facilities table if needed)
Base.metadata.create_all(bind=engine)

# --- Duplicate school name resolution ---
# "Nalanda Public School" appears in BOTH Harnaut and Nalanda locations.
# We use the facility sets from original source CSVs to disambiguate.

# Facilities for Harnaut's "Nalanda Public School" (from Harnaut CSV)
HARNAUT_NPS_FACILITIES = {
    "Music Room", "Library", "Computer Lab", "Auditorium",
    "Smart Classroom", "Sports Ground", "CCTV Security", "Language Lab",
}

# Facilities for Nalanda's "Nalanda Public School" (from Nalanda CSV)
NALANDA_NPS_FACILITIES = {
    "Biology Lab", "Art & Craft Room", "Chemistry Lab", "Science Lab",
    "Physics Lab", "Sports Ground", "Transport Facility", "Music Room",
}


def seed_facilities():
    """Clear existing facilities and seed with real facility data from CSV."""
    db = SessionLocal()

    try:
        # 1. Clear existing facility data
        print("[DELETE] Clearing existing facility data...")
        deleted_count = db.query(Facility).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} facilities")

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
            "..", "data", "3_facilities.csv"
        )

        if not os.path.exists(csv_path):
            print(f"[ERROR] CSV file not found: {csv_path}")
            return

        facilities_added = 0
        facilities_skipped = 0
        schools_matched = set()

        # Track which facilities have been assigned to each NPS location
        # to handle the overlapping facility names (Sports Ground, Music Room)
        harnaut_nps_done = set()
        nalanda_nps_done = set()

        with open(csv_path, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                school_name = row.get("school_name", "").strip()
                facility_name = row.get("facility_name", "").strip()
                facility_description = row.get("facility_description", "").strip()

                if not school_name or not facility_name:
                    continue

                # Find matching school
                candidates = school_lookup.get(school_name, [])

                if not candidates:
                    print(f"   [WARN] No school found for: '{school_name}' -- skipping facility {facility_name}")
                    facilities_skipped += 1
                    continue

                if len(candidates) == 1:
                    target_school = candidates[0]
                else:
                    # Handle duplicate school names (Nalanda Public School)
                    if school_name == "Nalanda Public School":
                        # Check if this facility belongs to Harnaut or Nalanda
                        in_harnaut = facility_name in HARNAUT_NPS_FACILITIES
                        in_nalanda = facility_name in NALANDA_NPS_FACILITIES

                        if in_harnaut and not in_nalanda:
                            target_school = next(
                                (s for s in candidates if s.location == "Harnaut"), candidates[0]
                            )
                        elif in_nalanda and not in_harnaut:
                            target_school = next(
                                (s for s in candidates if s.location == "Nalanda"), candidates[0]
                            )
                        elif in_harnaut and in_nalanda:
                            # Facility name exists in both — use order tracking
                            if facility_name not in harnaut_nps_done:
                                target_school = next(
                                    (s for s in candidates if s.location == "Harnaut"), candidates[0]
                                )
                                harnaut_nps_done.add(facility_name)
                            else:
                                target_school = next(
                                    (s for s in candidates if s.location == "Nalanda"), candidates[0]
                                )
                                nalanda_nps_done.add(facility_name)
                        else:
                            target_school = candidates[0]
                    else:
                        target_school = candidates[0]

                facility = Facility(
                    facility_name=facility_name,
                    facility_description=facility_description if facility_description else None,
                    school_id=target_school.id,
                )
                db.add(facility)
                facilities_added += 1
                schools_matched.add(target_school.school_name)

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {facilities_added} facilities!")
        if facilities_skipped:
            print(f"   Skipped: {facilities_skipped} facilities (no matching school)")
        print(f"   Schools with facilities: {len(schools_matched)}/{len(all_schools)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            facility_count = db.query(Facility).filter(Facility.school_id == school.id).count()
            status = "[OK]" if facility_count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {facility_count} facilities")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_facilities()
