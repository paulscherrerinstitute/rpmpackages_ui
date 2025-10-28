import { type SxProps, type Theme } from "@mui/material";

export const packageRow: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(224, 224, 224, 1)",
  "& > *": {
    borderBottom: "none",
  },
};

export const dialogIcons: SxProps<Theme> = {
  padding: 3,
  display: "flex",
  flexDirection: "row",
  "& > *": {
    margin: 0.5,
  },
  "& > svg:hover": {
    cursor: "pointer",
  },
};

export const tableFileStatusWrapper: SxProps<Theme> = {
  "& > *": {
    alignContent: "center",
    justifyContent: "left",
  },
  "& > div": {
    marginRight: 40,
  },
  display: "flex",
  flexDirection: "row",
};

export const noFile: SxProps<Theme> = {
  backgroundColor: "rgba(255, 0, 0, 0.2)",
  padding: 0.4,
};

export const isFile: SxProps<Theme> = {
  backgroundColor: "rgba(0, 255, 0, 0.2)",
  padding: 0.4,
};

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
