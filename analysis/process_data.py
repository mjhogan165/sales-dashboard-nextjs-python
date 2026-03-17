import json
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "AusApparalSales4thQrt2020.csv"
OUTPUT_FILE = BASE_DIR / "output" / "results.json"

df = pd.read_csv(DATA_FILE)

# print("Columns:")
# print(df.columns.tolist())
print("\nFirst 5 rows:")
print(df.head())
# print("\n--- Data Inspection ---")
# print("Duplicates:", df.duplicated().sum())
# print("\nMissing values:")
# print(df.isna().sum())
# print("\nInfo:")
# print(df.info())

print("\n--- Sales Statistics ---")
print(df["Sales"].describe())

print("\nMode:")
print(df["Sales"].mode())

# Basic cleanup? non needed


state_map = {
    "VIC": "Victoria!",
    "NSW": "New South Wales!",
    "SA": "South Australia!",
    "QLD": "Queensland!",
    "TAS": "Tasmania!",
    "NT": "Northern Territory!",
    "WA": "Western Australia!"
}

df["State"] = df["State"].str.strip().map(state_map).fillna(df["State"])
df["Date"] = pd.to_datetime(df["Date"])
df["Group"] = df["Group"].str.strip()

sales_col = "Sales"
state_col = "State"
group_col = "Group"

state_sales = (
    df.groupby(state_col)[sales_col]
    .sum()
    .sort_values(ascending=False)
    .reset_index()
    .to_dict(orient="records")
)

group_sales = (
    df.groupby(group_col)[sales_col]
    .sum()
    .sort_values(ascending=False)
    .reset_index()
    .to_dict(orient="records")
)

results = {
    "summary": {
        "total_sales": float(df[sales_col].sum()),
        "top_state": state_sales[0][state_col] if state_sales else None,
        "top_group": group_sales[0][group_col] if group_sales else None,
    },
    "state_sales": state_sales,
    "group_sales": group_sales,
}

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"\nSaved results to: {OUTPUT_FILE}")
