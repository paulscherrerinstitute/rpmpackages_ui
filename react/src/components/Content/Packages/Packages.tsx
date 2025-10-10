import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getData } from "../../../helper/read_data";
import * as styles from "../Content.styles";
import { useParams } from "react-router-dom";
import { DetailsPopup } from "../Details/DetailsPopup";

export function Packages() {
  // Display List
  const [data, setData] = useState<string[][]>([]);
  let { path } = useParams();
  let permPath: string = path ?? "";

  let isNotFound;
  if (data.length > 0) isNotFound = data[0][0] == "<!doctype html>";

  useEffect(() => {
    async function fetchData() {
      try {
        const resultData = await getData(path);
        setData(resultData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    fetchData();
  }, []); // runs once when component mounts

  // Display Popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [pkge, setPkge] = useState("");
  const handleButtonClick = (pk: string) => {
    setPopupOpen(true);
    setPkge(pk);
  };
  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  function formatTitle(title: string) {
    return title.match("[A-Za-z].*")?.toString().toUpperCase();
  }

  return (
    <Box component="main">
      <Box sx={styles.main}>
        {permPath.length > 0 && !isNotFound && (
          <Box sx={styles.body}>
            <Typography>
              Packages for{" "}
              <span style={{ fontWeight: "bold" }}>
                {permPath.toUpperCase()}
              </span>
            </Typography>
            {data.map((item, outerIdx) => (
              <Box
                key={`category-${outerIdx}-${item[0]}`}
                sx={styles.outerList}
              >
                <h3>{formatTitle(item[0])}</h3>
                <List>
                  {item.map(
                    (pkg, innerIdx) =>
                      innerIdx != 0 && (
                        <ListItem
                          key={`${outerIdx}-${innerIdx}-${pkg}`}
                          onClick={() => handleButtonClick(pkg)}
                        >
                          <ListItemText sx={styles.innerList}>
                            {pkg}
                          </ListItemText>
                        </ListItem>
                      )
                  )}
                </List>
              </Box>
            ))}
            <DetailsPopup
              open={popupOpen}
              pkge={pkge}
              handleClose={handleClosePopup}
            />
          </Box>
        )}
        {permPath.length <= 0 && <Box>No Facility has been requested</Box>}
        {isNotFound && (
          <Box>
            The Facility <span style={{ fontWeight: "bold" }}>{permPath}</span>{" "}
            does not exist
          </Box>
        )}
      </Box>
    </Box>
  );
}
