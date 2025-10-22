import { type SxProps, type Theme } from "@mui/material";

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
  borderBottom: isSelected ? "2px solid black" : "none",
});

export const listButtons: SxProps<Theme> = {
  display: "flex",
  "&>*": {
    marginInline: "3px",
  },
  cursor: "default",
};