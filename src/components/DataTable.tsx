import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent,
  FilterChangedEvent,
  SortChangedEvent,
  ICellRendererParams,
  FilterModel,
} from "ag-grid-community";
import type { TableRow } from "../data/loadData";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import type { TrendCode } from "../types/types";
import { Box, Typography } from "@mui/material";

type Props = {
  rows: TableRow[];
  selectedZipCodes: string[];
  onSelectedZipCodesChange: (zipCodes: string[]) => void;

  onApiReady?: (api: GridApi) => void;
  onFilterModelChange?: (model: FilterModel) => void;
};

type TrendCellParams = ICellRendererParams<TableRow, number | null | undefined>;

function TrendIcon({ trend }: { trend: TrendCode }) {
  if (!trend) return null;

  switch (trend) {
    case "UP":
      return <ArrowUpwardIcon sx={{ fontSize: 18, color: "secondary.main" }} />;
    case "UR":
      return <ArrowOutwardIcon sx={{ fontSize: 18, color: "success.main" }} />;
    case "DR":
      return <SouthEastIcon sx={{ fontSize: 18, color: "warning.main" }} />;
    case "DN":
      return <ArrowDownwardIcon sx={{ fontSize: 18, color: "error.main" }} />;
    case "NE":
      return <ArrowForwardIcon sx={{ fontSize: 18, color: "success.main" }} />;
    default:
      return null;
  }
}
function ValueWithTrend({
  valueText,
  trend,
}: {
  valueText: string;
  trend: TrendCode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Typography variant="subtitle2">{valueText}</Typography>
      <TrendIcon trend={trend} />
    </span>
  );
}

