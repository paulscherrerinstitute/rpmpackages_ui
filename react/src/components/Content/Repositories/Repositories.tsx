import { Box, Typography, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { getAvailableRepos } from "../../../helper/dataService";
import * as styles from "../Content.styles";

export function Repositories() {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const repos = await getAvailableRepos();
      setAvailableRepos(repos);
    };
    fetchData();
  }, []);

  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <Typography>Repositories</Typography>
      <Box sx={styles.body}>
        <ul>
          <span>REPOS:</span>
          {availableRepos.map((item) => (
            <li>{item.split(".")[0]}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
