import {
  Box,
  Typography,
  Toolbar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAvailableRepos } from "../../../helper/dataService";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";

export function Repositories() {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const repos = await getAvailableRepos();
      setAvailableRepos(repos);
    }
    fetchData();
  }, []);

  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <Typography>Repositories:</Typography>
      <Box sx={styles.body}>
        <List>
          {availableRepos.map((item) => (
            <ListItem key={`repos-${item}`}
              onClick={() => navigate(`/Packages/${item.split(".")[0]}`)}
            >
              <ListItemText sx={styles.innerList}>
                - {item.split(".")[0]}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
