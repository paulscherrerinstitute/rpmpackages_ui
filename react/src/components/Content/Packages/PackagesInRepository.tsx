import { Box, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getPackagesFromRepo,
  removePackageFromRepo,
} from "../../../helper/dataService";
import * as styles from "../Content.styles";
import { useParams } from "react-router-dom";
import { DetailsPopup } from "../Details/DetailsPopup";
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

  const handleRemove = async (pkg: string) => {
    const prompt = confirm(`Do you want to remove ${pkg} from ${permPath}?`);
    if (prompt) {
      permPath = `${permPath}.repo_cfg`;
      await removePackageFromRepo(pkg, permPath);
    }
    fetchData();
  };

  const handleAdd = (it: string[], idx: number) => {
    setPopupOpen(true);
    setPkge("");
    setIsAdd(true);
    setItem(it);
    setOuterIdx(idx);
  };

  const fetchData = async () => {
    try {
      const resultData = await getPackagesFromRepo(path);
      setData(resultData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // runs once when component mounts

  return (
    <Box sx={styles.main}>
      {permPath.length > 0 && !isNotFound && (
        <Box sx={styles.body}>
          <Box sx={styles.packageTitle}>
          <h2>Packages for {permPath.toUpperCase()}</h2>
          <Tooltip title="Add subtitle">
            <AddIcon />
          </Tooltip>
          </Box>
          {data.map((item, outerIdx) => (
            <Box key={`category-${outerIdx}-${item[0]}`} sx={styles.outerList}>
              <Box sx={styles.titleList}>
                <h3>{formatTitle(item[0])}</h3>
                <Tooltip title="Add package to subtitle">
                  <AddIcon onClick={() => handleAdd(item, outerIdx)} />
                </Tooltip>
              </Box>
              <List>
                {item.map(
                  (pkg, innerIdx) =>
                    innerIdx != 0 && (
                      <ListItem key={`${outerIdx}-${innerIdx}-${pkg}`}>
                        {!pkg.includes("#") && (
                          <Tooltip title="Edit package">
                            <EditIcon
                              sx={styles.clickButton}
                              onClick={() => handleButtonClick(pkg)}
                            />
                          </Tooltip>
                        )}
                        <ListItemText>{pkg}</ListItemText>
                        {!pkg.includes("#") && (
                          <Tooltip title="Delete package">
                            <DeleteOutlineIcon
                              sx={styles.clickButton}
                              onClick={() => handleRemove(pkg)}
                            />
                          </Tooltip>
                        )}
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
            addProps={{
              file_name: permPath,
              insertIdx: outerIdx,
              data: item,
            }}
            handleClose={handleClosePopup}
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
