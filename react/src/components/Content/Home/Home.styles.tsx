import type { SxProps, Theme } from "@mui/material";

export const body: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    padding: 1,
    width: "100%",
    overflowX: "clip",
    alignItems: "start",
}

export const titleBox: SxProps<Theme> = {
    paddingTop: 2.25,
    paddingLeft: 1.25,
}

export const otherBoxes: SxProps<Theme> = {
    paddingTop: 1.25,
    paddingLeft: 1.25,
    "& > div": {
        padding: 1.75,
        paddingTop: 1
    }
}