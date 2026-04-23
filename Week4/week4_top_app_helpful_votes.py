import csv
import json
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

BASE_URL = "https://hcde530-week4-api.onrender.com/reviews"
OUTPUT_CSV = Path(__file__).with_name("week4_top_app_helpful_votes.csv")
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


def find_top_app_by_helpful_votes(reviews):
    """Return app with the highest total helpful votes."""
    app_totals = {}
    for review in reviews:
        app_name = review.get("app", "Unknown")
        helpful_votes = review.get("helpful_votes", 0)
        app_totals[app_name] = app_totals.get(app_name, 0) + helpful_votes

    top_app, total_helpful_votes = max(app_totals.items(), key=lambda item: item[1])
    return top_app, total_helpful_votes


def main():
    reviews = fetch_all_reviews()
    top_app, total_helpful_votes = find_top_app_by_helpful_votes(reviews)

    print(f"Top app: {top_app} | Total helpful votes: {total_helpful_votes}")

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["app", "total_helpful_votes"])
        writer.writeheader()
        writer.writerow(
            {
                "app": top_app,
                "total_helpful_votes": total_helpful_votes,
            }
        )

    print(f"Saved top app result to {OUTPUT_CSV.name}")


if __name__ == "__main__":
    main()
