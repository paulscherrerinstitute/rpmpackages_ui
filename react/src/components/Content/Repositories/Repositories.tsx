import {
  Box,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllRepositories } from "../../../helper/dataService";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";
import * as r_styles from "./Repositories.styles";
import ClearIcon from "@mui/icons-material/Clear";

export function Repositories() {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const repos = await getAllRepositories();
      setAvailableRepos(repos);
    }
    fetchData();
  }, []);

  const [repoSearch, setRepoSearch] = useState("");
  const updateRepoSearch = (e: React.ChangeEvent<any>) => {
    if (e.target && e.target.value) {
      setRepoSearch(e.target.value);
    } else setRepoSearch("");
  };

  const clearRepoSearch = () => setRepoSearch("");

  return (
    <Box component="main" sx={styles.main}>
      <Box sx={r_styles.body}>
        <Box sx={r_styles.titleWrapper}>
          <Typography variant="h5">Available Repositories</Typography>
          <Box sx={r_styles.searchWrapper}>
            <TextField
              variant="standard"
              value={repoSearch}
              onChange={updateRepoSearch}
              label="Search Packages"
            />
            <Tooltip title="Clear search">
              <ClearIcon onClick={clearRepoSearch} sx={styles.clickButtonBig} />
            </Tooltip>
          </Box>
        </Box>
        <Table>
          <TableBody>
            {availableRepos.map(
              (item) =>
                (item.includes(repoSearch) || repoSearch.length == 0) && (
                  <TableRow
                    hover
                    key={`repos-${item}`}
                    onClick={() => navigate(`/Packages/${item.split(".")[0]}`)}
                  >
                    <TableCell sx={styles.clickButton}>
                      {item.split(".")[0]}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
