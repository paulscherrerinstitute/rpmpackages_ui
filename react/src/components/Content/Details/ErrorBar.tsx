import { Snackbar, SnackbarContent, Box } from "@mui/material";

export function ErrorBar({ open }: { open: boolean }) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box sx={{backgroundColor: "white", borderRadius: "4px"}}>
        <SnackbarContent
          style={{
            backgroundColor: "rgba(255, 0, 0, 0.5)",
          }}
          message={<span>Backend not reachable!</span>}
        ></SnackbarContent>
      </Box>
    </Snackbar>
  );
}
