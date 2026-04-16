import csv


INPUT_FILE = "responses.csv"
OUTPUT_FILE = "responses_cleaned.csv"


def main() -> None:
    with open(INPUT_FILE, mode="r", newline="", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)

        if reader.fieldnames is None:
            raise ValueError("Input file has no header row.")

        with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as outfile:
            writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
            writer.writeheader()

            for row in reader:
                name = (row.get("name") or "").strip()
                if not name:
                    continue

                role = (row.get("role") or "").strip()
                row["role"] = role.upper()
                row["name"] = name
                writer.writerow(row)


if __name__ == "__main__":
    main()
