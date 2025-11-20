import { type ChangeEvent, useEffect, useRef, useState } from "react";
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
  removeFile?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const initialFileNameRef = useRef<string | null>(file ? file.name : null);

  const updateFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const f = event.target.files[0];
      // Clear the initial-file marker so we know this is a user-selected upload
      initialFileNameRef.current = null;
      setFile(f);
      setIsNewUpload(true);
    }
  };

  useEffect(() => {
    // If the component was mounted with a file (existing on server), ensure
    // it's shown as existing (not as a newly uploaded/unsaved file).
    if (
      initialFileNameRef.current &&
      file &&
      file.name === initialFileNameRef.current
    ) {
      setIsNewUpload(false);
    }
    // If file becomes null, reset uploaded state
    if (!file) {
      setIsNewUpload(false);
    }
  }, [file]);

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

  const handleRemoveFile = () => {
    const prompt = confirm("Do you want to delete this file?");
    if (removeFile && prompt) removeFile();
  };

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.fileMessage}>
        {file == null && (
          <Box sx={styles.noFile}>
            No File has been detected for this package.
          </Box>
        )}
        {file != null && !isNewUpload && (
          <Box sx={styles.isFile}>
            A file has been detected for this package.
          </Box>
        )}
        {file != null && isNewUpload && (
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
              onClick={() => handleRemoveFile()}
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
