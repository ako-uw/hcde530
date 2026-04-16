import csv
from pathlib import Path

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


def clean_numeric_text(value):
    """Convert numeric text like 'fifteen' to an integer string."""
    clean_value = (value or "").strip()
    if clean_value.isdigit():
        return clean_value
    number_from_word = NUMBER_WORDS.get(clean_value.lower())
    if number_from_word is not None:
        return str(number_from_word)
    return ""


def clean_rows(data_rows):
    """Clean and normalize all rows from the CSV data."""
    cleaned_rows = []
    for row in data_rows:
        cleaned_row = {}
        for key, value in row.items():
            cleaned_row[key] = (value or "").strip()

        cleaned_row["participant_name"] = cleaned_row["participant_name"].title()
        cleaned_row["role"] = cleaned_row["role"].title()
        cleaned_row["department"] = cleaned_row["department"].title()
        cleaned_row["primary_tool"] = cleaned_row["primary_tool"].title()
        cleaned_row["experience_years"] = clean_numeric_text(cleaned_row["experience_years"])
        cleaned_row["satisfaction_score"] = clean_numeric_text(cleaned_row["satisfaction_score"])
        cleaned_rows.append(cleaned_row)
    return cleaned_rows


def write_clean_csv(output_path, fieldnames, data_rows):
    """Write cleaned rows to a new CSV file."""
    with open(output_path, mode="w", newline="", encoding="utf-8") as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data_rows)


# Load and clean the survey data from a CSV file
input_filename = Path(__file__).with_name("week3_survey_messy.csv")
output_filename = Path(__file__).with_name("week3_survey_cleaned.csv")
rows = []

with open(input_filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames or []
    for row in reader:
        rows.append(row)

rows = clean_rows(rows)
write_clean_csv(output_filename, fieldnames, rows)

# a function to count the number of tools used by the participants
def count_tools(data_rows):
    """Count occurrences of each primary tool in the dataset."""
    tool_counts = {}
    for row in data_rows:
        tool = (row.get("primary_tool") or "").strip()
        if not tool:
            continue
        if tool in tool_counts:
            tool_counts[tool] += 1
        else:
            tool_counts[tool] = 1
    return tool_counts


# Count responses by role
# Normalize role names so "ux researcher" and "UX Researcher" are counted together
role_counts = {}

for row in rows:
    role = row["role"].strip().title()
    if role in role_counts:
        role_counts[role] += 1
    else:
        role_counts[role] = 1

print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

# Calculate the average years of experience
total_experience = 0
valid_experience_count = 0
for row in rows:
    experience_value = (row.get("experience_years") or "").strip()
    try:
        years = int(experience_value)
    except ValueError:
        # Skip invalid values like "fifteen"
        continue

    total_experience += years
    valid_experience_count += 1

if valid_experience_count > 0:
    avg_experience = total_experience / valid_experience_count
    print(f"\nAverage years of experience: {avg_experience:.1f}")
else:
    print("\nAverage years of experience: N/A (no valid data)")

# Find the top 5 highest satisfaction scores
scored_rows = []
for row in rows:
    if row["satisfaction_score"].strip():
        scored_rows.append((row["participant_name"], int(row["satisfaction_score"])))

scored_rows.sort(key=lambda x: x[1], reverse=True)
top5 = scored_rows[:5]

print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")
# count the number of tools used by the participants
tool_counts = count_tools(rows)
print("\nResponses by primary tool:")
for tool, count in sorted(tool_counts.items()):
    print(f"  {tool}: {count}")
