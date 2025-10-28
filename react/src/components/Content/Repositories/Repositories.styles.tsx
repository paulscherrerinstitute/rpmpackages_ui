import { type SxProps, type Theme } from "@mui/material";

export const titleWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 1,
};

export const searchWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  "& > svg": {
    marginInlineStart: 2,
    cursor: "pointer",
  },
};

export const body: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  marginTop: 0.5,
  width: "100%",
  overflowX: "clip",
  "& > table": {
    tableLayout: "fixed",
  },
};
