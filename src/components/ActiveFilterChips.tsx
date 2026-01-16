import { Box, Chip, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";

type Props = {
  filterModel: FilterModel;
  headerMap: Record<string, string>;
  onRemove: (colId: string) => void;
  onClearAll: () => void;
};

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

function formatFilterValue(model: FilterModel): string {
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



export default function ActiveFilterChips({
  filterModel,
  headerMap,
  onRemove,
  onClearAll,
}: Props) {
  const entries = Object.entries(filterModel ?? {});
  if (entries.length === 0) return null;

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
    >
      <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
        Active Filters:
      </Typography>

      {entries.map(([colId, model]) => {
        const label = headerMap[colId] ?? colId;
        const valueText = formatFilterValue(model);
        return (
          <Chip
            key={colId}
            size="small"
            variant="outlined"
            label={`${label} • ${valueText}`}
            onDelete={() => onRemove(colId)}
          />
        );
      })}

      <Chip
        size="small"
        color="primary"
        variant="outlined"
        label="Clear all"
        onClick={onClearAll}
      />
    </Box>
  );
}
