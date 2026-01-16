import type { TableRow } from "../data/loadData";

export type MetricKind = "percent" | "currency" | "number";

export type MetricOption<K extends keyof TableRow = keyof TableRow> = {
  key: K;
  label: string;
  kind: MetricKind;
  unit?: string; // "%", "$"
};

export type MetricKey = (typeof METRICS)[number]["key"];


export const METRICS: MetricOption[] = [
  { key: "fit_score", label: "Fit Score", kind: "number", unit: "" },

  { key: "rent_growth", label: "Rent Growth", kind: "percent", unit: "%" },
  { key: "appreciation", label: "Appreciation", kind: "percent", unit: "%" },
  { key: "cap_rate", label: "Cap Rate", kind: "percent", unit: "%" },

  {
    key: "median_rent",
    label: "Median Rent",
    kind: "currency",
    unit: "$",
  },
  {
    key: "median_household_income",
    label: "Median Household Income",
    kind: "currency",
    unit: "$",
  },

  {
    key: "total_population",
    label: "Total Population",
    kind: "number",
    unit: "",
  },
  {
    key: "population_growth",
    label: "Population Growth",
    kind: "percent",
    unit: "%",
  },
  {
    key: "migration_trend",
    label: "Migration Trend",
    kind: "percent",
    unit: "%",
  },
  {
    key: "persons_per_household",
    label: "Persons per Household",
    kind: "number",
    unit: "",
  },
  {
    key: "share_of_renters",
    label: "Share of Renters",
    kind: "percent",
    unit: "%",
  },
  {
    key: "median_age",
    label: "Median Age",
    kind: "number",
    unit: "",
  },

  {
    key: "occupancy_rate_kpi",
    label: "Occupancy Rate",
    kind: "percent",
    unit: "%",
  },
  {
    key: "percent_of_mfh_under_5_years",
    label: "Share of MFH under 5 years",
    kind: "percent",
    unit: "%",
  },
] as const;
