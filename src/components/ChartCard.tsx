import { Paper } from "@mui/material";

export function ChartCard({
  children,
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection:"column",
        alignItems: "center",
        gap: 3,
        mb: 1,
        p:3
      }}
    >
      {rightSlot}
      {children}
    </Paper>
  );
}
