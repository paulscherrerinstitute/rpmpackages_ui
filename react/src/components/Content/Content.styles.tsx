import { type SxProps, type Theme } from "@mui/material";

export const body: SxProps<Theme> = {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow:"hidden"
}

export const main: SxProps<Theme> = {
    display: "flex",
    flexDirection: "column",
    padding: 2,
    marginTop: "5vw",
    width: "100%",
    overflowX: "clip"
}

export const outerList: SxProps<Theme> = {
    width: "100%",
    justifyContent: "center",
    
}