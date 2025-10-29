import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as styles from "../Content.styles";
import * as o_styles from "./Orphans.styles";
import { useState, useEffect } from "react";
import {
  getOrphanedFiles,
  getOrphanedPackages,
  removeFileFromDirectory,
  addPackageToRepository,
  type OrphanedFile,
  type OrphanedPackage,
} from "../../../helper/dataService";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { SearchResultsEmpty } from "../Details/SearchResultsEmpty/SearchResultsEmpty";

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

  const clearFoSearch = () => setFoSearch("");
  const clearPoSearch = () => setPoSearch("");

  const deleteOrphanedFile = async (o: OrphanedFile) => {
    await removeFileFromDirectory(o.directory, o.name);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrphanedFile = async (o: OrphanedFile) => {
    await addPackageToRepository(o.name, o.directory, -1);
    await fetchData();
  };

  return (
    <Box component="main" sx={styles.main}>
      <Box sx={o_styles.wrapper}>
        <Box>
          <Box sx={o_styles.titleWrapper}>
            <Typography variant="h6">
              File Orphans (No associated package within any repository)
            </Typography>
            <Box sx={o_styles.searchWrapper}>
              <TextField
                variant="standard"
                value={foSearch}
                onChange={updateFoSearch}
                label="Search File Orphans"
              />
              <Tooltip title="Clear search">
                <ClearIcon onClick={clearFoSearch} />
              </Tooltip>
            </Box>
          </Box>
          <Box>
            <Table>
              <TableBody>
                {fileOrphans.map(
                  (o) =>
                    (o.name.includes(foSearch) || foSearch.length == 0) && (
                      <TableRow key={o.name} hover>
                        <TableCell>{o.name}</TableCell>
                        <TableCell>{o.directory}</TableCell>
                        <TableCell sx={o_styles.fileOrphanIcons}>
                          <Tooltip title="Add Orphaned File to repository">
                            <AddIcon onClick={() => addOrphanedFile(o)} />
                          </Tooltip>
                          <Tooltip title="Delete Orphaned file completely">
                            <DeleteOutlineIcon
                              onClick={() => deleteOrphanedFile(o)}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                )}
                <SearchResultsEmpty
                  allResults={fileOrphans}
                  searchField={foSearch}
                  onEmpty="No Orphans"
                  onNoMatch="No Match"
                />
              </TableBody>
            </Table>
          </Box>
        </Box>
        <Box>
          <Box sx={o_styles.titleWrapper}>
            <Typography variant="h6">
              Package Orphans (No associated file to a package in a repository)
            </Typography>
            <Box sx={o_styles.searchWrapper}>
              <TextField
                variant="standard"
                value={poSearch}
                onChange={updatePoSearch}
                label="Search Package Orphans"
              />
              <Tooltip title="Clear search">
                <ClearIcon onClick={clearPoSearch} />
              </Tooltip>
            </Box>
          </Box>
          <Table>
            <TableBody>
              {pkgeOrphans.map(
                (o) =>
                  (o.name.includes(poSearch) || poSearch.length == 0) && (
                    <TableRow
                      key={o.name}
                      hover
                      onClick={() => navigateToPackage(o)}
                    >
                      <TableCell>{o.name}</TableCell>
                      <TableCell>{o.repository}</TableCell>
                    </TableRow>
                  )
              )}
              <SearchResultsEmpty
                allResults={pkgeOrphans}
                searchField={poSearch}
                onEmpty="No Orphans"
                onNoMatch="No Match"
              />
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
