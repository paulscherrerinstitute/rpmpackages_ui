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
import { type EnvWindow, type FolderInclusions, type Repository } from "../../../../services/dataService.types";
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

  const [isPossible, setIsPossible] = useState(true);
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

  useEffect(() => {
    fetchData();
  }, [fileIncludedIn]);

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
    packageIncludedIn.forEach(async (repository) => {
      const repos = repository.element.replace(PERMITTED_FILE_ENDING, "");
      if (fileIncludedIn.filter((val) => val.directory == repos).length > 0 && file != null) {
        await uploadFileToFolder(repos, file, repository.directory_index);
        updatePackages();
      }
    });
  };

  const handleRemoveAll = async () => {
    const prompt = confirm(
      "Do you want to delete all instances of this everywhere?"
    );
    if (prompt) {
      packageIncludedIn.forEach(async (repository) => {
        const repos = repository.element.replace(PERMITTED_FILE_ENDING, "");
        if (fileIncludedIn.filter((val) => val.directory == repos).length > 0 && file != null) {
          await removeFileFromFolder(repos, file.name, repository.directory_index);
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
        packageIncludedIn.forEach(async (repository) => {
          const repos = repository.element.replace(PERMITTED_FILE_ENDING, "");
          if (!(fileIncludedIn.filter((val) => val.directory == repos).length > 0) && f.name != null) {
            await uploadFileToFolder(repos, f, repository.directory_index);
          }
        });
      }
      updatePackages();
    }
  };

  return (
    <Box sx={styles.wrapper}>
      {file != null ? (
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
      ) :
        displayInput && isPossible && (
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
  packageIncludedIn: Repository[];
  fileIncludedIn: FolderInclusions[];
  updatePackages: () => void;
  setFile: (f: File) => void;
};
