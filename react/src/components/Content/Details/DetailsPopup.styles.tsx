import { type SxProps, type Theme } from "@mui/material";

export const tableHead: SxProps<Theme> = {
  "& > *": {
    fontWeight: "bold",
  },
};

export const tableBody: SxProps<Theme> = {
  "& > tr": {
    display: "flex",
    flexDirection: "row"
  },
};
