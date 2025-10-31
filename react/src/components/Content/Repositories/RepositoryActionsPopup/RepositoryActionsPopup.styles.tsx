import { type SxProps, type Theme } from "@mui/material";

export const wrapper: SxProps<Theme> = {
  padding: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export const content: SxProps<Theme> = {
  width: "30vw",
  "& > div": {
    display: "flex",
    flexDirection: "column",
    "& > *": {
      marginBlock: 1,
    },
  },
};

export const buttonWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  "& > button": {
    width: "10vw",
  },
};

export const selectWrapper: SxProps<Theme> = {
  padding: 1,
  "& > *": {
    marginBlock: 2,
  },
};

export const clearWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  "& > svg": {
    marginRight: 1,
  },
};
