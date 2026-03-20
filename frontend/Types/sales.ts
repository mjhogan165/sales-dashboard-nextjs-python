export type SalesRecord = {
  State: string;
  Sales: number;
};

export type GroupRecord = {
  Group: string;
  Sales: number;
};

export type TimeSeriesRecord = {
  Date: string;
  Sales: number;
};

export type SalesSummary = {
  total_sales: number;
  top_state: string | null;
  top_group: string | null;
  lowest_group: string | null;
};

export type Stats = {
  mean: number;
  median: number;
  mode: number | null;
  std_dev: number;
};

export type Statistics = {
  sales: Stats;
  units: Stats;
};

export type SalesData = {
  summary: SalesSummary;
  statistics: Statistics;
  state_sales: SalesRecord[];
  group_sales: GroupRecord[];
  time_series: {
    weekly: TimeSeriesRecord[];
    monthly: TimeSeriesRecord[];
    quarterly: TimeSeriesRecord[];
  };
};
