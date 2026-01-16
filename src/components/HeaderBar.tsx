import { Box, Typography, Button, Paper, Chip, Stack } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

type Props = {
  counts: {
    states: number;
    msas: number;
    zipCodes: number;
  };
  activeLevel?: "states" | "msas" | "zipCodes";
};

export default function HeaderBar({ counts, activeLevel = "zipCodes" }: Props) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Left */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Data Levels
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 0.75 }}
          alignItems="center"
        >
          <Chip label="Location" size="small" variant="outlined" />

          <Chip
            label={`States ${counts.states}`}
            size="small"
            variant={activeLevel === "states" ? "filled" : "outlined"}
            color={activeLevel === "states" ? "primary" : "default"}
          />

          <Chip
            label={`MSAs ${counts.msas}`}
            size="small"
            variant={activeLevel === "msas" ? "filled" : "outlined"}
            color={activeLevel === "msas" ? "primary" : "default"}
          />

          <Chip
            label={`ZIP codes ${counts.zipCodes}`}
            size="small"
            variant={activeLevel === "zipCodes" ? "filled" : "outlined"}
            color={activeLevel === "zipCodes" ? "primary" : "default"}
          />
        </Stack>
      </Box>

      {/* Right */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" startIcon={<SaveIcon />}>
          Save
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<PlaylistAddIcon />}
        >
          Target List
        </Button>
      </Box>
    </Paper>
  );
}
