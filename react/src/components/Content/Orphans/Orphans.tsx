import { Box, Table, TableCell, TableRow, Typography } from "@mui/material";
import * as styles from "../Content.styles";
import * as o_styles from "./Orphans.styles";
import { useState, useEffect } from "react";
import {
  getOrphanedFiles,
  getOrphanedPackages,
  type OrphanedFile,
  type OrphanedPackage,
} from "../../../helper/dataService";
import { useNavigate } from "react-router-dom";

export function Orphans() {
  const [fileOrphans, setFileOrphans] = useState<OrphanedFile[]>([]);
  const [pkgeOrphans, setPkgeOrphans] = useState<OrphanedPackage[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const o_f = await getOrphanedFiles();
    setFileOrphans(o_f);
    const o_p = await getOrphanedPackages();
    setPkgeOrphans(o_p);
  };

  const navigateToPackage = (o: OrphanedPackage) =>{
    const rep_path = o.repository[0].split(".")[0]
    navigate(`/Packages/${rep_path}#${o.name}`)
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box component="main" sx={styles.main}>
      <Box sx={o_styles.wrapper}>
        <Box>
          <Typography variant="h6">
            File Orphans (No Package within Repos associated )
          </Typography>
          <Box>
            <Table>
              {fileOrphans.map((o) => (
                <TableRow hover>
                  <TableCell>
                    {o.name} - {o.directory}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">
            Package Orphans (No file associated)
          </Typography>
          <Table>
            {pkgeOrphans.map((o) => (
              <TableRow hover onClick={() => navigateToPackage(o)}>
                <TableCell>
                  {o.name} - {o.repository}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
