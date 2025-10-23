import { Box, Table, TableCell, TableRow, Typography } from "@mui/material";
import * as styles from "../Content.styles";
import * as o_styles from "./Orphans.styles";
import { useState, useEffect } from "react";
import {
  getOrphanedFiles,
  getOrphanedPackages,
} from "../../../helper/dataService";

export function Orphans() {
  const [fileOrphans, setFileOrphans] = useState<string[]>([]);
  const [pkgeOrphans, setPkgeOrphans] = useState<string[]>([]);

  const fetchData = async () => {
    setFileOrphans(await getOrphanedFiles());
    setPkgeOrphans(await getOrphanedPackages());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box component="main" sx={styles.main}>
      <Box sx={o_styles.wrapper}>
        <Box>
          <Typography variant="h6">File Orphans (No Package within Repos associated )</Typography>
          <Box>
            <Table>
              {fileOrphans.map((o) => (
                <TableRow>
                  <TableCell>{o}</TableCell>
                </TableRow>
              ))}
            </Table>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">Package Orphans (No file associated)</Typography>
          <Table>
            {pkgeOrphans.map((o) => (
              <TableRow>
                <TableCell>{o}</TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
