"use client";

import type { SalesData } from "@/Types/sales";
import {
  // BarChart,
  // Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: SalesData;
};

function formatCurrency(value: number) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  });
}

function formatNumber(value: number) {
  return value.toLocaleString("en-AU", {
    maximumFractionDigits: 2,
  });
}

function formatShortCurrency(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
  });
}

// function formatMonthLabel(date: string) {
//   return new Date(date).toLocaleDateString("en-AU", {
//     month: "short",
//     year: "numeric",
//   });
// }

// function formatNullableCurrency(value: number | null) {
//   return value !== null ? formatCurrency(value) : "N/A";
// }

// function formatNullableNumber(value: number | null) {
//   return value !== null ? formatNumber(value) : "N/A";
// }

function tooltipCurrency(value: unknown) {
  return typeof value === "number" ? formatCurrency(value) : "N/A";
}

export default function DashboardClient({ data }: Props) {
  const weeklyTrend = data.time_series.weekly.map((item) => ({
    ...item,
    shortDate: formatDateLabel(item.Date),
  }));

  // const monthlyTrend = data.time_series.monthly.map((item) => ({
  //   ...item,
  //   shortDate: formatMonthLabel(item.Date),
  // }));

  const topState = data.state_sales[0];
  const secondState = data.state_sales[1];
  const topStateLead =
    topState && secondState ? topState.Sales - secondState.Sales : 0;

  const topGroup = data.group_sales[0];
  const bottomGroup = data.group_sales[data.group_sales.length - 1];
  const groupGap =
    topGroup && bottomGroup ? topGroup.Sales - bottomGroup.Sales : 0;

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tight">
            Retail Sales Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Overview of total sales, customer groups, state performance, and
            weekly/monthly sales trends.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Sales</p>
            <p className="mt-2 text-3xl font-semibold">
              {formatCurrency(data.summary.total_sales)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Top State</p>
            <p className="mt-2 text-3xl font-semibold">
              {data.summary.top_state ?? "N/A"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Lead over next state: {formatCurrency(topStateLead)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Top Group</p>
            <p className="mt-2 text-3xl font-semibold">
              {data.summary.top_group ?? "N/A"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Group spread: {formatCurrency(groupGap)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Lowest Group</p>
            <p className="mt-2 text-3xl font-semibold">
              {data.summary.lowest_group ?? "N/A"}
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Weekly Sales Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="shortDate" />
                  <YAxis tickFormatter={formatShortCurrency} />
                  <Tooltip
                    formatter={(value) => tooltipCurrency(value)}
                    labelFormatter={(label) => `Week ending: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="Sales"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Quick Insights</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Best state</p>
                <p className="mt-1">
                  {topState?.State} leads with{" "}
                  {topState ? formatCurrency(topState.Sales) : "N/A"}.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Typical sale</p>
                <p className="mt-1">
                  Median sale value:{" "}
                  {formatCurrency(data.statistics.sales.median)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Typical unit count</p>
                <p className="mt-1">
                  Median units sold:{" "}
                  {formatNumber(data.statistics.units.median)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
