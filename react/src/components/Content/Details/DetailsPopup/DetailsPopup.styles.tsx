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

export const fileMessage: SxProps<Theme> = {
  "& > *": {
    display: "flex",
    justifyContent: "center",
    marginInline: 20,
    marginTop: 3,
  },
};

export const noFile: SxProps<Theme> = {
  backgroundColor: "rgba(255, 0, 0, 0.2)",
};

export const isFile: SxProps<Theme> = {
  backgroundColor: "rgba(0, 255, 0, 0.2)"
}
