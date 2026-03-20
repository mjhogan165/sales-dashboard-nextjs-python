import json
from pathlib import Path
import pandas as pd

# Constants
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "AusApparalSales4thQrt2020.csv"
OUTPUT_FILE = BASE_DIR / "output" / "results.json"


def load_data(file_path: Path) -> pd.DataFrame:
    """Load the CSV data into a pandas DataFrame."""
    return pd.read_csv(file_path)

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and preprocess the data."""
    df = df.copy()

    # Strip whitespace from column names first
    df.columns = df.columns.str.strip()

    # Check for missing values
    missing = df.isna().sum()
    if missing.any():
        print("\n⚠️ Missing values detected:")
        print(missing[missing > 0])
    else:
        print("\n✅ No missing values found")

    # Strip whitespace from all text columns
    text_cols = df.select_dtypes(include=["object", "string"]).columns
    for col in text_cols:
        df[col] = df[col].str.strip()

    # Map state abbreviations to full names
    state_map = {
        "VIC": "Victoria",
        "NSW": "New South Wales",
        "SA": "South Australia",
        "QLD": "Queensland",
        "TAS": "Tasmania",
        "NT": "Northern Territory",
        "WA": "Western Australia",
    }
    df["State"] = df["State"].replace(state_map)

    # Convert Date column to datetime
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")

    # Check whether date conversion introduced missing values
    if df["Date"].isna().any():
        print("\n⚠️ Invalid dates found after conversion:")
        print(df[df["Date"].isna()])

    # Set Date as index
    df = df.set_index("Date")

    # Normalize sales safely
    sales_min = df["Sales"].min()
    sales_max = df["Sales"].max()

    if sales_max == sales_min:
        df["Sales_Normalized"] = 0.0
    else:
        df["Sales_Normalized"] = (df["Sales"] - sales_min) / (sales_max - sales_min)

    return df

def build_results(df: pd.DataFrame) -> dict:
    """Build the results dictionary with summaries and aggregations."""
    sales_col = "Sales"
    state_col = "State"
    group_col = "Group"
    units_col = "Unit"

    # State sales aggregation
    state_sales = (
        df.groupby(state_col)[sales_col]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
        .to_dict(orient="records")
    )

    # Group sales aggregation
    group_sales_df = (
        df.groupby(group_col)[sales_col]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )

    highest_group = group_sales_df.iloc[0][group_col] if not group_sales_df.empty else None
    lowest_group = group_sales_df.iloc[-1][group_col] if not group_sales_df.empty else None

    group_sales = group_sales_df.to_dict(orient="records")

    # Time series aggregations
    weekly_sales = (
        df.resample("W")[sales_col]
        .sum()
        .reset_index()
    )
    weekly_sales["Date"] = weekly_sales["Date"].astype(str)
    weekly_sales = weekly_sales.to_dict(orient="records")

    monthly_sales = (
        df.resample("ME")[sales_col]
        .sum()
        .reset_index()
    )
    monthly_sales["Date"] = monthly_sales["Date"].astype(str)
    monthly_sales = monthly_sales.to_dict(orient="records")

    quarterly_sales = (
        df.resample("QE")[sales_col]
        .sum()
        .reset_index()
    )
    quarterly_sales["Date"] = quarterly_sales["Date"].astype(str)
    quarterly_sales = quarterly_sales.to_dict(orient="records")

    # Statistics
    stats = {
        "sales": {
            "mean": float(df[sales_col].mean()),
            "median": float(df[sales_col].median()),
            "mode": float(df[sales_col].mode()[0]) if not df[sales_col].mode().empty else None,
            "std_dev": float(df[sales_col].std()),
        },
        "units": {
            "mean": float(df[units_col].mean()),
            "median": float(df[units_col].median()),
            "mode": float(df[units_col].mode()[0]) if not df[units_col].mode().empty else None,
            "std_dev": float(df[units_col].std()),
        },
    }

    # Results dictionary
    results = {
        "summary": {
            "total_sales": float(df[sales_col].sum()),
            "top_state": state_sales[0][state_col] if state_sales else None,
            "top_group": highest_group,
            "lowest_group": lowest_group,
        },
        "statistics": stats,
        "state_sales": state_sales,
        "group_sales": group_sales,
        "time_series": {
            "weekly": weekly_sales,
            "monthly": monthly_sales,
            "quarterly": quarterly_sales,
        },
    }

    return results


def save_results(results: dict, output_file: Path) -> None:
    """Save the results to a JSON file."""
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)


def main() -> None:
    """Main function to run the data processing pipeline."""
    df = load_data(DATA_FILE)
    df = clean_data(df)
    results = build_results(df)
    save_results(results, OUTPUT_FILE)
    print(f"\n✅ Saved results to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
