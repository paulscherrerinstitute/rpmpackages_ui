import {
  Box,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as styles from "../../Content.styles";
import * as ap_styles from "./AllPackages.styles";
import { useEffect, useState } from "react";
import {
  getAllUniquePackagesOverAll,
  getFileFromFolderForPackage,
  getFoldersIncludingFileForPackage,
  getPackageInformation,
  getRepositoriesOfPackage,
  removePackageFromRepository,
  renameFileInFolder,
  updatePackageInRepository,
} from "../../../../services/dataService";
import { type EnvWindow, NONE, EMPTY } from "../../../../services/dataService.types";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add"
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { AddRepositoryPopup } from "../../Details/AddRepository/AddRepository";
import {
  type DetailsForm,
} from "../../Details/DetailsPopup/DetailsPopup";
import AllPackagesFileInput from "../../Details/AllPackagesFileInput/AllPackagesFileInput";
import { LoadingSpinner, SearchResultsNotes } from "../../Details/SearchResultsNotes/SearchResultsNotes";

const PERMITTED_FILE_ENDING: string =
  (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

export default function AllPackages() {
  const [data, setData] = useState<string[]>([]);
  const [inclusionsInRepositories, setinclusionsInRepositories] = useState<
    string[]
  >([]);
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState(false);
  const [pkge, setPkge] = useState("");
  const [inclusionsInDirectories, setInclusionsInDirectories] = useState<
    string[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [displayInput, setDisplayInput] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const resultData = await getAllUniquePackagesOverAll();
    setData(resultData.sort((a, b) => a.localeCompare(b)));
    setIsDataLoading(false);
  };

  const fetchRepositoryInclusionData = async (pk: string) => {
    const resultData = await getRepositoriesOfPackage(pk);
    setinclusionsInRepositories(resultData);
  };

  const openPopup = (pk: string) => {
    setOpen(true);
    setPkge(pk);
    fetchRepositoryInclusionData(pk);
  };

  const handleClose = () => setOpen(false);

  const handleNestedClose = () => {
    setOpenNested(false);
    fetchRepositoryInclusionData(pkge);
  };

  const handleAdd = () => setOpenNested(true);

  const handleRemoveAll = async () => {
    const prompt = confirm(
      `Do you want to remove ${pkge} from all repositories it is contained in?`
    );
    if (prompt) {
      inclusionsInRepositories.forEach(async (it) => {
        await removePackageFromRepository(pkge, it);
      });
      handleClose();
    }
    await fetchData();
  };

  const handleRemove = async (repo: string) => {
    const prompt = confirm(`Do you want to remove ${pkge} from ${repo}?`);
    if (prompt) {
      await removePackageFromRepository(pkge, repo);
    }
    fetchRepositoryInclusionData(pkge);
  };

  const fetchInclusionsInDirectories = async () => {
    if (pkge) {
      const inclDirectories = await getFoldersIncludingFileForPackage(pkge);
      setInclusionsInDirectories(inclDirectories);
    }
  };

  const fetchFile = async () => {
    setIsFileLoading(true);
    if (inclusionsInDirectories.length > 0) {
      const pk = await getFileFromFolderForPackage(
        inclusionsInDirectories[0],
        pkge
      );
      setFile(pk);
    }
    setIsFileLoading(false)
  };

  const updatedPackage = async () => {
    await fetchFile();
    await fetchInclusionsInDirectories();
  };

  useEffect(() => {
    fetchData();
    fetchInclusionsInDirectories();
  }, []);

  useEffect(() => {
    if (inclusionsInRepositories.length == 0) {
      setOpen(false);
    }
    fetchData();
    fetchFile();
  }, [inclusionsInRepositories]);

  useEffect(() => {
    fetchInclusionsInDirectories();
    if (open) fetchFile();
  }, [open, pkge]);

  useEffect(() => {
    setDisplayInput(
      inclusionsInDirectories.length != inclusionsInRepositories.length
    );
  }, [inclusionsInDirectories]);

  const [packageSearch, setPackageSearch] = useState("");
  const updatePackageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setPackageSearch(e.target.value);
  };

  const clearPackageSearch = () => setPackageSearch("");
  const mapDataForSearchResults = (arr: string[]) => {
    const mapped = arr.map((f) => {
      return {
        name: f,
      };
    });
    return mapped;
  };

  return (
    <Box sx={styles.main}>
      <Box sx={ap_styles.body}>
        <Box sx={ap_styles.titleWrapper}>
          <Typography variant="h5">All Packages</Typography>
          <Box sx={ap_styles.searchWrapper}>
            <TextField
              variant="standard"
              value={packageSearch}
              onChange={updatePackageSearch}
              label="Search Packages"
            />
            <Tooltip title="Clear search">
              <ClearIcon
                onClick={clearPackageSearch}
                sx={styles.clickButtonBig}
              />
            </Tooltip>
          </Box>
        </Box>
        <Table>
          <TableBody>
            {!isDataLoading && data.map(
              (pkge, i) =>
                (pkge.includes(packageSearch) || packageSearch.length == 0) && (
                  <TableRow key={`${pkge}-${i}`} hover>
                    <TableCell>
                      <Typography
                        sx={styles.clickButton}
                        key={pkge}
                        onClick={() => openPopup(pkge)}
                      >
                        {pkge}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
            )}
            <SearchResultsNotes
              allResults={mapDataForSearchResults(data)}
              searchField={packageSearch}
              isLoading={isDataLoading}
              onEmpty="No packages found in any repository"
              onNoMatch="No Match"
              onEmptyColor="rgba(255, 0, 0, 0.05)"
            />
          </TableBody>
        </Table>
        <LoadingSpinner isLoading={isDataLoading} />
      </Box>
      {/* Parent Dialog */}
      <AllPackagesDetailsDialog
        open={open}
        pkge={pkge}
        handleClose={handleClose}
        handleAdd={handleAdd}
        handleRemove={handleRemove}
        handleRemoveAll={handleRemoveAll}
        inclusionsInDirectories={inclusionsInDirectories}
        inclusionsInRepositories={inclusionsInRepositories}
        fileInputElement={
          <>
            {isFileLoading ? <Box sx={{ padding: 3 }}>
              <LoadingSpinner isLoading={isFileLoading} />
            </Box>
              :
              <AllPackagesFileInput
                fileIncludedIn={inclusionsInDirectories}
                packageIncludedIn={inclusionsInRepositories}
                displayInput={displayInput}
                file={file}
                setFile={setFile}
                updatePackages={updatedPackage}
              />}

          </>
        }
      />
      {/* Nested Dialog for adding a package to a repository */}
      <AddRepositoryPopup
        open={openNested}
        handleClose={handleNestedClose}
        item={pkge}
        inclusions={inclusionsInRepositories}
      />
    </Box>
  );
}

function AllPackagesDetailsDialog(
  {
    open,
    pkge,
    handleClose,
    handleAdd,
    handleRemove,
    handleRemoveAll,
    inclusionsInRepositories,
    inclusionsInDirectories,
    fileInputElement
  }
    :
    {
      open: boolean,
      pkge: string,
      handleClose: () => void,
      handleAdd: () => void,
      handleRemove: (repo: string) => void,
      handleRemoveAll: () => void,
      inclusionsInRepositories: string[],
      inclusionsInDirectories: string[],
      fileInputElement: React.ReactElement,
    }
) {
  const [formData, setFormData] = useState<DetailsForm>(EMPTY)
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pkgeTitle, setPkgeTitle] = useState<string>("");
  const [displayTitle, setDisplayTitle] = useState<boolean>(true);

  async function fetchPackageInformation() {
    if (inclusionsInRepositories[0] != undefined) {
      setIsLoading(false);
      return await getPackageInformation(inclusionsInRepositories[0].replace(PERMITTED_FILE_ENDING, ""), pkge)
    }
  }

  useEffect(() => {
    if (open) {
      setFormData(NONE)
      setIsLoading(true);
    }
    if (inclusionsInRepositories[0]) {
      fetchPackageInformation().then((val) => {
        if (val) { setFormData(val); }
      }).catch(() => {
        setFormData(NONE)
        setIsLoading(false);
      })
    }
    if (pkge) setPkgeTitle(pkge);
  }, [inclusionsInRepositories, pkge, open])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPkgeTitle(value);
  }

  const saveTitleChange = async () => {
    if (inclusionsInRepositories[0]) {

      setFormData((prevState) => ({
        ...prevState,
        ["file_name"]: pkgeTitle
      }))
      setDisplayTitle(true);

      inclusionsInRepositories.forEach(async (val) => {
        const repo_path = `${val}`;
        await updatePackageInRepository(pkge, pkgeTitle, repo_path);
        await renameFileInFolder(pkge, pkgeTitle, repo_path.replace(PERMITTED_FILE_ENDING, ""));
      })
    }
  }

  const discardTitleChange = () => {
    setDisplayTitle(true);
    setPkgeTitle(pkge)
  }

  return (<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
    <Box sx={styles.packageTitle}>
      {displayTitle ?
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1vw", paddingInline: 2 }}>
            <Box>
              {pkgeTitle}
            </Box>
            <Tooltip title="Edit filename">
              <EditIcon fontSize="small" sx={styles.clickButtonBig} onClick={() => setDisplayTitle(!displayTitle)} />
            </Tooltip>
          </Box>
        </> :
        <Box sx={{ display: "flex", alignItems: "center", gap: "1vw", paddingInline: 2 }}>
          <TextField
            sx={{ width: (pkgeTitle.length * 9) }}
            onChange={handleTitleChange}
            value={pkgeTitle}
            size="small"
          />
          <Tooltip title="Save Changed Title">
            <DoneIcon sx={styles.clickButtonBig} onClick={saveTitleChange} />
          </Tooltip>
          <Tooltip title="Discard changed title">
            <ClearIcon sx={styles.clickButtonBig} onClick={discardTitleChange} />
          </Tooltip>
        </Box>
      }
      <Box sx={ap_styles.dialogIcons}>
        <Tooltip title="Add to other repository">
          <AddIcon onClick={handleAdd} />
        </Tooltip>
        <Tooltip title="Delete in all repositories">
          <DeleteOutlineIcon onClick={handleRemoveAll} />
        </Tooltip>
        <Tooltip title="Close">
          <ClearIcon onClick={handleClose} />
        </Tooltip>
      </Box>
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ "& > th": { fontWeight: "bold" } }}>
            <TableCell>Name</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Release</TableCell>
            <TableCell>Arch</TableCell>
            <TableCell>Operating System</TableCell>
            <TableCell>Packager</TableCell>
            <TableCell>Summary</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell> {formData?.name ?? "None"} </TableCell>
            <TableCell> {formData?.version ?? "None"} </TableCell>
            <TableCell> {formData?.release ?? "None"} </TableCell>
            <TableCell> {formData?.arch ?? "None"} </TableCell>
            <TableCell> {formData?.os ?? "None"} </TableCell>
            <TableCell> {formData?.packager ?? "None"} </TableCell>
            <TableCell> {formData?.summary ?? "None"} </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <LoadingSpinner isLoading={isLoading} />
    </Box>
    {inclusionsInRepositories.length > 0 && (
      <Box>
        <DialogTitle>This package is included in:</DialogTitle>
        <Table>
          <TableBody>
            {inclusionsInRepositories.map((i) => (
              <TableRow
                hover
                key={"included-" + i}
                sx={ap_styles.packageRow}
              >
                <TableCell>
                  <Typography
                    sx={styles.clickButton}
                    onClick={() =>
                      navigate(
                        `/Packages/${i.replace(PERMITTED_FILE_ENDING, "")}`
                      )
                    }
                  >
                    {i}
                  </Typography>
                </TableCell>
                <TableCell
                  colSpan={2}
                  sx={ap_styles.tableFileStatusWrapper}
                >
                  {Array.isArray(inclusionsInDirectories) &&
                    !inclusionsInDirectories.includes(
                      i.replace(PERMITTED_FILE_ENDING, "")
                    ) && <Box sx={ap_styles.noFile}>No File detected.</Box>}
                  {Array.isArray(inclusionsInDirectories) &&
                    inclusionsInDirectories.includes(
                      i.replace(PERMITTED_FILE_ENDING, "")
                    ) && <Box sx={ap_styles.isFile}>File detected.</Box>}
                  <Tooltip
                    sx={styles.clickButtonBig}
                    title="Delete from this repository"
                  >
                    <DeleteOutlineIcon onClick={() => handleRemove(i)} />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>)}
    {fileInputElement}
  </Dialog>
  );
}