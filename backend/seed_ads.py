"""
Seed script to load advertisement data from 7_ad/ folder CSV files
into the database.

Each CSV has columns: school_name, ad_title, ad_description, start_date, end_date

Matches each ad to their school by school_name.
Handles duplicate school names (e.g., "Nalanda Public School" in both
Harnaut and Nalanda) by mapping CSV file location prefix to DB location.

Run this AFTER seed_schools.py has already populated the schools table.
"""

import csv
import os
import sys
import glob
from datetime import date

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Ad

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


def seed_ads():
    """Clear existing ads and seed with real advertisement data from CSVs."""
    db = SessionLocal()

    try:
        # 1. Clear existing ad data
        print("[DELETE] Clearing existing ad data...")
        deleted_count = db.query(Ad).delete()
        db.commit()
        print(f"   Deleted: {deleted_count} ads")

        # 2. Build school lookup
        all_schools = db.query(School).all()
        school_lookup = {}
        for school in all_schools:
            name = school.school_name.strip()
            if name not in school_lookup:
                school_lookup[name] = []
            school_lookup[name].append(school)

        print(f"   Found {len(all_schools)} schools in database")

        # 3. Find all ad CSV files
        ads_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "7_ad"
        )

        csv_files = glob.glob(os.path.join(ads_dir, "*_Schools_Advertisements.csv"))
        if not csv_files:
            print(f"[ERROR] No ad CSV files found in: {ads_dir}")
            return

        print(f"   Found {len(csv_files)} ad CSV files")

        added = 0
        skipped = 0
        schools_matched = set()

        for csv_path in sorted(csv_files):
            filename = os.path.basename(csv_path)
            file_location = filename.split("_")[0]
            db_location = FILE_LOCATION_MAP.get(file_location, file_location)

            print(f"\n   Processing: {filename} (location: {db_location})")

            with open(csv_path, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                file_added = 0

                for row in reader:
                    school_name = row.get("school_name", "").strip()
                    ad_title = row.get("ad_title", "").strip()
                    ad_description = row.get("ad_description", "").strip()
                    start_date_str = row.get("start_date", "").strip()
                    end_date_str = row.get("end_date", "").strip()

                    if not school_name or not ad_title or not start_date_str or not end_date_str:
                        continue

                    # Parse dates (YYYY-MM-DD format)
                    try:
                        start_dt = date.fromisoformat(start_date_str)
                        end_dt = date.fromisoformat(end_date_str)
                    except ValueError:
                        print(f"      [WARN] Bad date format for '{school_name}': {start_date_str} / {end_date_str}")
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
                        target_school = next(
                            (s for s in candidates if s.location == db_location),
                            candidates[0]
                        )

                    ad = Ad(
                        title=ad_title,
                        description=ad_description if ad_description else None,
                        start_date=start_dt,
                        end_date=end_dt,
                        school_id=target_school.id,
                    )
                    db.add(ad)
                    added += 1
                    file_added += 1
                    schools_matched.add(f"{target_school.school_name} ({target_school.location})")

                print(f"      Added: {file_added} ads")

        db.commit()

        # 4. Print summary
        print(f"\n[INSERT] Successfully seeded {added} ads!")
        if skipped:
            print(f"   Skipped: {skipped} ads (no matching school or bad data)")
        print(f"   Schools with ads: {len(schools_matched)}/{len(all_schools)}")

        print("\nSummary by school:")
        print("-" * 60)
        for school in db.query(School).all():
            count = db.query(Ad).filter(Ad.school_id == school.id).count()
            status = "[OK]" if count > 0 else "[--]"
            print(f"   {status} {school.school_name} ({school.location}): {count} ads")
        print("-" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_ads()
