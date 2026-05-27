"""
Seed script to clear mock/demo school data and load real school data
from the CSV files in the details/ folder into the SQLite database.

Only handles 1_schools.csv data. Other CSVs (teachers, facilities, etc.)
will be handled separately later.
"""

import csv
import os
import sys

# Add parent directory to path so we can import the app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database.connection import SessionLocal, engine, Base
from app.models.all_models import School, Teacher, Image, Ad, Review, User

# Ensure all tables exist (creates them if DB is fresh)
Base.metadata.create_all(bind=engine)

# Location mapping: normalize CSV location values to match frontend filter values
LOCATION_MAP = {
    "bihar sharif": "Biharsharif",
    "biharsharif": "Biharsharif",
    "harnaut": "Harnaut",
    "nalanda": "Nalanda",
    "nawada": "Nawada",
    "rajgir": "Rajgir",
}


def normalize_location(raw_location: str) -> str:
    """Normalize location string to match frontend filter values."""
    # The CSV 'Location' field may have sub-location info like "Khandakpar, Bihar Sharif"
    # We need to extract the city part
    parts = [p.strip() for p in raw_location.split(",")]

    # Try each part against the map (last part first, since city is often last)
    for part in reversed(parts):
        key = part.strip().lower()
        if key in LOCATION_MAP:
            return LOCATION_MAP[key]

    # Fallback: try the first part
    key = parts[0].strip().lower()
    if key in LOCATION_MAP:
        return LOCATION_MAP[key]

    # If nothing matches, return as-is
    return raw_location.strip()


def parse_year(value: str):
    """Parse formation year, returning None for non-numeric values."""
    if not value or value.strip().lower() in ("not publicly available", ""):
        return None
    try:
        return int(value.strip())
    except ValueError:
        return None


def clean_field(value: str):
    """Clean a field value, returning None for 'Not Publicly Available'."""
    if not value or value.strip().lower() == "not publicly available":
        return None
    return value.strip()


def parse_csv_file(filepath: str) -> list[dict]:
    """Parse a details CSV file and return a list of school dictionaries."""
    schools = []
    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get("School Name", "").strip()
            if not name:
                continue

            location_raw = row.get("Location", "").strip()
            location = normalize_location(location_raw)

            # Determine board_type - normalize common variations
            board_raw = clean_field(row.get("Board", "")) or "CBSE"
            board_type = board_raw
            if board_raw.lower() in ("state board", "state"):
                board_type = "State Board"
            elif board_raw.lower() in ("private", "private/state", "state/private"):
                board_type = board_raw  # Keep as-is for these edge cases

            school = {
                "school_name": name,
                "location": location,
                "full_address": clean_field(row.get("Full Address", "")),
                "board_type": board_type,
                "formation_year": parse_year(row.get("Formation Year", "")),
                "class_range": clean_field(row.get("Class Range", "")) or "Nursery–XII",
                "principal_name": clean_field(row.get("Principal Name", "")),
                "director_name": clean_field(row.get("Director Name", "")),
                "description": clean_field(row.get("Description", "")),
                "phone": clean_field(row.get("Phone No", "")),
                "email": clean_field(row.get("Email", "")),
                "website": clean_field(row.get("School Website", "")),
            }
            schools.append(school)

    return schools


def seed_database():
    """Clear all existing school data and seed with real school data."""
    db = SessionLocal()

    try:
        # 1. Clear all existing data (cascade will handle related records)
        print("[DELETE] Clearing existing data...")
        deleted_reviews = db.query(Review).delete()
        deleted_ads = db.query(Ad).delete()
        deleted_images = db.query(Image).delete()
        deleted_teachers = db.query(Teacher).delete()
        deleted_schools = db.query(School).delete()
        db.commit()

        print(f"   Deleted: {deleted_schools} schools, {deleted_teachers} teachers, "
              f"{deleted_images} images, {deleted_ads} ads, {deleted_reviews} reviews")

        # 2. Parse all detail CSV files
        details_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "details")
        csv_files = [
            "Biharsharif_Schools_Updated.csv",
            "Harnaut_803110_Schools.csv",
            "Nalanda_803111_Schools.csv",
            "Nawada_805110_Schools.csv",
            "Rajgir_803116_Schools.csv",
        ]

        all_schools = []
        for csv_file in csv_files:
            filepath = os.path.join(details_dir, csv_file)
            if not os.path.exists(filepath):
                print(f"   [WARN] File not found: {csv_file}, skipping...")
                continue

            schools = parse_csv_file(filepath)
            all_schools.extend(schools)
            print(f"   [OK] Parsed {len(schools)} schools from {csv_file}")

        # 3. Insert all schools into the database
        print(f"\n[INSERT] Inserting {len(all_schools)} real schools into database...")
        for school_data in all_schools:
            school = School(**school_data)
            db.add(school)

        db.commit()
        print(f"[DONE] Successfully seeded {len(all_schools)} schools!\n")

        # 4. Print summary by location
        print("Summary by location:")
        print("-" * 40)
        location_counts = {}
        for s in all_schools:
            loc = s["location"]
            location_counts[loc] = location_counts.get(loc, 0) + 1

        for loc, count in sorted(location_counts.items()):
            print(f"   {loc}: {count} schools")
        print("-" * 40)
        print(f"   Total: {len(all_schools)} schools")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
