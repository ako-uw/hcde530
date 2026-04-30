"""
Pandas first-look analysis for Seattle coffee business licenses (Week 5).

Data file: seattle_coffee_licenses.csv (copy of Week4 export).

Notebook version (same steps, merge-demo style): week5_seattle_coffee_licenses_analysis.ipynb
Run from the Week5 folder:  python week5_seattle_coffee_licenses_analysis.py
"""

from pathlib import Path

import pandas as pd

CSV_PATH = Path(__file__).resolve().parent / "seattle_coffee_licenses.csv"


def main() -> None:
    df = pd.read_csv(CSV_PATH)

    # --- 1. What does your dataset look like? head() ---
    print("=" * 72)
    print("1. What does your dataset look like? — df.head()")
    print("=" * 72)
    print(df.head())
    print()

    # --- 2. info() + distribution of the most important column ---
    print("=" * 72)
    print("2. df.info() — dtypes, row count, non-null counts")
    print("=" * 72)
    df.info()
    print()

    # NAICS category describes what kind of licensed business each row is;
    # it is the main analytical dimension besides location.
    important_col = "naics_description"
    print(
        f"Distribution of `{important_col}` (most important categorical column):"
    )
    print(df[important_col].value_counts(dropna=False))
    print()

    # --- 3. Filter to a meaningful subset ---
    print("=" * 72)
    print("3. Meaningful subset — businesses in SEATTLE only (city == 'SEATTLE')")
    print("=" * 72)
    seattle_only = df[df["city"].str.upper() == "SEATTLE"].copy()
    print(f"Rows in subset: {len(seattle_only)} (of {len(df)} total)")
    print(seattle_only.head(10))
    print()

    # --- 4. Group by category, average of a numeric column ---
    print("=" * 72)
    print(
        "4. Group by NAICS category — average license start YEAR "
        "(parsed from license_start_date)"
    )
    print("=" * 72)
    start_year = pd.to_datetime(
        df["license_start_date"].astype(str), format="%Y%m%d", errors="coerce"
    ).dt.year
    by_naics = (
        df.assign(license_start_year=start_year)
        .groupby("naics_description", dropna=False)["license_start_year"]
        .mean()
        .round(1)
        .sort_values(ascending=False)
    )
    print(by_naics)
    print()

    # --- 5. Missing values ---
    print("=" * 72)
    print("5. Where are the missing values? — df.isnull().sum()")
    print("=" * 72)
    missing = df.isnull().sum()
    print(missing)
    print()
    cols_with_missing = missing[missing > 0]
    if cols_with_missing.empty:
        print("No columns have missing values in this snapshot.")
    else:
        print("Columns with at least one missing value:")
        print(cols_with_missing.to_string())


if __name__ == "__main__":
    main()
