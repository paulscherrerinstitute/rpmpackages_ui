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

export const fileMessage: SxProps<Theme> = {
  "& > *": {
    display: "flex",
    justifyContent: "center",
    marginInline: 20,
  },
  marginBlock: 2
};

export const noFile: SxProps<Theme> = {
  backgroundColor: "rgba(255, 0, 0, 0.2)",
};

export const isFile: SxProps<Theme> = {
  backgroundColor: "rgba(0, 255, 0, 0.2)"
}

export const isFileSave: SxProps<Theme> = {
  backgroundColor: "rgba(255, 150, 0, 0.2)"
}