import { type SxProps, type Theme } from "@mui/material";

export const wrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 2,
};

export const existWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  "& > *":{
    marginInline: 2
  }
};
