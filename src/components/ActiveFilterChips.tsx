import { Box, Chip, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { formatFilterValue } from "../utils/utils";

type Props = {
  filterModel: FilterModel;
  headerMap: Record<string, string>;
  onRemove: (colId: string) => void;
  onClearAll: () => void;
};

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
