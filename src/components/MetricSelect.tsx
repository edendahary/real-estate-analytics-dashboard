import { Autocomplete, TextField } from "@mui/material";
import { METRICS, type MetricKey, type MetricOption } from "../types/metric.config";

export function MetricSelect({
  id,
  label,
  value,
  onChange,
  options = METRICS,
}: {
  id: string;
  label: string;
  value: MetricKey;
  onChange: (v: MetricKey) => void;
  options?: readonly MetricOption[];
}) {
  const selectedOption =
    options.find((o) => String(o.key) === String(value)) ?? undefined;

  return (
    <Autocomplete
      id={id}
      size="small"
      disableClearable
      options={options as MetricOption[]}
      value={selectedOption}
      getOptionLabel={(opt) =>
        `${opt.label}${opt.unit ? ` (${opt.unit})` : ""}`
      }
      onChange={(_, opt) => {
        if (!opt) return;
        onChange(opt.key as MetricKey);
      }}
      filterOptions={(opts, state) => {
        const q = state.inputValue.trim().toLowerCase();
        if (!q) return opts;

        return opts.filter((o) => {
          const label = o.label.toLowerCase();
          const key = String(o.key).toLowerCase();
          return label.includes(q) || key.includes(q);
        });
      }}
      slotProps={{ listbox: { sx: { minWidth: 220, whiteSpace:"nowrap",textOverflow:"ellipsis" } } }}
      sx={{ flex: "1 1 0", minWidth: 220 }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Search…" />
      )}
    />
  );
}
