import type { FilterModel } from "ag-grid-community";
import type { MetricKind } from "../types/metric.config";

export function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum / nums.length;
}

export function formatValue(kind: MetricKind, value: number) {
  if (kind === "currency") return `$${Math.round(value).toLocaleString()}`;
  if (kind === "percent") return `${value.toFixed(2)}%`;
  return value.toFixed(2);
}




function formatSimpleCondition(cond: FilterModel): string {
  // מספרים
  if (typeof cond?.filter === "number") {
    if (cond.filterTo != null)
      return `${cond.type}: ${cond.filter} - ${cond.filterTo}`;
    return `${cond.type}: ${cond.filter}`;
  }

  // טקסט
  if (typeof cond?.filter === "string") {
    return `${cond.type ?? "contains"}: "${cond.filter}"`;
  }

  // fallback
  return cond?.type ? String(cond.type) : "";
}

export function formatFilterValue(model: FilterModel): string {
  const m = model;

  // ✅ Multi-condition (AND/OR)
  if (m?.operator && Array.isArray(m?.conditions)) {
    const parts = m.conditions
      .map((c: FilterModel) => formatSimpleCondition(c))
      .filter(Boolean);

    return parts.join(` ${m.operator} `);
  }

  // ✅ Single text/number filter
  if (typeof m?.filter === "string") {
    return `${m.type ?? "contains"}: "${m.filter}"`;
  }
  if (typeof m?.filter === "number") {
    if (m.filterTo != null) return `${m.type}: ${m.filter} - ${m.filterTo}`;
    return `${m.type}: ${m.filter}`;
  }

  // ✅ Set filter
  if (Array.isArray(m?.values)) {
    return m.values.join(", ");
  }

  return "";
}
