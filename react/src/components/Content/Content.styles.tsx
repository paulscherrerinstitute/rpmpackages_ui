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

export const clickButtonBig: SxProps<Theme> = {
  "&:hover": {
    cursor: "pointer",
  },
};

export const boldTitle: SxProps<Theme> = {
  fontWeight: "bold",
};

export const packageTitle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

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

export const dialogueWrapper: SxProps<Theme> = {
  "& > div": {
    padding: 3,
  },
};

export const formWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  "& > *": {
    paddingTop: 1,
    paddingBottom: 1,
  },
};

export const listItem = (isSelected: boolean): SxProps<Theme> => ({
  "&:hover": {
    background: "rgba(130, 130, 130, 0.1)",
    cursor: "grab",
  },
  "&:drop": {
    background: "rgba(130, 130, 130, 1)",
  },
  borderBottom: isSelected ? "2px solid black" : "none"
});