export default function DataTable({
  rows,
  selectedZipCodes,
  onSelectedZipCodesChange,
  onApiReady,
  onFilterModelChange,
}: Props) {
  const gridRef = useRef<AgGridReact<TableRow>>(null);
  const [api, setApi] = useState<GridApi | null>(null);


  const isSyncingRef = useRef(false);

  // --- עמודות ---
  const columnDefs = useMemo<ColDef<TableRow>[]>(() => {
    // helpers מקומיים
    const pctText = (v: number | null | undefined) =>
      typeof v === "number" ? `${v.toFixed(2)}%` : "-";

    const num2Text = (v: number | null | undefined) =>
      typeof v === "number" ? v.toFixed(2) : "-";

    const intText = (v: number | null | undefined) =>
      typeof v === "number" ? Math.round(v).toLocaleString() : "-";

    const usdIntText = (v: number | null | undefined) =>
      typeof v === "number" ? `$${Math.round(v).toLocaleString()}` : "-";



    const trendCell =
      (
        format: (v: number | null | undefined) => string,
        trendKey: keyof TableRow
      ) =>
      (p: TrendCellParams) => {
        const valueText = format(p.value);
        const t = p.data?.[trendKey] as unknown as TrendCode;
        return <ValueWithTrend valueText={valueText} trend={t} />;
      };

    return [
      // ---- base fields ----
      { field: "zip_code", headerName: "Zip Code", minWidth: 110 },
      { field: "state", headerName: "State", minWidth: 90 },
      { field: "city", headerName: "City", minWidth: 160 },

      // ---- core KPIs (with trends) ----
      {
        field: "fit_score",
        headerName: "Fit Score",
        minWidth: 110,
        valueFormatter: (p) => num2Text(p.value),
      },
      {
        field: "rent_growth",
        headerName: "Rent Growth (%)",
        minWidth: 150,
        cellRenderer: trendCell((v) => pctText(v), "rent_growth_t"),
      },
      {
        field: "appreciation",
        headerName: "Appreciation (%)",
        minWidth: 150,
        cellRenderer: trendCell((v) => pctText(v), "appreciation_t"),
      },
      {
        field: "cap_rate",
        headerName: "Cap Rate (%)",
        minWidth: 130,
        cellRenderer: trendCell((v) => pctText(v), "cap_rate_t"),
      },

      // ---- population ----
      {
        field: "total_population",
        headerName: "Total Population",
        minWidth: 160,
        valueFormatter: (p) => intText(p.value),
      },
      {
        field: "population_growth",
        headerName: "Population Growth (%)",
        minWidth: 185,
        cellRenderer: trendCell((v) => pctText(v), "population_growth_t"),
      },
      {
        field: "migration_trend",
        headerName: "Migration Trend (%)",
        minWidth: 175,
        cellRenderer: trendCell((v) => pctText(v), "migration_trend_t"),
      },
      {
        field: "persons_per_household",
        headerName: "Persons / Household",
        minWidth: 185,
        cellRenderer: trendCell((v) => num2Text(v), "persons_per_household_t"),
      },

      // ---- income / rent ----
      {
        field: "median_household_income",
        headerName: "Median Household Income",
        minWidth: 220,
        cellRenderer: trendCell(
          (v) => usdIntText(v),
          "median_household_income_t"
        ),
      },
      {
        field: "share_of_renters",
        headerName: "Share of Renters (%)",
        minWidth: 185,
        cellRenderer: trendCell((v) => pctText(v), "share_of_renters_t"),
      },
      {
        field: "occupancy_rate_kpi",
        headerName: "Occupancy Rate (%)",
        minWidth: 170,
        cellRenderer: trendCell((v) => pctText(v), "occupancy_rate_kpi_t"),
      },
      {
        field: "median_rent",
        headerName: "Median Rent ($)",
        minWidth: 160,
        cellRenderer: trendCell((v) => usdIntText(v), "median_rent_t"),
      },
      {
        field: "rent_to_income_ratio",
        headerName: "Rent-to-Income (%)",
        minWidth: 175,
        cellRenderer: trendCell((v) => pctText(v), "rent_to_income_ratio_t"),
      },

      // ---- age / education / employment ----
      {
        field: "median_age",
        headerName: "Median Age",
        minWidth: 135,
        cellRenderer: trendCell((v) => num2Text(v), "median_age_t"),
      },
      {
        field: "graduate_degree_percent",
        headerName: "Graduate Degree (%)",
        minWidth: 185,
        cellRenderer: trendCell((v) => pctText(v), "graduate_degree_percent_t"),
      },
      {
        field: "employment_rate",
        headerName: "Employment Rate (%)",
        minWidth: 175,
        cellRenderer: trendCell((v) => pctText(v), "employment_rate_t"),
      },

      // ---- housing value / yields ----
      {
        field: "median_house_value",
        headerName: "Median House Value ($)",
        minWidth: 200,
        cellRenderer: trendCell((v) => usdIntText(v), "median_house_value_t"),
      },
      {
        field: "median_gross_yield",
        headerName: "Median Gross Yield (%)",
        minWidth: 195,
        valueFormatter: (p) => pctText(p.value),
      },

      // ---- crime ----
      {
        field: "violent_crime_rate",
        headerName: "Violent Crime Rate",
        minWidth: 180,
        cellRenderer: trendCell((v) => num2Text(v), "violent_crime_rate_t"),
      },

      // ---- MFH ----
      {
        field: "mfh_units_per_1000_residents",
        headerName: "MFH Units / 1000",
        minWidth: 170,
        cellRenderer: trendCell(
          (v) => num2Text(v),
          "mfh_units_per_1000_residents_t"
        ),
      },
      {
        field: "average_age_of_mfh",
        headerName: "Avg Age of MFH",
        minWidth: 160,
        cellRenderer: trendCell((v) => num2Text(v), "average_age_of_mfh_t"),
      },
      {
        field: "percent_of_mfh_under_5_years",
        headerName: "MFH < 5 years (%)",
        minWidth: 175,
        cellRenderer: trendCell(
          (v) => pctText(v),
          "percent_of_mfh_under_5_years_t"
        ),
      },
      // ---- density / supply-demand / scarcity / construction ----
      {
        field: "density",
        headerName: "Density",
        minWidth: 130,
        cellRenderer: trendCell((v) => num2Text(v), "density_t"),
      },
      {
        field: "supply_vs_demand",
        headerName: "Supply vs Demand",
        minWidth: 170,
        cellRenderer: trendCell((v) => num2Text(v), "supply_vs_demand_t"),
      },
      {
        field: "scarcity_index",
        headerName: "Scarcity Index",
        minWidth: 160,
        cellRenderer: trendCell((v) => num2Text(v), "scarcity_index_t"),
      },
      {
        field: "construction_start",
        headerName: "Construction Start",
        minWidth: 170,
        cellRenderer: trendCell((v) => intText(v), "construction_start_t"),
      },

      // ---- demographics ----
      {
        field: "white_pct",
        headerName: "White (%)",
        minWidth: 130,
        valueFormatter: (p) => pctText(p.value),
      },
      {
        field: "black_pct",
        headerName: "Black (%)",
        minWidth: 130,
        valueFormatter: (p) => pctText(p.value),
      },
      {
        field: "asian_pct",
        headerName: "Asian (%)",
        minWidth: 130,
        valueFormatter: (p) => pctText(p.value),
      },
      {
        field: "latino_pct",
        headerName: "Latino (%)",
        minWidth: 140,
        valueFormatter: (p) => pctText(p.value),
      },
    ];
  }, []);

  const defaultColDef = useMemo<ColDef<TableRow>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const getRowId = useMemo(() => {
    return (params: { data: TableRow }) => params.data.zip_code;
  }, []);

  function syncSelectionFromState(currentApi: GridApi, zips: string[]) {
    isSyncingRef.current = true;

    const set = new Set(zips);

    currentApi.forEachNode((node) => {
      const zip = node.data?.zip_code;
      if (!zip) return;

      const shouldBeSelected = set.has(zip);
      if (node.isSelected() !== shouldBeSelected) {
        node.setSelected(shouldBeSelected);
      }
    });

    isSyncingRef.current = false;
  }

  const onGridReady = (e: GridReadyEvent<TableRow>) => {
    setApi(e.api);
    syncSelectionFromState(e.api, selectedZipCodes);
    onApiReady?.(e.api);
    onFilterModelChange?.(e.api.getFilterModel());
  };

  const onSelectionChanged = (e: SelectionChangedEvent<TableRow>) => {
    if (isSyncingRef.current) return;

    const selectedRows = e.api.getSelectedRows();
    const zipCodes = selectedRows.map((r) => r.zip_code);
    onSelectedZipCodesChange(zipCodes);
  };

  useEffect(() => {
    if (!api) return;
    syncSelectionFromState(api, selectedZipCodes);
  }, [api, selectedZipCodes]);

  const onFilterChanged = (e: FilterChangedEvent<TableRow>) => {
    syncSelectionFromState(e.api, selectedZipCodes);
    onFilterModelChange?.(e.api.getFilterModel());
  };

  const onSortChanged = (e: SortChangedEvent<TableRow>) => {
    syncSelectionFromState(e.api, selectedZipCodes);
  };

  return (
    <Box
      className="ag-theme-alpine"
      sx={{
        height: 500,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <AgGridReact<TableRow>
        ref={gridRef}
        theme="legacy"
        rowData={rows ?? []}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowSelection={{
          mode: "multiRow",
          enableClickSelection: false,
        }}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onFilterChanged={onFilterChanged}
        onSortChanged={onSortChanged}
        animateRows
      />
    </Box>
  );
}
