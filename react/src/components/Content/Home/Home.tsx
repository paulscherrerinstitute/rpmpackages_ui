import { Box, Typography, Toolbar } from "@mui/material";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  const URL = "SERVERNAME";
  const GITHUB_URL = "https://github.com/paulscherrerinstitute/rpmpackages_ui"

  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <h2>Home</h2>
      <Box>
        <Box>
          <h3 onClick={() => navigate("/Repositories")}>Repositories</h3>
          <Typography>
            All repositories on {URL} are shown here. By clicking on it, you can
            edit the repositories and its packages.
          </Typography>
        </Box>
        <Box>
          <h3 onClick={() => navigate("/Packages")}>Packages</h3>
          <Typography>
            All Packages that exist on {URL} - by pressing on them, you can view
            details and in which repositories they are.
          </Typography>
        </Box>
      </Box>
      <Box>
        <h2>Documentation</h2>
        <Typography>
          The Documentation is located{" "}
          <a href={GITHUB_URL}>
            here
          </a>
          .
        </Typography>
        <Box>
          <h2>Acknoledgements</h2>
          <Typography>
            This application was developed by Yannick Wernle.
          </Typography>
          <Typography> © Paul Scherrer Institute 2025</Typography>
        </Box>
      </Box>
    </Box>
  );
}
