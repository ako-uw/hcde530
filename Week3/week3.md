# Week 3 — Competency Claim

## C3 — Data Handling

This week I worked with a messy dataset and identified two real bugs — one that crashed the script and one that ran silently but returned wrong results.

**Bug 1 — ValueError:**
The `experience_years` column had the value "fifteen" written as text instead of a number. When the script tried to run `int("fifteen")` it threw a `ValueError` and crashed. I fixed this by adding a hardcoded dictionary that converts number words to integers before any analysis runs.

**Bug 2 — Sort bug (silent wrong output):**
The top 5 satisfaction scores were being sorted without `reverse=True`, which meant the script was returning the five *lowest* scores instead of the five *highest*. The script didn't crash — it just returned wrong results. Adding `reverse=True` to the sort fixed this. This was the harder bug to catch because nothing broke visibly.

The difference between code that runs and code that's correct was the main thing this week revealed — a script can finish without errors and still give you wrong data.
