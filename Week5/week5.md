# Week 5 — Competency Claim

## C3 — Data Handling

This week I used pandas to analyze the Seattle coffee business license dataset from A4. I ran five operations on the data: head() and info() to understand the structure, value_counts() to see which business categories appear most, a filter to narrow down to Seattle city limits only, a groupby to find the average license start year per category, and isnull().sum() to check for missing values. The expiration_date column was entirely blank across all 263 rows, which I identified as a data coverage issue from the API rather than random missing data. Working through these operations showed me how to move from raw data to actual findings rather than just running code and hoping the output makes sense.
