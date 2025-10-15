import { Box, List, ListItem, ListItemText } from "@mui/material";
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

export function Packages() {
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
  };

  const formatTitle = (title: string) => {
    if (!title) return;
    return title.match("[A-Za-z].*")?.toString().toUpperCase();
  };

  const handleRemove = (pkg: string) => {
    const prompt = confirm(`Do you want to remove ${pkg} from ${permPath}?`);
    if (prompt) {
      permPath = `${permPath}.repo_cfg`;
      removePackageFromRepo(pkg, permPath);
    }
  };

  const handleAdd = (it: string[], idx: number) => {
    setPopupOpen(true);
    setIsAdd(true);
    setItem(it);
    setOuterIdx(idx);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const resultData = await getPackagesFromRepo(path);
        setData(resultData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, []); // runs once when component mounts

  return (
    <Box component="main">
      <Box sx={styles.main}>
        {permPath.length > 0 && !isNotFound && (
          <Box sx={styles.body}>
            <h2>Packages for {permPath.toUpperCase()}</h2>
            {data.map((item, outerIdx) => (
              <Box
                key={`category-${outerIdx}-${item[0]}`}
                sx={styles.outerList}
              >
                <Box sx={styles.titleList}>
                  <h3>{formatTitle(item[0])}</h3>
                  <AddIcon onClick={() => handleAdd(item, outerIdx)} />
                </Box>
                <List>
                  {item.map(
                    (pkg, innerIdx) =>
                      innerIdx != 0 && (
                        <ListItem key={`${outerIdx}-${innerIdx}-${pkg}`}>
                          {!pkg.includes("#") && (
                            <EditIcon
                              sx={styles.innerList}
                              onClick={() => handleButtonClick(pkg)}
                            />
                          )}
                          <ListItemText>{pkg}</ListItemText>
                          {!pkg.includes("#") && (
                            <DeleteOutlineIcon
                              sx={styles.innerList}
                              onClick={() => handleRemove(pkg)}
                            />
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
            The Repository{" "}
            <span style={{ fontWeight: "bold" }}>{permPath}</span> does not
            exist
          </Box>
        )}
      </Box>
    </Box>
  );
}
