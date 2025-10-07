import { Box, Typography, Toolbar } from "@mui/material";
import * as styles from "../Content.styles";

export function Home() {
  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <Typography>
        Home
      </Typography>
    </Box>
  );
}