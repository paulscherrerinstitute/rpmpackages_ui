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
} from "@mui/material";
import * as styles from "./DetailsPopup.styles";
import { useEffect, useState } from "react";
import {
  getName,
  getVersion,
  getDistribution,
  getArchitecture,
  getVersionNote,
} from "../../../helpers/DetailsHelper";
import { FileInput } from "../FileInput/FileInput";

export function DetailsPopup({
  open,
  pkge,
  isAdd,
  addProps,
  onClose,
  onAdd,
  onSave,
}: DetailsPopupProps) {
  const [formData, setFormData] = useState<DetailsForm>({
    name: "",
    version: "",
    versionNote: "",
    distribution: "",
    architecture: "",
  });
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target; // fixed to e.target.name and e.target.value
    setFormData(
      (prevState) =>
        ({
          ...prevState,
          [name]: value,
        } as DetailsForm)
    );
  };

  const getPName = () => {
    return getName(pkge);
  };

  const getPVersion = () => {
    return getVersion(pkge);
  };

  const getPVersionNote = () => {
    return getVersionNote(pkge);
  };

  const getPDistribution = () => {
    return getDistribution(pkge);
  };

  const getPArchitecture = () => {
    return getArchitecture(pkge);
  };

  useEffect(() => {
    if (open) {
      if (isAdd) {
        setFormData({
          name: "",
          version: "",
          versionNote: "",
          distribution: "",
          architecture: "",
        });
        setFile(null);
      } else {
        setFormData({
          name: getPName(),
          version: getPVersion(),
          versionNote: getPVersionNote(),
          distribution: getPDistribution(),
          architecture: getPArchitecture(),
        });
      }
    } else {
      // clear form when closed
      setFormData({
        name: "",
        version: "",
        versionNote: "",
        distribution: "",
        architecture: "",
      });
      setFile(null);
    }
  }, [open, isAdd, pkge]);

  const [file, setFile] = useState<File | null>(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {!isAdd && <DialogTitle>{pkge} </DialogTitle>}
      {isAdd && <DialogTitle>ADD to {addProps?.data[0]}</DialogTitle>}
      <DialogContent dividers>
        <Box onSubmit={handleSave} id="package-form" component="form">
          <Table>
            <TableHead>
              <TableRow sx={styles.tableHead}>
                <TableCell>Package Name</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Version-Note</TableCell>
                <TableCell>Distribution</TableCell>
                <TableCell>Architecture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={getPName() === "" ? "(empty)" : getPName()}
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={getPVersion() === "" ? "(empty)" : getPVersion()}
                    value={formData.version}
                    name="version"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={
                      getPVersionNote() === "" ? "(empty)" : getPVersionNote()
                    }
                    value={formData.versionNote}
                    name="versionNote"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={
                      getPDistribution() === "" ? "(empty)" : getPDistribution()
                    }
                    value={formData.distribution}
                    name="distribution"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={
                      getPArchitecture() === "" ? "(empty)" : getPArchitecture()
                    }
                    value={formData.architecture}
                    name="architecture"
                    onChange={handleChange}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <FileInput file={file} setFile={setFile} accept=".repo_cfg" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} form="package-form">
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
}

export type DetailsPopupProps = {
  open: boolean;
  pkge: string;
  isAdd: boolean;
  onClose: () => void;
  onSave: (form: DetailsForm) => void;
  onAdd?: (form: DetailsForm) => void;
  addProps?: AddProps;
};

type AddProps = {
  data: string[];
};

export type DetailsForm = {
  name: string;
  version: string;
  versionNote: string;
  distribution: string;
  architecture: string;
};
