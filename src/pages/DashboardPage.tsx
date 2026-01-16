import { useMemo, useState } from "react";
import { loadRows, type TableRow } from "../data/loadData";
import HeaderBar from "../components/HeaderBar";
import KpiCards from "../components/KpiCards";
import DataTable from "../components/DataTable";
import ChartsPanel from "../components/ChartsPanel";
import { Container, Box } from "@mui/material";
import type { GridApi, FilterModel } from "ag-grid-community";
import ActiveFilterChips from "../components/ActiveFilterChips";
import countersData from "../data/counters-data.json";
import { avg } from "../utils/utils";



export default function DashboardPage() {
  const { rows, fitScoreOverall } = useMemo(() => loadRows(), []);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [filterModel, setFilterModel] = useState<FilterModel>({});

  const counters = useMemo(() => {
    return {
      states: countersData.usstates?.length ?? 0,
      msas: countersData.msas?.length ?? 0,
      zipCodes: countersData.zip_codes?.length ?? 0,
    };
  }, []);

  const headerMap = useMemo(() => {
    return {
      zip_code: "Zip Code",
      state: "State",
      city: "City",
      fit_score: "Fit Score",
      rent_growth: "Rent Growth (%)",
      appreciation: "Appreciation (%)",
      cap_rate: "Cap Rate (%)",
      total_population: "Total Population",
      population_growth: "Population Growth (%)",
      migration_trend: "Migration Trend (%)",
      persons_per_household: "Persons Per Household",
      median_household_income: "Median Household Income",
      share_of_renters: "Share Of Renters (%)",
      median_age: "Median Age",
    } as const;
  }, []);

  async function removeFilter(colId: string) {
    if (!gridApi) return;

    const next: FilterModel = { ...filterModel };
    delete (next as FilterModel)[colId]; 

    gridApi.setFilterModel(Object.keys(next).length ? next : null);

    gridApi.getColumnFilterInstance(colId).then((inst) => {
      if (!inst) return;
      inst.setModel(null);
      gridApi.onFilterChanged();
    });

    setFilterModel(Object.keys(next).length ? next : {});
  }

  function clearAllFilters() {
    if (!gridApi) return;
    gridApi.setFilterModel(null);
    gridApi.onFilterChanged();
    setFilterModel({});
  }

  const selectedRows = useMemo(() => {
    if (selectedZipCodes.length === 0) return [] as TableRow[];
    const set = new Set(selectedZipCodes);
    return rows.filter((r) => set.has(r.zip_code));
  }, [rows, selectedZipCodes]);

  const scopeRows = selectedRows.length > 0 ? selectedRows : rows;

  const rentGrowthAvg = useMemo(() => {
    return avg(
      scopeRows
        .map((r) => r.rent_growth)
        .filter((v): v is number => typeof v === "number")
    );
  }, [scopeRows]);

  const fitScoreAvg = useMemo(() => {
    return avg(
      scopeRows
        .map((r) => r.fit_score)
        .filter((v): v is number => typeof v === "number")
    );
  }, [scopeRows]);

  const overallScore = useMemo(() => {
    return selectedRows.length > 0 ? fitScoreAvg : fitScoreOverall;
  }, [selectedRows.length, fitScoreAvg, fitScoreOverall]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <HeaderBar counts={counters} activeLevel="zipCodes" />

      <Box style={{ marginTop: 16 }}>
        <KpiCards
          totalRows={rows.length}
          selectedRows={selectedRows.length}
          rentGrowthAvg={rentGrowthAvg}
          fitScoreAvg={fitScoreAvg}
          overallScore={overallScore}
        />
      </Box>
      <ActiveFilterChips
        filterModel={filterModel}
        headerMap={headerMap}
        onRemove={removeFilter}
        onClearAll={clearAllFilters}
      />

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <ChartsPanel
          rows={rows}
          selectedZipCodes={selectedZipCodes}
          onPointSelect={(zip) => {
            setSelectedZipCodes((prev) => {
              const next = prev.includes(zip)
                ? prev.filter((z) => z !== zip)
                : [...prev, zip];
              return next;
            });

            if (!gridApi) return;

            const node = gridApi.getRowNode(zip);
            if (!node) return; 

            gridApi.ensureNodeVisible(node, "middle");
            gridApi.setFocusedCell(node.rowIndex!, "zip_code");
          }}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <DataTable
          rows={rows}
          selectedZipCodes={selectedZipCodes}
          onSelectedZipCodesChange={setSelectedZipCodes}
          onApiReady={setGridApi}
          onFilterModelChange={setFilterModel}
        />
      </Box>
    </Container>
  );
}
