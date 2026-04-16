import csv
from pathlib import Path


INPUT_CSV = Path(__file__).with_name("week3_survey_messy.csv")
OUTPUT_CSV = Path(__file__).with_name("week3_survey_cleaned.csv")


NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
}


def load_csv_rows(path):
    """Read a CSV and return (fieldnames, rows)."""
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)
    return fieldnames, rows


def clean_numeric_text(value):
    """Return digits for numeric values or number-words; otherwise ''."""
    text = (value or "").strip()
    if not text:
        return ""
    if text.isdigit():
        return text
    word_number = NUMBER_WORDS.get(text.lower())
    if word_number is not None:
        return str(word_number)
    return ""


def clean_row(row):
    """Clean one survey response row."""
    cleaned = {}

    # Strip whitespace from every field first
    for key, value in row.items():
        cleaned[key] = (value or "").strip()

    # Normalize key text columns so casing is consistent
    cleaned["participant_name"] = cleaned.get("participant_name", "").title()
    cleaned["role"] = cleaned.get("role", "").title()
    cleaned["department"] = cleaned.get("department", "").title()
    cleaned["primary_tool"] = cleaned.get("primary_tool", "").title()

    # Normalize numeric columns (turn "fifteen" -> "15")
    cleaned["experience_years"] = clean_numeric_text(cleaned.get("experience_years", ""))
    cleaned["satisfaction_score"] = clean_numeric_text(cleaned.get("satisfaction_score", ""))

    return cleaned


def clean_rows(rows):
    """Clean all rows and return a new list."""
    return [clean_row(r) for r in rows]


def write_csv(path, fieldnames, rows):
    """Write rows to a CSV file using the same header order."""
    with open(path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def count_by_column(rows, column_name):
    """Count occurrences of a column value (skips blanks)."""
    counts = {}
    for row in rows:
        value = (row.get(column_name) or "").strip()
        if not value:
            continue
        counts[value] = counts.get(value, 0) + 1
    return counts


def average_experience_years(rows):
    """Compute average experience from valid numeric rows only."""
    total = 0
    count = 0
    for row in rows:
        raw = (row.get("experience_years") or "").strip()
        if not raw:
            continue
        try:
            years = int(raw)
        except ValueError:
            continue
        total += years
        count += 1
    return (total / count) if count else None


def top_satisfaction_scores(rows, top_n=5):
    """Return (name, score) tuples for the highest satisfaction scores."""
    scored = []
    for row in rows:
        raw = (row.get("satisfaction_score") or "").strip()
        if not raw:
            continue
        try:
            score = int(raw)
        except ValueError:
            continue
        scored.append((row.get("participant_name", ""), score))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_n]


def print_counts(title, counts):
    print(title)
    for key, value in sorted(counts.items()):
        print(f"  {key}: {value}")


def main():
    # Load messy CSV data
    fieldnames, rows = load_csv_rows(INPUT_CSV)

    # Clean + normalize rows and save a cleaned copy to a new file
    cleaned_rows = clean_rows(rows)
    write_csv(OUTPUT_CSV, fieldnames, cleaned_rows)

    # Analyze the cleaned data
    print_counts("Responses by role:", count_by_column(cleaned_rows, "role"))

    avg = average_experience_years(cleaned_rows)
    if avg is None:
        print("\nAverage years of experience: N/A (no valid data)")
    else:
        print(f"\nAverage years of experience: {avg:.1f}")

    print("\nTop 5 satisfaction scores:")
    for name, score in top_satisfaction_scores(cleaned_rows, top_n=5):
        print(f"  {name}: {score}")

    print_counts("\nResponses by primary tool:", count_by_column(cleaned_rows, "primary_tool"))


if __name__ == "__main__":
    main()

