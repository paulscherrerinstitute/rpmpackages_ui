import { Box, Tooltip } from "@mui/material";
import * as styles from "./AllPackagesFileInput.styles";
import * as con_styles from "../../Content.styles";
import { useEffect, useState, useRef, type ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  removeFileFromFolder,
  uploadFileToFolder,
} from "../../../../services/dataService";
import { type EnvWindow } from "../../../../services/dataService.types";
const PERMITTED_FILE_ENDING: string =
  (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

export default function AllPackagesFileInput({
  displayInput,
  file,
  packageIncludedIn,
  fileIncludedIn,
  updatePackages,
  setFile,
}: AllPackagesFileInputProps) {
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
      const withoutEnd = pkge.replace(PERMITTED_FILE_ENDING, "");
      if (!fileIncludedIn.includes(withoutEnd) && file != null) {
        await uploadFileToFolder(withoutEnd, file);
        updatePackages();
      }
    });
  };

  const handleRemoveAll = async () => {
    const prompt = confirm(
      "Do you want to delete all instances of this everywhere?"
    );
    if (prompt) {
      packageIncludedIn.forEach(async (pkge) => {
        const withoutEnd = pkge.replace(PERMITTED_FILE_ENDING, "");
        if (fileIncludedIn.includes(withoutEnd) && file != null) {
          await removeFileFromFolder(withoutEnd, file.name);
          updatePackages();
        }
      });
    }
  };

  const updateFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const f: File = event.target.files[0];

      if (f) {
        setFile(f);
        packageIncludedIn.forEach(async (pkge) => {
          const withoutEnd = pkge.replace(PERMITTED_FILE_ENDING, "");
          if (!fileIncludedIn.includes(withoutEnd) && f.name != null) {
            await uploadFileToFolder(withoutEnd, f);
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

type AllPackagesFileInputProps = {
  displayInput: boolean;
  file: File | null;
  packageIncludedIn: string[];
  fileIncludedIn: string[];
  updatePackages: () => void;
  setFile: (f: File) => void;
};
