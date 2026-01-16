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


