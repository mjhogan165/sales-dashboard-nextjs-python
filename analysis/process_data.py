import json
from pathlib import Path
import pandas as pd

# Make paths work no matter where you run the script from, as long as the relative structure is maintained.Does not work in Jupyter
BASE_DIR = Path(__file__).resolve().parent #Get the exact, absolute folder where this script lives.
DATA_FILE = BASE_DIR / "data" / "AusApparalSales4thQrt2020.csv"
OUTPUT_FILE = BASE_DIR / "output" / "results.json"

df = pd.read_csv(DATA_FILE)

# Basic cleanup? non needed
print("\n-Check Values:-")
print("Duplicates:", df.duplicated().sum())
print("Missing values:")
print(df.isna().sum())

print("\nSales Statistics")
print(df["Sales"].describe())
print("\nMode:")
print(df["Sales"].mode())

#Readable names
state_map = {
    "VIC": "Victoria",
    "NSW": "New South Wales",
    "SA": "South Australia",
    "QLD": "Queensland",
    "TAS": "Tasmania",
    "NT": "Northern Territory",
    "WA": "Western Australia"
}


df["State"] = df["State"].str.strip().map(state_map).fillna(df["State"])
df["Date"] = pd.to_datetime(df["Date"])
df["Group"] = df["Group"].str.strip()

# print("path: ",Path(__file__))
# print("resolve: ",Path(__file__).resolve())
print("Columns:")
print(df.columns.tolist())
# print("\nFirst 5 rows:")
# print(df.head())
# print("Rows with missing values:")
# print(df[df.isna().any(axis=1)])# show rows with any missing values
print("\nInfo:")
print(df.info())




#Normalize sales
df["Sales_Normalized"] = (
    df["Sales"] - df["Sales"].min()
) / (
    df["Sales"].max() - df["Sales"].min()
)
print("\nSales Normalized:")
print(df[["Sales", "Sales_Normalized"]].head())

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

#print(f"\nSaved results to: {OUTPUT_FILE}")
