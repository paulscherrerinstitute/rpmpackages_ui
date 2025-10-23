import { Box, Tooltip } from "@mui/material";
import * as styles from "./AllPackagesInputPopup.styles";
import * as con_styles from "../../Content.styles";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  removePackageFromDirectory,
  uploadFile,
} from "../../../../helper/dataService";

export default function AllPackagesInputPopup({
  displayInput,
  file,
  packageIncludedIn,
  fileIncludedIn,
  updatePackages,
}: AllPackagesInputPopupProps) {
  useEffect(() => {
    fetchData();
  }, [fileIncludedIn]);

  const [isPossible, setIsPossible] = useState(false);

  const fetchData = () => {
    console.log(file);
    if (fileIncludedIn.length < packageIncludedIn.length && fileIncludedIn.length < 1) {
      console.log(packageIncludedIn);
      setIsPossible(true);
    }else{
      setIsPossible(false);
    }
  };

  const getFileURL = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = file.name;
      downloadLink.click();
      URL.revokeObjectURL(fileURL);
    }
  };

  const handleAddAll = async () => {
    packageIncludedIn.forEach(async (pkge) => {
      var withoutEnd = pkge.replace(".repo_cfg", "");
      if (!fileIncludedIn.includes(withoutEnd) && file != null) {
        await uploadFile(withoutEnd, file);
        updatePackages();
      }
    });
  };

  const handleRemoveAll = async () => {
    console.log("REMOVE ALL", packageIncludedIn, fileIncludedIn);
    packageIncludedIn.forEach(async (pkge) => {
      var withoutEnd = pkge.replace(".repo_cfg", "");
      if (fileIncludedIn.includes(withoutEnd) && file != null) {
        await removePackageFromDirectory(withoutEnd, file.name);
        updatePackages();
      }
    });
  };

  return (
    <Box sx={styles.wrapper}>
      {file != null && (
        <Box sx={styles.iconWrapper}>
          <Tooltip title="Click to download the .rpm">
            <Box sx={con_styles.clickButtonBig} onClick={getFileURL}>
              {file.name}
            </Box>
          </Tooltip>
          <Tooltip title="Add to all Directories">
            <AddIcon sx={con_styles.clickButtonBig} onClick={handleAddAll} />
          </Tooltip>
          <Tooltip title="Delete from all Directories">
            <DeleteOutlineIcon
              sx={con_styles.clickButtonBig}
              onClick={handleRemoveAll}
            />
          </Tooltip>
        </Box>
      )}
      {displayInput && isPossible && (
        <Box>
          <input type="file" />
        </Box>
      )}
    </Box>
  );
}

type AllPackagesInputPopupProps = {
  displayInput: boolean;
  file: File | null;
  packageIncludedIn: string[];
  fileIncludedIn: string[];
  updatePackages: () => void;
};
