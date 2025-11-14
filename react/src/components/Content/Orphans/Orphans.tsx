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
  removePackageFromRepository,
  uploadFileToFolder,
} from "../../../services/dataService/dataService";
import { getBackendHealth } from "../../../services/infoService";
import {
  type OrphanedFile,
  type OrphanedPackage,
} from "../../../services/dataService/dataService.types";
import { type EnvWindow } from "../../../services/services.types";
import { useNavigate } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { LoadingSpinner, SearchResultsNotes } from "../Details/SearchResultsNotes/SearchResultsNotes";
import LaunchIcon from "@mui/icons-material/Launch";
import { FileInput } from "../Details/FileInput/FileInput";
import { ErrorBar } from "../Details/ErrorBar";
import { AuthenticatedTemplate } from "@azure/msal-react";

const PERMITTED_FILE_ENDING: string =
  (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

export function Orphans() {
  const [fileOrphans, setFileOrphans] = useState<OrphanedFile[]>([]);
  const [pkgeOrphans, setPkgeOrphans] = useState<OrphanedPackage[]>([]);

  const [poSearch, setPoSearch] = useState("");
  const updatePoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setPoSearch(e.target.value);
  };

  const [foSearch, setFoSearch] = useState("");
  const updateFoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setFoSearch(e.target.value);
  };

  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [healthResponse, setHealthResponse] = useState<string>("");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchData = async () => {
    getBackendHealth().then(async (val) => {
      setHealthResponse(val);
      if (val == "Alive and Well!") {
        const o_f = await getOrphanedFiles();
        setFileOrphans(o_f);
        const o_p = await getOrphanedPackages();
        setPkgeOrphans(o_p);
        setIsBackendHealthy(true);
        setIsDataLoading(false)
      } else setIsBackendHealthy(false);
    });
  };

  const navigateToPackage = (o: OrphanedPackage) => {
    const rep_path = o.repository[0].split(".")[0];
    navigate(`/Packages/${rep_path}#${o.name}`);
  };

  const clearFoSearch = () => setFoSearch("");
  const clearPoSearch = () => setPoSearch("");

  const deleteOrphanedFile = async (o: OrphanedFile) => {
    const prompt = "Do you want to delete the orphaned file " + o.name + "?";
    if (prompt) {
      await removeFileFromFolder(o.directory, o.name);
      await fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrphanedFile = async (o: OrphanedFile) => {
    await addPackageToRepository(o.name, o.directory, -1);
    await fetchData();
  };

  const removeOrphanedPackage = async (o: OrphanedPackage) => {
    const prompt = "Do you want to delete the orphaned package " + o.name + "?";
    if (prompt) {
      await removePackageFromRepository(o.name, o.repository[0]);
      await fetchData();
    }
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
      <ErrorBar open={!isBackendHealthy} response={healthResponse} />
      <Box sx={o_styles.wrapper}>
        <AuthenticatedTemplate>
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
                  {!isDataLoading && fileOrphans.map(
                    (o) =>
                      (o.name.includes(foSearch) || foSearch.length == 0) && (
                        <TableRow
                          key={`${o.directory.replace(
                            PERMITTED_FILE_ENDING,
                            ""
                          )}-${o.name}`}
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
                  <SearchResultsNotes
                    allResults={fileOrphans}
                    searchField={foSearch}
                    isLoading={isDataLoading}
                    onEmpty="No Orphans"
                    onNoMatch="No Match"
                  />
                </TableBody>
              </Table>
              <LoadingSpinner isLoading={isDataLoading} />
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
                {!isDataLoading && pkgeOrphans.map(
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
                <SearchResultsNotes
                  allResults={pkgeOrphans}
                  searchField={poSearch}
                  isLoading={isDataLoading}
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
            <LoadingSpinner isLoading={isDataLoading} />

          </Box>
        </AuthenticatedTemplate>
      </Box>
    </Box>
  );
}

function UploadFileDialog({ open, pkge, onClose }: UploadFileDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSave = async () => {
    if (file)
      await uploadFileToFolder(
        pkge.repository[0].replace(PERMITTED_FILE_ENDING, ""),
        file
      );
    onClose();
  };

  const handleRemove = async () => {
    setFile(null);
  };

  useEffect(() => {
    if (file != null) setIsDisabled(false);
    else setIsDisabled(true);
  }, [file]);

  useEffect(() => {
    if (open) setIsDisabled(true);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box sx={o_styles.dialogueWrapper}>
        <Box sx={o_styles.dialogueTitleWrapper}>
          <Typography variant="h6">{pkge.name}</Typography>
          <Tooltip title="Close">
            <ClearIcon sx={styles.clickButtonBig} onClick={onClose} />
          </Tooltip>
        </Box>
        <Box>
          <FileInput
            accept=".rpm"
            file={file}
            setFile={setFile}
            removeFile={handleRemove}
          />
        </Box>
        <Box sx={o_styles.dialogueButtonWrapper}>
          <Button variant="outlined" disabled={isDisabled} onClick={handleSave}>
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
