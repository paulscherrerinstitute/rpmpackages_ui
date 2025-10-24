import { Box, Tooltip } from "@mui/material";
import * as styles from "./AllPackagesInputPopup.styles";
import * as con_styles from "../../Content.styles";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  removeFileFromDirectory,
  uploadFileToDirectory,
} from "../../../../helper/dataService";

export default function AllPackagesInputPopup({
  displayInput,
  file,
  packageIncludedIn,
  fileIncludedIn,
  updatePackages,
  setFile,
}: AllPackagesInputPopupProps) {
  useEffect(() => {
    fetchData();
  }, [fileIncludedIn]);

  const [isPossible, setIsPossible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    if (
      fileIncludedIn.length < packageIncludedIn.length &&
      fileIncludedIn.length < 1
    ) {
      setIsPossible(true);
    } else {
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
        await uploadFileToDirectory(withoutEnd, file);
        updatePackages();
      }
    });
  };

  const handleRemoveAll = async () => {
    console.log("REMOVE ALL", packageIncludedIn, fileIncludedIn);
    packageIncludedIn.forEach(async (pkge) => {
      var withoutEnd = pkge.replace(".repo_cfg", "");
      if (fileIncludedIn.includes(withoutEnd) && file != null) {
        await removeFileFromDirectory(withoutEnd, file.name);
        updatePackages();
      }
    });
  };

  const updateFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const f: File = event.target.files[0];

      if (f) {
        setFile(f);
        packageIncludedIn.forEach(async (pkge) => {
          var withoutEnd = pkge.replace(".repo_cfg", "");
          if (!fileIncludedIn.includes(withoutEnd) && f.name != null) {
            await uploadFileToDirectory(withoutEnd, f);
          }
        });
      }
      updatePackages();
    }
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
          <input
            type="file"
            ref={fileInputRef}
            accept=".rpm"
            onChange={updateFile}
          />
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
  setFile: (f: File) => void;
};
