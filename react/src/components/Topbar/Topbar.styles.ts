import { type SxProps, type Theme } from "@mui/material";

export const topBarButton = (item: any, path: any): SxProps<Theme> => ({
  color: item.path == path ? "rgb(0, 0, 80)" : "white",
  "&:focus": {
    outline: 0,
  },
});

export const loginButton: SxProps<Theme> = {
  backgroundColor: "rgba(0, 230, 0, 0.95)",
  color: "white",
  marginLeft: 1,
};

export const logoutButton: SxProps<Theme> = {
  backgroundColor: "rgba(230, 0, 0, 0.95)",
  color: "white",
  marginLeft: 1,
};
