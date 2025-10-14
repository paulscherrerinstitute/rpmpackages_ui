import { type SxProps, type Theme } from "@mui/material";

export const body: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
};

export const main: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 2,
  marginTop: "5vw",
  width: "100%",
  overflowX: "clip",
};

export const outerList: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
};

export const titleList: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  margin: 1,
  "& > h3": {
    margin: 0,
    padding: 0,
  },
  "& > svg": {
    fontSize: "big",
    "&:hover": {
        cursor: "pointer",
    },
  },
};

export const innerList: SxProps<Theme> = {
  "&:hover": {
    cursor: "pointer",
  },
  fontSize: "medium",
};
