# 📊 Sales Dashboard (Next.js + Python)

A full-stack data dashboard that transforms raw CSV sales data into interactive visual insights.

---

## 🚀 Features

* 📁 CSV → cleaned and processed with Python (Pandas)
* 📈 Interactive charts using React + Recharts
* 🧠 Aggregated metrics (top states, groups, trends)
* ⏱ Time-based analysis (weekly, monthly, quarterly)
* 🎯 Clean UI built with Next.js + Tailwind

---

## 📸 Preview

![Dashboard Screenshot](../screenshots/dashboard.png)

---

## 🧠 Architecture

```plaintext
CSV Data
   ↓
Python (Pandas cleaning + aggregation)
   ↓
results.json
   ↓
Next.js Dashboard (Recharts UI)
```

---

## 🛠 Tech Stack

**Frontend**

* Next.js (App Router)
* React + TypeScript
* Tailwind CSS
* Recharts

**Backend / Data Processing**

* Python
* Pandas

---

## ⚙️ How It Works

1. Load raw CSV data
2. Clean and normalize values
3. Aggregate metrics (sales, units, trends)
4. Export to `results.json`
5. Frontend reads and visualizes data

---

## 📦 Running the Project

### Python (data processing)

```bash
cd analysis
python process_data.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Future Improvements

* API layer instead of static JSON
* Filtering (date range, region, product group)
* Dark mode
* Live data updates

---

## 💡 Why This Project?

This project demonstrates:

* Data cleaning & transformation
* Backend-to-frontend data flow
* Modern frontend dashboard design
* Real-world data visualization patterns
