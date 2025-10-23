import { type SxProps, type Theme } from "@mui/material";

export const wrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  marginTop: 1,
  width: "100%",
  overflowX: "clip",
  "& > div":{
    marginBlock: 2
  }
};
