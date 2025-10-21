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
  addPackageToRepo,
  createNewDirectoryInRepo,
  getPackagesFromRepo,
  movePackage,
  removeDirectory,
  removePackageFromRepo,
  updatePackage,
} from "../../../../helper/dataService";
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

export default function PackagesInRepository() {
  // Display List
  const [data, setData] = useState<string[][]>([]);
  let { path } = useParams();
  let permPath: string = path ?? "";

  let isNotFound;
  if (data.length > 0) isNotFound = data[0][0] == "<!doctype html>";

  // Display Popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [pkge, setPkge] = useState("");

  const [outerIdx, setOuterIdx] = useState(-1);
  const [item, setItem] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const handleButtonClick = (pk: string) => {
    setPopupOpen(true);
    setIsAdd(false);
    setPkge(pk);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
    fetchData();
  };

  const formatTitle = (title: string) => {
    if (!title) return;
    return title.match("[A-Za-z].*")?.toString().toUpperCase();
  };

  const handleAdd = (it: string[], idx: number) => {
    setPopupOpen(true);
    setPkge("");
    setIsAdd(true);
    setItem(it);
    setOuterIdx(idx);
  };

  const handleSubtitleButtonClick = () => setAddOpen(true);

  const handleSubtitleClose = () => setAddOpen(false);

  const handleRemove = async (pkg: string) => {
    const prompt = confirm(`Do you want to remove ${pkg} from ${permPath}?`);
    if (prompt) {
      permPath = `${permPath}.repo_cfg`;
      await removePackageFromRepo(pkg, permPath);
    }
    fetchData();
  };

  const handleSubtitleRemove = async (directory: string) => {
    await removeDirectory(permPath + ".repo_cfg", directory);
    await fetchData();
  };

  const handleSubtitleAdd = async (newSubtitle: string) => {
    const path = permPath + ".repo_cfg";
    await createNewDirectoryInRepo(path, newSubtitle);
    setAddOpen(false);
    await fetchData();
  };

  const fetchData = async () => {
    try {
      const resultData = await getPackagesFromRepo(path);
      setData(resultData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const handleSave = async (form: DetailsForm) => {
    var pk;
    if (form.versionNote !== "") {
      pk = `${form.name}-${form.version}-${form.versionNote}.${form.distribution}.${form.architecture}.rpm`;
    } else {
      pk = `${form.name}-${form.version}.${form.distribution}.${form.architecture}.rpm`;
    }
    var repo_path = `${permPath}.repo_cfg`;
    await updatePackage(pkge, pk, repo_path);
    fetchData();
  };

  const handleAddSubmit = async (form: DetailsForm) => {
    var pk;
    if (form.versionNote !== "") {
      pk = `${form.name}-${form.version}-${form.versionNote}.${form.distribution}.${form.architecture}.rpm`;
    } else {
      pk = `${form.name}-${form.version}.${form.distribution}.${form.architecture}.rpm`;
    }
    var repo_path = `${permPath}.repo_cfg`;
    await addPackageToRepo(pk, repo_path, outerIdx);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []); // runs once when component mounts

  const [dragging, setDragging] = useState<string>("");

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
      await movePackage(dragging, permPath + ".repo_cfg", o_idx, i_idx);
      await fetchData();
    }
  };

  return (
    <Box sx={styles.main}>
      {permPath.length > 0 && !isNotFound && (
        <Box sx={styles.body}>
          <Box sx={styles.packageTitle}>
            <h2>Packages for {permPath.toUpperCase()}</h2>
            <Tooltip title="Add subtitle">
              <AddIcon
                sx={styles.clickButtonBig}
                onClick={handleSubtitleButtonClick}
              />
            </Tooltip>
            <SubtitleDialog
              open={addOpen}
              onClose={handleSubtitleClose}
              onAdd={handleSubtitleAdd}
              repoName={permPath}
            />
          </Box>
          {data.map((item, outerIdx) => (
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
                    innerIdx != 0 && (
                      <ListItem
                        onDragEnter={() => handleDragEnter(outerIdx, innerIdx)}
                        key={`${outerIdx}-${innerIdx}-${pkg}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, pkg)}
                        sx={pir_styles.listItem(pkg == dragging)}
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
              </List>
            </Box>
          ))}
          <DetailsPopup
            open={popupOpen}
            isAdd={isAdd}
            pkge={pkge}
            onSave={(f) => handleSave(f)}
            onAdd={(f) => handleAddSubmit(f)}
            addProps={{
              data: item,
            }}
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
  const [localValue, setLocalValue] = useState("");
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={pir_styles.dialogueWrapper}>
        <Box sx={pir_styles.formWrapper}>
          <Typography variant="h6">
            Add Subtitle to {repoName.toUpperCase()}
          </Typography>
          <TextField
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <Button
            onClick={() => {
              onAdd(localValue.trim());
              setLocalValue("");
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
