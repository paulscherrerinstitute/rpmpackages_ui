import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  DialogActions,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import * as dp_styles from "./DetailsPopup.styles";
import * as styles from "../../Content.styles";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { FileInput } from "../FileInput/FileInput";
import { getPackageInformation } from "../../../../services/dataService";

export function DetailsPopup({
  open,
  pkge,
  isAdd,
  addProps,
  repository,
  file,
  enableFileUpload = true,
  onClose,
  setFile,
  onAdd,
  onSave,
  onRemoveFile,
}: DetailsPopupProps) {
  const [formData, setFormData] = useState<DetailsForm>({
    name: "",
    version: "",
    release: "",
    summary: "",
    description: "",
    packager: "",
    arch: "",
    os: ""
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.type);
    const { name, value } = e.target; // fixed to e.target.name and e.target.value
    setFormData(
      (prevState) =>
      ({
        ...prevState,
        [name]: value,
      } as DetailsForm)
    );
  };

  useEffect(() => {
  }, [formData]);


  useEffect(() => {
    if (open) {
      if (isAdd) {
        setFormData({
          name: "",
          version: "",
          release: "",
          summary: "",
          description: "",
          packager: "",
          arch: "",
          os: ""
        });
        if (setFile) setFile(null);
        setIsSaveDisabled(true);
      } else {
        if (pkge) {
          f().then((val) => {
            setFormData(val);
          })
        }
      }
    } else {
      // clear form when closed
      setFormData({
        name: "",
        version: "",
        release: "",
        summary: "",
        description: "",
        packager: "",
        arch: "",
        os: ""
      });
    }
  }, [open, isAdd, pkge]);

  async function f() {
    return (await getPackageInformation(repository ?? "", pkge))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={dp_styles.dialogTitleWrapper}>
        {!isAdd && <DialogTitle>{pkge} </DialogTitle>}
        {isAdd && <DialogTitle>ADD to {addProps?.data[0]}</DialogTitle>}
        <Tooltip title="Close">
          <ClearIcon sx={styles.clickButtonBig} onClick={onClose} />
        </Tooltip>
      </Box>
      <DialogContent dividers>
        <Box onSubmit={handleSave} id="package-form" component="form">
          <Table>
            <TableHead>
              <TableRow sx={dp_styles.tableHead}>
                <TableCell>Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Release</TableCell>
                <TableCell>Arch</TableCell>
                <TableCell>Operating System</TableCell>
                <TableCell>Packager</TableCell>
                <TableCell>Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell> {formData.name} </TableCell>
                <TableCell> {formData.version} </TableCell>
                <TableCell> {formData.release} </TableCell>
                <TableCell> {formData.arch} </TableCell>
                <TableCell> {formData.os} </TableCell>
                <TableCell> {formData.packager} </TableCell>
                <TableCell> {formData.summary} </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {enableFileUpload && File && setFile && (
            <FileInput
              file={file ?? null}
              setFile={setFile}
              accept=".rpm"
              removeFile={handleRemoveFile}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
          form="package-form"
        >
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  function handleSave() {
    if (isAdd && onAdd) onAdd(formData);
    else onSave(formData);
    onClose();
  }

  function handleRemoveFile() {
    if (file && onRemoveFile) onRemoveFile(file);
  }
}

export type DetailsPopupProps = {
  open: boolean;
  pkge: string;
  isAdd: boolean;
  repository?: string;
  file?: File | null;
  enableFileUpload: boolean;
  onClose: () => void;
  setFile?: (file: File | null) => void;
  onSave: (form: DetailsForm) => void;
  onRemoveFile?: (file: File) => void;
  onAdd?: (form: DetailsForm) => void;
  addProps?: AddProps;
};

type AddProps = {
  data: string[];
};

export type DetailsForm = {
  name: string,
  version: string,
  release: string,
  summary: string,
  description: string
  packager: string,
  arch: string,
  os: string
};
