import { Paper,  Typography,  Box } from "@mui/material";
import type { Point } from "../types/types";
import { formatValue } from "../utils/utils";
import type { MetricOption } from "../types/metric.config";

export function ChartTooltip({
  active,
  payload,
  xMetric,
  yMetric,
}: {
  active?: boolean;
  payload?: Array<{
    payload: Point;
    value: number;
    dataKey: string;
    color?: string;
  }>;
  xMetric: MetricOption;
  yMetric: MetricOption;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0]?.payload as unknown as Point | undefined;
  if (!p) return null;

  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2, minWidth: 220 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {p.zip} - {p.city}
      </Typography>

      <Box sx={{ mt: 0.5, display: "grid", gap: 0.25 }}>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {xMetric.label}: <b>{formatValue(xMetric.kind, p.x)}</b>
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {yMetric.label}: <b>{formatValue(yMetric.kind, p.y)}</b>
        </Typography>
      </Box>
    </Paper>
  );
}
