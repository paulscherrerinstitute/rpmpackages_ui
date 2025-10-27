import {
  Box,
  Table,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as styles from "../Content.styles";
import * as o_styles from "./Orphans.styles";
import { useState, useEffect, useRef } from "react";
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

  const [poSearch, setPoSearch] = useState("");
  const updatePoSearch = (e: React.ChangeEvent<any>) => {
    if (e.target && e.target.value) {
      setPoSearch(e.target.value);
    } else setPoSearch("");
  };

  const [foSearch, setFoSearch] = useState("");
  const updateFoSearch = (e: React.ChangeEvent<any>) => {
    if (e.target && e.target.value) {
      setFoSearch(e.target.value);
    } else setFoSearch("");
  };

  const navigate = useNavigate();

  const fetchData = async () => {
    const o_f = await getOrphanedFiles();
    setFileOrphans(o_f);
    const o_p = await getOrphanedPackages();
    setPkgeOrphans(o_p);
  };

  const navigateToPackage = (o: OrphanedPackage) => {
    const rep_path = o.repository[0].split(".")[0];
    navigate(`/Packages/${rep_path}#${o.name}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box component="main" sx={styles.main}>
      {poSearch}
      <Box sx={o_styles.wrapper}>
        <Box>
          <Box>
            <Typography variant="h6">
              File Orphans (No Package within Repos associated )
            </Typography>
            <TextField
              variant="standard"
              value={foSearch}
              onChange={updateFoSearch}
            />
          </Box>
          <Box>
            <Table>
              {fileOrphans.map(
                (o) =>
                  (o.name.includes(foSearch) || foSearch.length == 0) && (
                    <TableRow hover>
                      <TableCell>
                        {o.name} - {o.directory}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </Table>
          </Box>
        </Box>
        <Box>
          <Box>
            <Typography variant="h6">
              Package Orphans (No file associated)
            </Typography>
            <TextField
              variant="standard"
              value={poSearch}
              onChange={updatePoSearch}
            />
          </Box>
          <Table>
            {pkgeOrphans.map(
              (o) =>
                (o.name.includes(poSearch) || poSearch.length == 0) && (
                  <TableRow hover onClick={() => navigateToPackage(o)}>
                    <TableCell>
                      {o.name} - {o.repository}
                    </TableCell>
                  </TableRow>
                )
            )}
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
