# Week 3 — Competency Claim

## C2 — Code Reading
This week I read through the script, identified the bugs, and worked on fixing them. I also added a new function to count the number of tools used by participants, and added more inline comments throughout the code so each key step is easier to follow and understand.

## C3 — Data Handling
The dataset `week3_survey_messy.csv` had a few real issues — like the value "fifteen" written as text instead of a number. I wrote a function that cleans the full dataset before analysis runs, using try/except to handle invalid values and a hardcoded dictionary to convert number words into integers.
