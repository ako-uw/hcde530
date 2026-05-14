# Mini Project 1 — Competency Claim

## C3 — Data Handling
I loaded the Seattle coffee license dataset from a CSV pulled via the Seattle Open Data API, normalized the zip codes from mixed formats to 5-digit, and parsed license_start_date from an integer format like 20180101 into a usable year field. I also identified that expiration_date was entirely blank across all 263 rows and treated it as a data coverage issue rather than random missingness.

## C5 — Data Analysis with pandas
I used pandas to answer four analytical questions: value_counts() on zip codes to find concentration, year-over-year counts to track licensing trends, groupby on zip and year together to find spatial-temporal clusters, and value_counts() on naics_description to identify the dominant business category. Each result was interpreted in terms of what it reveals about the Seattle coffee market, not just what the code produced.

## C6 — Data Visualization
I built four charts using Plotly Express: a bar chart for zip code distribution, a line chart for year-over-year trends, a density heatmap for zip-year clustering, and a horizontal bar chart for NAICS categories. Each chart has a title that states the finding rather than just describing the data, and labeled axes. Chart type was chosen based on the nature of the data.

## C7 — Critical Evaluation and Professional Judgment
I noted that the NAICS question may not yield much variety since filtering by "COFFEE" concentrates records into a few categories. I also flagged that this dataset captures licensing activity only and does not include closures, revenue, or neighborhood demand, which limits what conclusions can be drawn about market saturation.
