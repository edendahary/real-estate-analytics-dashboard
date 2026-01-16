import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TableRow } from "../data/loadData";
import { Box, Stack } from "@mui/material";
import { ChartCard } from "./ChartCard";
import type { Point } from "../types/types";
import { ChartTooltip } from "./ChartTooltip";
import { METRICS, type MetricKey } from "../types/metric.config";
import { MetricSelect } from "./MetricSelect";

type Props = {
  rows: TableRow[];
  selectedZipCodes: string[];
  onPointSelect: (zip: string) => void;
};

function metricByKey(key: MetricKey) {
  return METRICS.find((m) => m.key === key) ?? METRICS[0];
}

function toPoint(r: TableRow, xKey: MetricKey, yKey: MetricKey): Point | null {
  const x = r[xKey] as unknown;
  const y = r[yKey] as unknown;

  if (typeof x !== "number" || typeof y !== "number") return null;

  return {
    zip: r.zip_code,
    city: r.city,
    x,
    y,
  };
}

export default function ChartsPanel({
  rows,
  selectedZipCodes,
  onPointSelect,
}: Props) {
  const [leftX, setLeftX] = useState<MetricKey>("rent_growth");
  const [leftY, setLeftY] = useState<MetricKey>("median_rent" as MetricKey);

  const [rightX, setRightX] = useState<MetricKey>(
    "occupancy_rate_kpi" as MetricKey
  );
  const [rightY, setRightY] = useState<MetricKey>(
    "percent_of_mfh_under_5_years" as MetricKey
  );

  const selectedSet = useMemo(
    () => new Set(selectedZipCodes),
    [selectedZipCodes]
  );
  const hasSelection = selectedZipCodes.length > 0;

  // ----- Left data -----
  const allLeft = useMemo<Point[]>(() => {
    return rows
      .map((r) => toPoint(r, leftX, leftY))
      .filter((p): p is Point => p !== null);
  }, [rows, leftX, leftY]);

  const leftToShow = useMemo(() => {
    if (!hasSelection) return allLeft;
    return allLeft.filter((p) => selectedSet.has(p.zip));
  }, [allLeft, hasSelection, selectedSet]);

  // ----- Right data -----
  const allRight = useMemo<Point[]>(() => {
    return rows
      .map((r) => toPoint(r, rightX, rightY))
      .filter((p): p is Point => p !== null);
  }, [rows, rightX, rightY]);

  const rightToShow = useMemo(() => {
    if (!hasSelection) return allRight;
    return allRight.filter((p) => selectedSet.has(p.zip));
  }, [allRight, hasSelection, selectedSet]);

  const leftXMetric = metricByKey(leftX);
  const leftYMetric = metricByKey(leftY);
  const rightXMetric = metricByKey(rightX);
  const rightYMetric = metricByKey(rightY);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
        width: "100%",
      }}
    >
      {/* LEFT CHART */}
      <ChartCard
        rightSlot={
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "nowrap", justifyContent: "flex-end" }}
          >
            <MetricSelect
              id="left-x"
              label="X KPI"
              value={leftX}
              onChange={setLeftX}
            />
            <MetricSelect
              id="left-y"
              label="Y KPI"
              value={leftY}
              onChange={setLeftY}
            />
          </Stack>
        }
      >
        <Box sx={{ width: "100%", height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name={leftXMetric.label} />
              <YAxis type="number" dataKey="y" name={leftYMetric.label} />
              <Tooltip
                content={
                  <ChartTooltip xMetric={leftXMetric} yMetric={leftYMetric} />
                }
              />
              <Scatter
                name="ZIPs"
                data={leftToShow}
                shape="circle"
                cursor={"pointer"}
                onClick={(data) => {
                  const p = data?.payload as Point | undefined;
                  if (!p) return;
                  onPointSelect(p.zip);
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </ChartCard>

      {/* RIGHT CHART */}
      <ChartCard
        rightSlot={
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: "nowrap", justifyContent: "flex-end" }}
          >
            <MetricSelect
              id="right-x"
              label="X KPI"
              value={rightX}
              onChange={setRightX}
            />
            <MetricSelect
              id="right-y"
              label="Y KPI"
              value={rightY}
              onChange={setRightY}
            />
          </Stack>
        }
      >
        <Box sx={{ width: "100%", height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name={rightXMetric.label} />
              <YAxis type="number" dataKey="y" name={rightYMetric.label} />
              <Tooltip
                content={
                  <ChartTooltip xMetric={rightXMetric} yMetric={rightYMetric} />
                }
              />
              <Scatter
                name="ZIPs"
                data={rightToShow}
                shape="circle"
                cursor={"pointer"}
                onClick={(data) => {
                  const p = data?.payload as Point | undefined;
                  if (!p) return;
                  onPointSelect(p.zip);
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Box>
      </ChartCard>
    </Box>
  );
}
