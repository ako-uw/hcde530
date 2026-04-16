# Week 2 — Competency 2: Code reading, literacy & documentation

This note is for **HCDE 530**: practice reading code, explaining what a block does in plain language, and connecting code to documentation (comments).

---

## 1. Which code I focused on

- **File:** `demo_word_count.py`

- **Lines / block:** Full script — CSV loading, word count function, and summary stats

---

## 2. What this block does

This script reads a CSV file that has survey responses in it and counts how many words each person wrote. It goes through every row, counts the words, and prints a clean summary showing who wrote the shortest, longest, and average response. It's basically a quick way to measure how much people said without reading everything manually.

---

## 3. How I read it (step by step)

1. First it loads the CSV file and saves every row as a list of responses

2. Then it defines a function that takes a response text and counts the words by splitting on spaces

3. Then it loops through every response, calls that function, and saves the count

4. At the end it prints a summary showing total responses, shortest, longest, and average word count

---

## 4. How the documentation helps (or what was missing)

- **Comments:** The inline comments were helpful, they made the code clear and easy to read. I also added my own comments to the script to explain the key sections.

---

## 6. Connection to UX / research practice

When you're analyzing open-ended survey responses, word count is actually a useful signal — a very short response might mean the question was unclear or the participant wasn't engaged, while a very long one might mean they had a lot to say or the question was too open. As a UX researcher this kind of quick analysis helps me decide which responses to prioritize reading deeply and whether the question itself needs to be revised.

---

## 7. What I'm still unsure about

- How would this scale if the CSV had hundreds of responses — would the script slow down?

---

## Competency Claim

**C2 — Code Reading:**

I read through the full `demo_word_count.py` script and broke down what each block does without relying on coding terms. I could follow the logic from loading the CSV, to counting words, to printing the summary and I added my own inline comments to make the key sections easier for anyone else to read. The part that took the most effort was explaining the loop in simple words, but once I walked through it step by step it clicked.
