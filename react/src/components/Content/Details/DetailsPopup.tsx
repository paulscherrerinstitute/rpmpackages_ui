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
import { addPackageToRepo } from "../../../helper/dataService";
import {
  getName,
  getVersion,
  getDistribution,
  getArchitecture,
  getVersionNote,
} from "../../helpers/DetailsHelper";

export function DetailsPopup({
  open,
  pkge,
  handleClose,
  isAdd,
  addProps,
}: DetailsPopupProps) {
  type DetailsForm = {
    name: string;
    version: string;
    versionNote: string;
    distribution: string;
    architecture: string;
  };

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

  const getPVersion = () =>{
    return getVersion(pkge);
  }

  const getPVersionNote = () =>{
    return getVersionNote(pkge);
  }

  const getPDistribution = () =>{
    return getDistribution(pkge);
  }

  const getPArchitecture = ()=>{
    return getArchitecture(pkge);
  }

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
    }
  }, [open, isAdd, pkge]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} form="package-form">
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  function handleSave() {
    if (!isAdd) {
      // derive original values from the pkge so we replace correct substrings
      const origName = getPName();
      const origVersion = getPVersion();
      const origDistribution = getPDistribution();
      const origArchitecture = getPArchitecture();
      const origVersionNote = getPVersionNote();

      let str = pkge
        .replace(origName, formData.name)
        .replace(origVersion, formData.version)
        .replace(origDistribution, formData.distribution)
        .replace(origArchitecture, formData.architecture);

      if (formData.versionNote !== "") {
        if (origVersionNote === "") {
          const idx = str.indexOf(origVersion) + origVersion.length;
          str = str.slice(0, idx + 1) + formData.versionNote + str.slice(idx);
        } else {
          str = str.replace(origVersionNote, formData.versionNote);
        }
      }
    } else {
      var pk: string;
      if (formData.versionNote !== "") {
        pk = `${formData.name}-${formData.version}-${formData.versionNote}.${formData.distribution}.${formData.architecture}.rpm`;
      } else {
        pk = `${formData.name}-${formData.version}.${formData.distribution}.${formData.architecture}.rpm`;
      }
      if (addProps) {
        addPackageToRepo(
          pk,
          `${addProps.file_name}.repo_cfg`,
          addProps.insertIdx
        );
      }
    }
    handleClose();
  }
}

export type DetailsPopupProps = {
  open: boolean;
  pkge: string;
  handleClose: () => void;
  isAdd: boolean;
  addProps?: AddProps;
};

type AddProps = {
  item?: string;
  file_name: string;
  insertIdx: number;
  data: string[];
};
