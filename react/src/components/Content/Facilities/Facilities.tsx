import { Box, Typography, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { getAvailableRepos } from "../../../helper/read_data";
import * as styles from "../Content.styles"

export function Facilities() {

  const [availableRepos, setAvailableRepos] = useState<string[]>([]);

  useEffect(() => {
    setAvailableRepos(getAvailableRepos());
  }, [])


  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <Typography>Facilities</Typography>
      <Box sx={styles.body}>
        <ul>
          <span>REPOS:</span>
          {availableRepos.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
