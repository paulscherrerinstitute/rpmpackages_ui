import { type SxProps, type Theme } from "@mui/material";

export const dialogueWrapper: SxProps<Theme> = {
  "& > div": {
    padding: 3,
  },
};

export const formWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};

export const formControl: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > button": {
    marginTop: 3,
    width: "10vw",
  },
};

export const clearWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 2
};
