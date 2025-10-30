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

export const selectWrapper: SxProps<Theme> = {
  padding: 1,
  "& > *": {
    marginBlock: 2
},
};
