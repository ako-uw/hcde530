import csv
import json
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

# The City of Seattle publishes open business license data through this endpoint
# It returns a list of active business licenses in JSON format
# No API key required — it's fully public
BASE_URL = "https://data.seattle.gov/resource/wnbq-64tb.json"

# Save the CSV output in the same folder as this script
OUTPUT_CSV = Path(__file__).with_name("seattle_coffee_licenses.csv")

# Ask for 1000 records to make sure we get well over 50 coffee businesses
LIMIT = 1000

# These are the fields we're pulling from each record:
# - trade_name: the name the business operates under (what customers see)
# - city: city where the business is registered
# - zip: zip code — useful for seeing which neighborhoods have the most coffee shops
# - license_start_date: when the business first got licensed in Seattle
# - expiration_date: when the license expires — can be empty if still active
# - naics_description: industry category assigned by the government (e.g. "Snack and Nonalcoholic Beverage Bars")
FIELDS = [
    "trade_name",
    "city",
    "zip",
    "license_start_date",
    "expiration_date",
    "naics_description",
]

# expiration_date is included in the CSV but the API doesn't always return it
# so we only request the other fields from the API and leave expiration_date blank if missing
API_FIELDS = [field for field in FIELDS if field != "expiration_date"]


def fetch_coffee_businesses():
    """Fetch coffee-related businesses from the Seattle dataset."""
    # $select — only pull the fields we need instead of all 20+ columns in the dataset
    # $where — filter to only businesses with "COFFEE" in the name (case-insensitive)
    # $limit — cap the results at 1000 so we don't accidentally pull 80k+ records
    params = {
        "$select": ",".join(API_FIELDS),
        "$where": "upper(trade_name) like '%COFFEE%'",
        "$limit": str(LIMIT),
    }
    url = f"{BASE_URL}?{urlencode(params)}"

    try:
        with urlopen(url, timeout=30) as response:
            records = json.loads(response.read().decode("utf-8"))
    except HTTPError as err:
        raise RuntimeError(f"HTTP error {err.code} when calling API: {err.reason}") from err
    except URLError as err:
        raise RuntimeError(f"Network error when calling API: {err.reason}") from err

    return records


def write_csv(records):
    """Write filtered records into a CSV file."""
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=FIELDS)
        writer.writeheader()

        for row in records:
            # Make sure every row has all columns in the right order
            # if a field is missing from the API response, we leave it blank
            clean_row = {field: row.get(field, "") for field in FIELDS}
            writer.writerow(clean_row)


def print_summary(records):
    """Print total count and 5 sample rows for quick validation."""
    print(f"Total records saved: {len(records)}")
    print("\nSample rows (first 5):")

    for idx, row in enumerate(records[:5], start=1):
        print(
            f"{idx}. trade_name={row.get('trade_name', '')}, "
            f"city={row.get('city', '')}, "
            f"zip={row.get('zip', '')}, "
            f"license_start_date={row.get('license_start_date', '')}, "
            f"expiration_date={row.get('expiration_date', '')}, "
            f"naics_description={row.get('naics_description', '')}"
        )

    print(f"\nSaved CSV: {OUTPUT_CSV.name}")


def main():
    records = fetch_coffee_businesses()
    write_csv(records)
    print_summary(records)


if __name__ == "__main__":
    main()
