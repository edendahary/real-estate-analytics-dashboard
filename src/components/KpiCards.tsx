import { Typography, Stack } from "@mui/material";
import { KpiCard } from "./KpiCard";

type Props = {
  totalRows: number;
  selectedRows: number;

  rentGrowthAvg: number;
  fitScoreAvg: number;
  overallScore: number;
};

export default function KpiCards({
  totalRows,
  selectedRows,
  rentGrowthAvg,
  fitScoreAvg,
  overallScore,
}: Props) {
  const scopeLabel =
    selectedRows > 0 ? `Selected (${selectedRows})` : `All (${totalRows})`;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
    >
      <Typography variant="caption" sx={{ opacity: 0.75, mr: 1 }}>
        {scopeLabel}
      </Typography>

      <KpiCard
        title="Rent Growth Average"
        value={`${rentGrowthAvg.toFixed(2)}%`}
      />

      <KpiCard title="Fit Score" value={fitScoreAvg.toFixed(2)} />

      <KpiCard title="Overall" value={overallScore.toFixed(2)} />
    </Stack>
  );
}
