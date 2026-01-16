import tableLines from "./table-lines-data.json";
import fitScore from "./fit-score.json";
import type { TrendCode } from "../types/types";


export type TableRow = {
  zip_code: string;
  city: string;
  state: string;

  fit_score: number | null;

  // KPIs
  rent_growth: number;
  appreciation: number;
  cap_rate: number;

  total_population: number;
  population_growth: number;
  migration_trend: number;
  persons_per_household: number;

  median_household_income: number;
  share_of_renters: number;
  median_age: number;

  graduate_degree_percent: number;
  occupancy_rate_kpi: number;
  median_rent: number;
  rent_to_income_ratio: number;
  employment_rate: number;
  median_house_value: number;
  violent_crime_rate: number;
  mfh_units_per_1000_residents: number;
  average_age_of_mfh: number;
  percent_of_mfh_under_5_years: number;
  density: number;
  supply_vs_demand: number;
  scarcity_index: number;
  construction_start: number;
  median_gross_yield: number;

  // demographics
  white_pct: number;
  black_pct: number;
  asian_pct: number;
  latino_pct: number;

  // trend fields
  population_growth_t: TrendCode;
  migration_trend_t: TrendCode;
  median_age_t: TrendCode;
  graduate_degree_percent_t: TrendCode;
  employment_rate_t: TrendCode;
  violent_crime_rate_t: TrendCode;
  mfh_units_per_1000_residents_t: TrendCode;
  average_age_of_mfh_t: TrendCode;
  percent_of_mfh_under_5_years_t: TrendCode;
  density_t: TrendCode;
  scarcity_index_t: TrendCode;
  construction_start_t: TrendCode;
  average_age_of_buildings_t: TrendCode;
  rent_growth_t: TrendCode;
  appreciation_t: TrendCode;
  cap_rate_t: TrendCode;
  average_school_score_t: TrendCode; 
  persons_per_household_t: TrendCode;
  median_household_income_t: TrendCode;
  share_of_renters_t: TrendCode;
  occupancy_rate_kpi_t: TrendCode;
  median_rent_t: TrendCode;
  rent_to_income_ratio_t: TrendCode;
  median_house_value_t: TrendCode;
  supply_vs_demand_t: TrendCode;
};

type FitScoreItem = { zip_code: string; fit_score: number };
type FitScoreJson = { fit_score_overall: number; f_scores: FitScoreItem[] };

export function loadRows(): { rows: TableRow[]; fitScoreOverall: number } {
  const fitJson = fitScore as FitScoreJson;

  const fitMap = new Map<string, number>();
  for (const item of fitJson.f_scores) {
    fitMap.set(item.zip_code, item.fit_score);
  }

  const rows = (tableLines as TableRow[]).map((r) => {
    const fit = fitMap.get(r.zip_code);
    return {
      ...r,
      fit_score: typeof fit === "number" ? fit : null,
    } as TableRow;
  });

  return { rows, fitScoreOverall: fitJson.fit_score_overall };
}
