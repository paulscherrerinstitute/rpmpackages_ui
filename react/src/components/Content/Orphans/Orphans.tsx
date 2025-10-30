import {
  Box,
  Button,
  Dialog,
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
  removeFileFromFolder,
  addPackageToRepository,
  type OrphanedFile,
  type OrphanedPackage,
  removePackageFromRepository,
  uploadFileToFolder,
} from "../../../helper/dataService";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { SearchResultsEmpty } from "../Details/SearchResultsEmpty/SearchResultsEmpty";
import LaunchIcon from "@mui/icons-material/Launch";
import { FileInput } from "../Details/FileInput/FileInput";
import { permittedFileEnding } from "../../helpers/NavbarHelper";

export function Orphans() {
  const [fileOrphans, setFileOrphans] = useState<OrphanedFile[]>([]);
  const [pkgeOrphans, setPkgeOrphans] = useState<OrphanedPackage[]>([]);

  const [poSearch, setPoSearch] = useState("");
  const updatePoSearch = (e: React.ChangeEvent<any>) => {
    if (e.target) setPoSearch(e.target.value);
  };

  const [foSearch, setFoSearch] = useState("");
  const updateFoSearch = (e: React.ChangeEvent<any>) => {
    if (e.target) setFoSearch(e.target.value);
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
    await removeFileFromFolder(o.directory, o.name);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrphanedFile = async (o: OrphanedFile) => {
    await addPackageToRepository(o.name, o.directory, -1);
    await fetchData();
  };

  const removeOrphanedPackage = async (o: OrphanedPackage) => {
    await removePackageFromRepository(o.name, o.repository[0]);
    await fetchData();
  };

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pkge, setPkge] = useState<OrphanedPackage>({
    name: "",
    repository: [],
  });

  const openOrphanedPackageDialog = (o: OrphanedPackage) => {
    setOpenDialog(true);
    setPkge(o);
  };

  const closeOrphanedPackageDialog = async () => {
    setOpenDialog(false);
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
                      <TableRow
                        key={`${o.directory.replace(permittedFileEnding, "")}-${
                          o.name
                        }`}
                        hover
                      >
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
                  ((o.name.includes(poSearch) && poSearch.length > 0) ||
                    poSearch.length == 0) && (
                    <TableRow key={`${o.repository}-${o.name}`} hover>
                      <TableCell>{o.name}</TableCell>
                      <TableCell>{o.repository}</TableCell>
                      <TableCell sx={o_styles.packageOrphanIcons}>
                        <Tooltip title="Open in repository">
                          <LaunchIcon
                            sx={styles.clickButtonBig}
                            onClick={() => navigateToPackage(o)}
                          />
                        </Tooltip>
                        <Tooltip title="Add file">
                          <AddIcon
                            sx={styles.clickButtonBig}
                            onClick={() => openOrphanedPackageDialog(o)}
                          />
                        </Tooltip>
                        <Tooltip title="Remove from repository">
                          <DeleteOutlineIcon
                            sx={styles.clickButtonBig}
                            onClick={() => removeOrphanedPackage(o)}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
              )}
              <SearchResultsEmpty
                allResults={pkgeOrphans}
                searchField={poSearch}
                onEmpty="No Orphans"
                onNoMatch="No Match"
              />
              <UploadFileDialog
                open={openDialog}
                pkge={pkge}
                onClose={closeOrphanedPackageDialog}
              />
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

function UploadFileDialog({ open, pkge, onClose }: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleSave = async () => {
    if (file)
      await uploadFileToFolder(
        pkge.repository[0].replace(permittedFileEnding, ""),
        file
      );
    onClose();
  };

  const handleRemove = async () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box sx={o_styles.dialogueWrapper}>
        <Box>
          <Typography variant="h6">{pkge.name}</Typography>
        </Box>
        <Box>
          <FileInput
            accept=".rpm"
            file={file}
            setFile={setFile}
            removeFile={handleRemove}
          />
        </Box>
        <Box>
          <Button variant="contained" onClick={handleSave}>
            Add
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

type UploadFileDialogProps = {
  open: boolean;
  pkge: OrphanedPackage;
  onClose: () => void;
};
