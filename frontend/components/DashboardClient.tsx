"use client";

import type { SalesData } from "@/Types/sales";
import {
  BarChart,
  Bar,
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

function tooltipCurrency(value: unknown) {
  return typeof value === "number" ? formatCurrency(value) : "N/A";
}

export default function DashboardClient({ data }: Props) {
  const weeklyTrend = data.time_series.weekly.map((item) => ({
    ...item,
    shortDate: formatDateLabel(item.Date),
  }));

  const monthlyTrend = data.time_series.monthly.map((item) => ({
    ...item,
    shortDate: new Date(item.Date).toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
    }),
  }));

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

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Sales Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Mean</span>
                <span className="font-medium">
                  {formatCurrency(data.statistics.sales.mean)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Median</span>
                <span className="font-medium">
                  {formatCurrency(data.statistics.sales.median)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Mode</span>
                <span className="font-medium">
                  {data.statistics.sales.mode
                    ? formatCurrency(data.statistics.sales.mode)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Std Dev</span>
                <span className="font-medium">
                  {formatCurrency(data.statistics.sales.std_dev)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Unit Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Mean</span>
                <span className="font-medium">
                  {formatNumber(data.statistics.units.mean)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Median</span>
                <span className="font-medium">
                  {formatNumber(data.statistics.units.median)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Mode</span>
                <span className="font-medium">
                  {data.statistics.units.mode
                    ? formatNumber(data.statistics.units.mode)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Std Dev</span>
                <span className="font-medium">
                  {formatNumber(data.statistics.units.std_dev)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">State Sales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.state_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="State" />
                  <YAxis tickFormatter={formatShortCurrency} />
                  <Tooltip formatter={(value) => tooltipCurrency(value)} />
                  <Bar dataKey="Sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">State Sales Ranking</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 text-left font-medium text-slate-600">
                      Rank
                    </th>
                    <th className="pb-2 text-left font-medium text-slate-600">
                      State
                    </th>
                    <th className="pb-2 text-right font-medium text-slate-600">
                      Sales
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.state_sales.map((item, index) => (
                    <tr key={item.State} className="border-b border-slate-100">
                      <td className="py-2 font-medium">{index + 1}</td>
                      <td className="py-2">{item.State}</td>
                      <td className="py-2 text-right font-medium">
                        {formatCurrency(item.Sales)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Group Sales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.group_sales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Group" />
                  <YAxis
                    tickFormatter={formatShortCurrency}
                    ticks={[80000000, 90000000]}
                  />
                  <Tooltip formatter={(value) => tooltipCurrency(value)} />
                  <Bar dataKey="Sales" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Group Sales Ranking</h2>
            <div className="space-y-3">
              {data.group_sales.map((item, index) => (
                <div
                  key={item.Group}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{item.Group}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.Sales)}
                  </span>
                </div>
              ))}
            </div>
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Monthly Sales Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" />
                <YAxis tickFormatter={formatShortCurrency} />
                <Tooltip
                  formatter={(value) => tooltipCurrency(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="Sales"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  stroke="#f59e0b"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
