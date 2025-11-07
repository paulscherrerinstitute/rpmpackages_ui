import { type SxProps, type Theme } from "@mui/material";
export const empty = (emptyColor: string): SxProps<Theme> => ({
  backgroundColor: emptyColor.length > 0 ? emptyColor : "rgba(0, 255, 0, 0.05)",
});

export const noMatch = (noMatchColor: string): SxProps<Theme> => ({
  backgroundColor:
    noMatchColor.length > 0 ? noMatchColor : "rgba(255, 0, 0, 0.05)",
});
