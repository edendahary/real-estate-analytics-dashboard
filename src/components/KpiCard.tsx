import { Paper, Typography } from "@mui/material";

export const  KpiCard = ({ title, value }: { title: string; value: string }) =>{
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 2,
        borderRadius: 2,
        minWidth: 200,
      }}
    >
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}
