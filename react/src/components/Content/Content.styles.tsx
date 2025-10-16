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

export const clickButton: SxProps<Theme> = {
  "&:hover": {
    cursor: "pointer",
  },
  fontSize: "medium",
};

export const boldTitle: SxProps<Theme> = {
  fontWeight: "bold",
};

export const packageTitle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
};

export const dialogIcons: SxProps<Theme> = {
  padding: 3,
  display:"flex",
  flexDirection: "row",
  "& > *":{
    margin: 0.5
  },
  "& > svg:hover":{
    cursor: "pointer"
  }
}