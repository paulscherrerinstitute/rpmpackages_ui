import {
  Box,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllRepositories } from "../../../helper/dataService";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";

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

  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <h2>Available Repositories</h2>
      <Box sx={styles.body}>
        <Table>
          <TableBody>
            {availableRepos.map((item) => (
              <TableRow
                key={`repos-${item}`}
                onClick={() => navigate(`/Packages/${item.split(".")[0]}`)}
              >
                <TableCell sx={styles.clickButton}>
                  {item.split(".")[0]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
