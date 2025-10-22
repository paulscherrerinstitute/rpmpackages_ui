import { type ChangeEvent, useEffect, useRef } from "react";
import * as styles from "./FileInput.styles";
import * as con_styles from "../../Content.styles";
import { Box, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export function FileInput({
  accept,
  file,
  setFile,
  removeFile,
}: {
  accept: string;
  file: File | null;
  setFile: (newFile: File | null) => void;
  removeFile: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const f = event.target.files[0];
      setFile(f);
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

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.fileMessage}>
        {file == null && (
          <Box sx={styles.noFile}>
            No File has been detected for this package.
          </Box>
        )}
        {file != null && !fileInputRef.current && (
          <Box sx={styles.isFile}>
            A file has been detected for this package.
          </Box>
        )}
        {file != null && fileInputRef.current && (
          <Box sx={styles.isFileSave}>
            A file has been uploaded. Press Save to save it.
          </Box>
        )}
      </Box>

      {file != null && (
        <Box sx={styles.existWrapper}>
          <Tooltip title="Click to download the .rpm">
            <Box sx={con_styles.clickButtonBig} onClick={getFileURL}>
              {file.name}
            </Box>
          </Tooltip>
          <Tooltip title="Remove the .rpm from the current directory the repository is pointing to">
            <DeleteOutlineIcon
              onClick={removeFile}
              sx={con_styles.clickButtonBig}
            />
          </Tooltip>
        </Box>
      )}
      {file == null && (
        <input
          ref={fileInputRef}
          accept={accept}
          onChange={updateFile}
          type="file"
        />
      )}
    </Box>
  );
}
