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
          name: getName(),
          version: getVersion(),
          versionNote: getVersionNote(),
          distribution: getDistribution(),
          architecture: getArchitecture(),
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
                    label={getName() === "" ? "(empty)" : getName()}
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={getVersion() === "" ? "(empty)" : getVersion()}
                    value={formData.version}
                    name="version"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={
                      getVersionNote() === "" ? "(empty)" : getVersionNote()
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
                      getDistribution() === "" ? "(empty)" : getDistribution()
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
                      getArchitecture() === "" ? "(empty)" : getArchitecture()
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
      const origName = getName();
      const origVersion = getVersion();
      const origDistribution = getDistribution();
      const origArchitecture = getArchitecture();
      const origVersionNote = getVersionNote();

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
      var pk;
      if (formData.versionNote !== "") {
        pk = `${formData.name}-${formData.version}-${formData.versionNote}.${formData.distribution}.${formData.architecture}.rpm`;
      } else {
        pk = `${formData.name}-${formData.version}.${formData.distribution}.${formData.architecture}.rpm`;
      }
      if (addProps) {
        console.log(pk, `${addProps.file_name}.repo_cfg`, addProps.insertIdx)
        addPackageToRepo(pk, `${addProps.file_name}.repo_cfg`, addProps.insertIdx);
      }
    }
   // handleClose();
  }

  function getName(): string {
    var split = pkge.split(/-[0-9]{1}/g)[0];
    return split;
  }

  function getVersion(): string {
    var version = pkge
      .replace(getName(), "")
      .replace(".rpm", "")
      .split(/.[A-Za-z]/g)[0];
    return clipSides(version);
  }

  function getDistribution() {
    const arch = pkge
      .replace(getName(), "")
      .replace(getVersion(), "")
      .replace(".rpm", "")
      .split(".")
      .reverse();
    const clipped = clipSides(arch[1]);
    return clipped != undefined ? clipped : "";
  }

  function getArchitecture() {
    const arch = pkge
      .replace(getName() + "-", "")
      .replace(getVersion() + ".", "")
      .replace(".rpm", "")
      .split(".")
      .reverse();
    return clipSides(arch[0]);
  }

  function getVersionNote(): string {
    const versionnote = pkge
      .replace(getName(), "")
      .replace(getDistribution(), "")
      .replace(getVersion(), "")
      .replace(".rpm", "")
      .replace(getArchitecture(), "");
    return clipSides(versionnote);
  }

  function clipSides(str: string) {
    if (str == null) return str;
    while (
      str.startsWith("-") ||
      str.startsWith(".") ||
      str.endsWith("-") ||
      str.endsWith(".")
    ) {
      // Remove leading or trailing '-' or '.'
      if (str.startsWith("-") || str.startsWith(".")) {
        str = str.slice(1);
      }
      if (str.endsWith("-") || str.endsWith(".")) {
        str = str.slice(0, -1);
      }
    }
    return str;
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
