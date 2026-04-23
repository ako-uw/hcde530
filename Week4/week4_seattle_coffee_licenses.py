import csv
import json
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

# This is a public City of Seattle Open Data API endpoint.
# It returns business license records in JSON format.
BASE_URL = "https://data.seattle.gov/resource/wnbq-64tb.json"

# We save the output next to this script inside Week4.
OUTPUT_CSV = Path(__file__).with_name("seattle_coffee_licenses.csv")

# We ask for up to 1000 records to make sure we get at least 50 coffee businesses.
LIMIT = 1000

# These are the columns we care about for this assignment.
# - trade_name: the business name customers see.
# - city: city where the business is registered.
# - zip: postal code for location grouping.
# - license_start_date: when the license became active.
# - expiration_date: when the current license period ends.
# - naics_description: business activity category/industry label.
FIELDS = [
    "trade_name",
    "city",
    "zip",
    "license_start_date",
    "expiration_date",
    "naics_description",
]

# The API select list excludes expiration_date because this dataset
# does not provide that column in the endpoint schema.
API_FIELDS = [field for field in FIELDS if field != "expiration_date"]


def fetch_coffee_businesses():
    """Fetch coffee-related businesses from the Seattle dataset."""
    # We use SoQL query params:
    # - $select picks only required fields
    # - $where keeps rows whose trade_name contains COFFEE (case-insensitive)
    # - $limit controls how many records come back
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
            # This keeps the CSV columns in a clean, consistent order.
            # If expiration_date is missing from the source dataset, it is left blank.
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
