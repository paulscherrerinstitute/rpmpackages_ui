import { type SxProps, type Theme } from "@mui/material";

export const wrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBlock: 3,
};

export const iconWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  "& > *": {
    paddingInline: 0.2,
  },
};
