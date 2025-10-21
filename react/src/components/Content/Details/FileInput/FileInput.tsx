import { type ChangeEvent, useRef, useState } from "react";
import * as styles from "./FileInput.styles";
import { Box } from "@mui/material";

export function FileInput({
  accept,
  file,
  setFile,
}: {
  accept: string;
  file: File | null;
  setFile: (newFile: File | null) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const updateFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const f = event.target.files[0];
      setFile(f);
    }
  };

  return (
    <Box sx={styles.wrapper}>
      {file && <Box>{file.name}</Box>}
      <input
        ref={fileInputRef}
        accept={accept}
        onChange={updateFile}
        type="file"
      />
    </Box>
  );
}
