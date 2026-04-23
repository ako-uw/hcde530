# This script reads survey responses and counts how many words each person wrote
# helps spot if someone gave a very short answer which might mean the question wasn't clear

import csv


# loading the file into memory first so i can go through all the responses
# without opening and closing the file every time
filename = "demo_responses.csv"
responses = []

# read the csv file and append the rows to the responses list
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # saving each row as a dictionary so i can call values by column name
        # easier than trying to remember which position each value is in
        responses.append(row)

# a function to count the number of words in a response
def count_words(response):
    """Count the number of words in a response string.

    Takes a string, splits it on whitespace, and returns the word count.
    Used to measure response length across all participants.
    """
    return len(response.split())


# printing a header row so the output looks like a table and not just numbers
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)

word_counts = []

for row in responses:
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

   # counting words to see how much each person wrote 
   # very short responses might mean the question was unclear,
   # or the participant wasn't engaged enough to elaborate
    count = count_words(response)
    word_counts.append(count)

     # cutting the response to 60 chars just for display
     # the full text is still in the data, this is just so the table is readable
    if len(response) > 60:
        preview = response[:60] + "..."
    else:
        preview = response

    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

# summary at the end to see the overall picture 
# big difference between shortest and longest might mean people read the question differently
print()
print("── Summary ─────────────────────────────────")
print(f"  Total responses : {len(word_counts)}")
print(f"  Shortest        : {min(word_counts)} words")
print(f"  Longest         : {max(word_counts)} words")
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")
