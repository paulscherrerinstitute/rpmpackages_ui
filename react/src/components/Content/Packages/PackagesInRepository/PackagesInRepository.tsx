import {
  Box,
  Button,
  Dialog,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  addPackageToRepository,
  addSubtitlteToRepository,
  getFileFromFolderForPackage,
  getAllPackagesFromRepository,
  movePackageToRepository,
  removeSubtitleFromRepository,
  removeFileFromFolder,
  removePackageFromRepository,
  updatePackageInRepository,
  uploadFileToFolder,
  renameFileInFolder,
} from "../../../../services/dataService";
import { type EnvWindow } from "../../../../services/dataService.types";
import * as styles from "../../Content.styles";
import * as pir_styles from "./PackagesInRepository.styles";
import { useParams } from "react-router-dom";
import {
  DetailsPopup,
  type DetailsForm,
} from "../../Details/DetailsPopup/DetailsPopup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchResultsNotes } from "../../Details/SearchResultsNotes/SearchResultsNotes";

const PERMITTED_FILE_ENDING: string =
  (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

export default function PackagesInRepository() {
  // Display List
  const [data, setData] = useState<string[][]>([]);
  const { path } = useParams();
  const permPath: string = path ?? "";

  let isNotFound;
  if (data.length > 0) isNotFound = data[0][0] == "<!doctype html>";

  // Display Popup
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [pkge, setPkge] = useState<string>("");

  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const [outerIdx, setOuterIdx] = useState<number>(-1);
  const [item, setItem] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleButtonClick = (pk: string) => {
    setPopupOpen(true);
    setIsAdd(false);
    setPkge(pk);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
    fetchData();
  };

  const handleAdd = (it: string[], idx: number) => {
    setPopupOpen(true);
    setPkge("");
    setIsAdd(true);
    setItem(it);
    setOuterIdx(idx);
  };

  const handleSubtitleButtonClick = async () => {
    setAddOpen(true);
  };

  const handleSubtitleClose = () => setAddOpen(false);

  const handleSubtitleAdd = async (newSubtitle: string) => {
    const path = permPath + PERMITTED_FILE_ENDING;
    await addSubtitlteToRepository(path, newSubtitle);
    setAddOpen(false);
    await fetchData();
  };

  const fetchData = async () => {
    try {
      const resultData = await getAllPackagesFromRepository(permPath);
      if (typeof resultData == "string" && resultData == "File not found") {
        setHasError(true);
        setData([]);
      } else {
        setData(resultData);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const fetchFile = async () => {
    try {
      const res = await getFileFromFolderForPackage(permPath, pkge);
      setFile(res);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleSave = async (form: DetailsForm) => {
    let pk: string = "";
    /*
    if (form.versionNote !== "") {
      pk = `${form.name}-${form.version}-${form.versionNote}.${form.distribution}.${form.architecture}.rpm`;
    } else {
      pk = `${form.name}-${form.version}.${form.distribution}.${form.architecture}.rpm`;
    }
    const repo_path = `${permPath}${PERMITTED_FILE_ENDING}`;
    await updatePackageInRepository(pkge, pk, repo_path);
    if (file != null) {
      await uploadFileToFolder(permPath, file);
      await renameFileInFolder(
        pkge,
        pk,
        repo_path.replace(PERMITTED_FILE_ENDING, "")
      );
    }
      */
    alert("PACKAGES_IN_REPOSITORY_SAVE NEEDS ATTENTION")
    await fetchData();
  };

  const handleAddSubmit = async (form: DetailsForm) => {
    let pk: string = "";
    /*
    if (form.versionNote !== "") {
      pk = `${form.name}-${form.version}-${form.versionNote}.${form.distribution}.${form.architecture}.rpm`;
    } else {
      pk = `${form.name}-${form.version}.${form.distribution}.${form.architecture}.rpm`;
    }
    const repo_path = `${permPath}${PERMITTED_FILE_ENDING}`;
    await addPackageToRepository(pk, repo_path, outerIdx);
    */
    alert("PACKAGES_IN_REPOSITORY_SUBMIT NEEDS ATTENTION")
    fetchData();
  };

  useEffect(() => {
    setHasLoaded(false);
    setHasError(false);
    fetchData();
  }, []); // runs once when component mounts

  useEffect(() => {
    const urlHash = window.location.hash;
    if (urlHash.length && !hasLoaded) {
      const element = document.getElementById(urlHash.substring(1));
      if (element) {
        element.scrollIntoView();
        setHasLoaded(true);
        // Cleanup in case of rerenders or navigation
      }
    }
  }, [fetchData]);

  useEffect(() => {
    if (popupOpen) {
      fetchFile();
    }
  }, [popupOpen]);

  const handleRemoveFile = async (file: File) => {
    await removeFileFromFolder(permPath, file.name);
    await fetchFile();
  };

  const [packageSearch, setPackageSearch] = useState("");
  const updatePackageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setPackageSearch(e.target.value);
  };

  const clearPackageSearch = () => setPackageSearch("");


  return (
    <Box sx={styles.main}>
      {permPath.length > 0 && !isNotFound && (
        <Box sx={pir_styles.body}>
          <Box sx={styles.packageTitle}>
            <Typography variant="h5">
              Packages for {permPath.toUpperCase()}
            </Typography>

            {!hasError && (
              <Tooltip title="Add subtitle">
                <Button
                  sx={styles.clickButtonBig}
                  onClick={handleSubtitleButtonClick}
                  variant="outlined"
                >
                  Add Subtitle
                </Button>
              </Tooltip>
            )}
            <Box sx={pir_styles.searchWrapper}>
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
            <SubtitleDialog
              open={addOpen}
              onClose={handleSubtitleClose}
              onAdd={handleSubtitleAdd}
              repoName={permPath}
            />
          </Box>
          {!hasError ?
            <ListPackagesInRepositories
              data={data}
              packageSearch={packageSearch}
              fetchData={fetchData}
              handleAdd={handleAdd}
              handleButtonClick={handleButtonClick}
            />
            :
            <Box sx={pir_styles.errorWrapper}>
              Unexpected Error: The facility "{permPath}" cannot be located.
              Verify that the repository "{permPath}
              {PERMITTED_FILE_ENDING}" exists within the servers configured
              directory: "SOME_DIRECTORY_CONST"
            </Box>
          }
          <DetailsPopup
            open={popupOpen}
            isAdd={isAdd}
            pkge={pkge}
            repository={permPath}
            file={file}
            setFile={(f) => setFile(f)}
            onRemoveFile={(f) => handleRemoveFile(f)}
            onSave={(f) => handleSave(f)}
            onAdd={(f) => handleAddSubmit(f)}
            addProps={{
              data: item,
            }}
            enableFileUpload
            onClose={handleClosePopup}
          />
        </Box>
      )}
      {permPath.length <= 0 && <Box>No Repository has been requested</Box>}
      {isNotFound && (
        <Box>
          The Repository <span style={{ fontWeight: "bold" }}>{permPath}</span>{" "}
          does not exist
        </Box>
      )}
    </Box>
  );
}

function ListPackagesInRepositories(
  {
    data,
    packageSearch,
    fetchData,
    handleAdd,
    handleButtonClick
  }:
    {
      data: string[][],
      packageSearch: string,
      fetchData: () => Promise<void>,
      handleAdd: (it: string[], idx: number) => void,
      handleButtonClick: (pk: string) => void,
    },
) {

  const [dragging, setDragging] = useState<string>("");
  const { path } = useParams();
  const permPath: string = path ?? "";

  const mapPackagesForSearchResults = (arr: string[]) => {
    const mapped = arr.map((f) => {
      return {
        name: f,
      };
    });
    return mapped;
  };

  const shouldShowAnimation = (pkg: string) => {
    const urlHash = window.location.hash.replace("#", "");
    if (pkg == urlHash) return true;
    return false;
  };

  const handleDragStart = (event: React.DragEvent, pk: string) => {
    setDragging(pk);
    const dragPreview = document.createElement("div");
    dragPreview.style.cssText = `
    display: flex;
    align-items: center;
    padding: 10px;
    width: 300px;
    background: rgb(0, 0, 0);
    border-radius: 5px;
    color: white;
    font-weight: bold;
    opacity: 1;
    position: absolute;
    top: -1000px; /* Off-screen */
    left: -1000px;
    pointer-events: none;
    z-index: -1;
    cursor: grab;
    `;

    dragPreview.innerText = pk;
    document.body.appendChild(dragPreview);
    event.dataTransfer.setDragImage(dragPreview, 3, 3);

    setTimeout(() => {
      dragPreview.remove();
    });

    event.currentTarget.addEventListener(
      "dragend",
      () => {
        setDragging("");
      },
      { once: true }
    );
  };

  const handleDragEnter = async (o_idx: number, i_idx: number) => {
    if (dragging != "") {
      await movePackageToRepository(
        dragging,
        permPath + PERMITTED_FILE_ENDING,
        o_idx,
        i_idx
      );
      await fetchData();
    }
  };

  const formatTitle = (title: string) => {
    if (!title) return;
    return title.match("[A-Za-z].*")?.toString().toUpperCase();
  };

  const handleSubtitleRemove = async (directory: string) => {
    const prompt = "Do you want to remove the subtitle '" + directory + "'?";
    if (prompt) {
      await removeSubtitleFromRepository(
        permPath + PERMITTED_FILE_ENDING,
        directory
      );
      await fetchData();
    }
  };

  const handleRemove = async (pkg: string) => {
    const prompt = confirm(`Do you want to remove ${pkg} from ${permPath}?`);
    if (prompt) {
      await removePackageFromRepository(pkg, permPath);
    }
    fetchData();
  };

  return (
    <>
      {
        data.map(
          (item, outerIdx) =>
            item.length > 0 && (
              <Box
                key={`category-${outerIdx}-${item[0]}`}
                sx={pir_styles.outerList}
              >
                <Box
                  onDragEnter={() => handleDragEnter(outerIdx, 1)}
                  sx={pir_styles.titleList}
                >
                  <h3>{formatTitle(item[0])}</h3>
                  <Box sx={pir_styles.listButtons}>
                    <Tooltip title="Add package to subtitle">
                      <AddIcon onClick={() => handleAdd(item, outerIdx)} />
                    </Tooltip>
                    <Tooltip title="Remove subtitle">
                      <DeleteOutlineIcon
                        sx={styles.clickButtonBig}
                        onClick={() => handleSubtitleRemove(item[0])}
                      />
                    </Tooltip>
                  </Box>
                </Box>
                <List>
                  {item.map(
                    (pkg, innerIdx) =>
                      (pkg.includes(packageSearch) ||
                        packageSearch.length == 0) &&
                      innerIdx != 0 && (
                        <ListItem
                          id={pkg}
                          onDragEnter={() =>
                            handleDragEnter(outerIdx, innerIdx)
                          }
                          key={`${outerIdx}-${innerIdx}-${pkg}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, pkg)}
                          sx={pir_styles.listItem(
                            pkg == dragging,
                            shouldShowAnimation(pkg)
                          )}
                        >
                          <ListItemText>{pkg}</ListItemText>
                          <Box sx={pir_styles.listButtons}>
                            {!pkg.includes("#") && (
                              <Tooltip title="Edit package">
                                <EditIcon
                                  sx={styles.clickButton}
                                  onClick={() => handleButtonClick(pkg)}
                                />
                              </Tooltip>
                            )}
                            {!pkg.includes("#") && (
                              <Tooltip title="Delete package">
                                <DeleteOutlineIcon
                                  sx={styles.clickButton}
                                  onClick={() => handleRemove(pkg)}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </ListItem>
                      )
                  )}
                  <SearchResultsNotes
                    allResults={mapPackagesForSearchResults(item)}
                    searchField={packageSearch}
                    onEmpty="No package"
                    onNoMatch="No Match"
                    treatAsList
                  />
                </List>
              </Box>
            )
        )
      }
    </>
  )

}

// Dialog-only component: keeps input state local so typing does NOT re-render parent
function SubtitleDialog({
  open,
  onClose,
  onAdd,
  repoName,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (val: string) => void;
  repoName: string;
}) {
  const [localValue, setLocalValue] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (open) setIsDisabled(true);
    if (!open) setLocalValue("");
  }, [open]);

  useEffect(() => {
    if (localValue != "") setIsDisabled(false);
    else setIsDisabled(true);
  }, [localValue]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={pir_styles.dialogueWrapper}>
        <Box sx={pir_styles.formWrapper}>
          <Box sx={pir_styles.subtitleTitleWrapper}>
            <Typography variant="h6">
              Add Subtitle to {repoName.toUpperCase()}
            </Typography>
            <Tooltip title="Close">
              <ClearIcon sx={styles.clickButtonBig} onClick={onClose} />
            </Tooltip>
          </Box>
          <TextField
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              onAdd(localValue.trim());
              setLocalValue("");
            }}
            disabled={isDisabled}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
