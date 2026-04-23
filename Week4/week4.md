# Week 4 — Competency Claim

## C4 — API Use

For this assignment I called the City of Seattle Open Data API to pull business license data for coffee-related businesses. The endpoint returns JSON from a large dataset; I used a `$where` clause so `trade_name` only includes rows with **"COFFEE"** in the name, set `$limit=1000`, and selected the fields I needed. The script wrote **263** rows to `seattle_coffee_licenses.csv` (trade name, city, zip, license start, NAICS description, and an `expiration_date` column where the API does not supply a value in this dataset).

## HCD Reflection

This data is a rough map of where coffee-related businesses show up in Seattle: which areas have more activity, and what variety of business types the NAICS labels describe. As a UX researcher, public structured data like this helps me understand the context people work and spend time in when designing for local or neighborhood experiences. The `naics_description` field was especially interesting: “coffee” in the name does not map to a single type — it can mean snack bars, full restaurants, mobile food, and more — which reflects how different the actual user experience can be from one place to the next.
