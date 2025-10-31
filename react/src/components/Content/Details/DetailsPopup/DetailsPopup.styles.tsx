import { type SxProps, type Theme } from "@mui/material";

export const tableHead: SxProps<Theme> = {
  "& > *": {
    fontWeight: "bold",
  },
};

export const tableBody: SxProps<Theme> = {
  "& > tr": {
    display: "flex",
    flexDirection: "row",
  },
};

export const dialogTitleWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  "& > svg": {
    marginInline: 2,
  },
};
