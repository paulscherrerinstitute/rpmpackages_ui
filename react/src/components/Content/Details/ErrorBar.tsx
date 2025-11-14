import { Snackbar, SnackbarContent, Box } from "@mui/material";
import type React from "react";

export function ErrorBar({ open, response }: { open: boolean, response: string }) {

  function getMessage(): React.ReactNode {
    if (response == "Unauthenticated") return "Unauthorized: Reload and login again"
    else return "Backend not reachable!"
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box sx={{ backgroundColor: "white", borderRadius: "4px" }}>
        <SnackbarContent
          style={{
            backgroundColor: "rgba(255, 0, 0, 0.5)",
          }}
          message={<span>{getMessage()}</span>}
        ></SnackbarContent>
      </Box>
    </Snackbar>
  );
}
