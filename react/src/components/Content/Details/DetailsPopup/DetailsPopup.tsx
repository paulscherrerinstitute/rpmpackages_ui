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
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from "@mui/icons-material/Edit";
import { FileInput } from "../FileInput/FileInput";
import { getPackageInformation, uploadFileToFolder } from "../../../../services/dataService";
import type { EnvWindow } from "../../../../services/dataService.types";

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
    os: "",
    file_name: ""
  });

  const PERMITTED_FILE_ENDING: string =
    (window as EnvWindow)._env_?.RPM_PACKAGES_CONFIG_ENDING ?? ".repo_cfg";

  useEffect(() => {
  }, [formData]);


  useEffect(() => {
    if (open) {
      setDisplayTitle(true);
      if (isAdd) {
        setFormData({
          name: "None",
          version: "None",
          release: "None",
          summary: "None",
          description: "None",
          packager: "None",
          arch: "None",
          os: "None",
          file_name: ""
        });
        if (setFile) setFile(null);
      } else {
        if (pkge) {
          f().then((val) => {
            setFormData(val);
            setPkgeTitle(pkge);
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
        os: "",
        file_name: ""
      });
    }
  }, [open, isAdd, pkge]);

  useEffect(() => {
    if (file) {
      var repos = repository?.replace(PERMITTED_FILE_ENDING, "") ?? "";
      uploadFileToFolder(repos, file).then(() => {
        getPackageInformation(repository ?? "", file.name).then((val) => {
          setFormData(val);
          setPkgeTitle(file.name);
          setFormData((prevState) => ({
            ...prevState,
            ["file_name"]: file.name
          }))
        })
        setIsDeactivated(false);
      });
    } else {
      setIsDeactivated(true);
    }
  }, [file])

  async function f() {
    return (await getPackageInformation(repository ?? "", pkge))
  }

  const [pkgeTitle, setPkgeTitle] = useState<string>("");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPkgeTitle(value);
  }

  const [displayTitle, setDisplayTitle] = useState<boolean>(true);

  const saveTitleChange = async () => {
    if (repository) setFormData((prevState) => ({
      ...prevState,
      ["file_name"]: pkgeTitle
    }))
    setDisplayTitle(true);
  }

  const discardTitleChange = () => {
    setDisplayTitle(true);
    setPkgeTitle(pkge)
  }

  const [isDeactivated, setIsDeactivated] = useState<boolean>(true);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={dp_styles.dialogTitleWrapper}>
        {
          !isAdd && <DialogTitle>
            {displayTitle ?
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                  <Box>
                    {pkgeTitle}
                  </Box>
                  <Tooltip title="Edit filename">
                    <EditIcon fontSize="small" sx={styles.clickButtonBig} onClick={() => setDisplayTitle(!displayTitle)} />
                  </Tooltip>
                </Box>
              </> :
              <Box sx={{ display: "flex", alignItems: "center", gap: "1vw" }}>
                <TextField
                  sx={{ width: (pkgeTitle.length * 9) }}
                  onChange={handleTitleChange}
                  value={pkgeTitle}
                  size="small"
                />
                <Tooltip title="Save Changed Title">
                  <DoneIcon sx={styles.clickButtonBig} onClick={saveTitleChange} />
                </Tooltip>
                <Tooltip title="Discard changed title">
                  <ClearIcon sx={styles.clickButtonBig} onClick={discardTitleChange} />
                </Tooltip>
              </Box>
            }
          </DialogTitle>
        }
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
          form="package-form"
          disabled={isDeactivated}
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
  file_name: string
};
