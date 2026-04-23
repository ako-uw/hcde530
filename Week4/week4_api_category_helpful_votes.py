import csv
import json
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

BASE_URL = "https://hcde530-week4-api.onrender.com/reviews"
OUTPUT_CSV = Path(__file__).with_name("week4_category_helpful_votes.csv")
PAGE_LIMIT = 100


def fetch_all_reviews():
    """Fetch all review records from the paginated API."""
    offset = 0
    all_reviews = []

    while True:
        params = {"offset": offset, "limit": PAGE_LIMIT}
        url = f"{BASE_URL}?{urlencode(params)}"
        try:
            with urlopen(url, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as err:
            raise RuntimeError(f"HTTP error {err.code} when calling API: {err.reason}") from err
        except URLError as err:
            raise RuntimeError(f"Network error when calling API: {err.reason}") from err

        reviews = payload.get("reviews", [])
        returned = payload.get("returned", len(reviews))
        total = payload.get("total", 0)

        all_reviews.extend(reviews)

        if offset + returned >= total or returned == 0:
            break

        offset += returned

    return all_reviews


def main():
    reviews = fetch_all_reviews()

    rows = []
    for review in reviews:
        category = review.get("category", "N/A")
        helpful_votes = review.get("helpful_votes", 0)
        print(f"Category: {category} | Helpful votes: {helpful_votes}")
        rows.append(
            {
                "category": category,
                "helpful_votes": helpful_votes,
            }
        )

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["category", "helpful_votes"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nSaved {len(rows)} rows to {OUTPUT_CSV.name}")


if __name__ == "__main__":
    main()
