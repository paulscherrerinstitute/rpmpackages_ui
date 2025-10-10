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

export function DetailsPopup({ open, pkge, handleClose }: DetailsPopupProps) {
  const name = getName();
  const version = getVersion();
  const versionNote = getVersionNote();
  const distribution = getDistribution();
  const architecture = getArchitecture();

  const [formData, setFormData] = useState({
    name: name,
    version: version,
    versionNote: versionNote,
    distribution: distribution,
    architecture: architecture,
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target; // fixed to e.target.name and e.target.value
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (open) {
      setFormData({
        name: name,
        version: version,
        versionNote: versionNote,
        distribution: distribution,
        architecture: architecture,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{pkge} </DialogTitle>
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
                    label={name}
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={version}
                    value={formData.version}
                    name="version"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={versionNote == "" ? "(empty)" : versionNote}
                    value={formData.versionNote}
                    name="versionNote"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={distribution}
                    value={formData.distribution}
                    name="distribution"
                    onChange={handleChange}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="standard"
                    label={architecture}
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
    var str = pkge
      .replace(name, formData.name)
      .replace(version, formData.version)
      .replace(distribution, formData.distribution)
      .replace(architecture, formData.architecture);

    if (formData.versionNote != "") {
      if (versionNote == "") {
        var idx = str.indexOf(version) + version.length;
        str = str.slice(0, idx + 1) + formData.versionNote + str.slice(idx);
      } else {
        str.replace(getVersionNote(), formData.versionNote);
      }
    }
    handleClose();
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

  function getVersionNote(): string {
    var versionnote = pkge
      .replace(getName(), "")
      .replace(getDistribution(), "")
      .replace(getVersion(), "")
      .replace(getArchitecture() + ".rpm", "");

    return clipSides(versionnote);
  }

  function getDistribution() {
    const arch = pkge
      .replace(getName(), "")
      .replace(getVersion(), "")
      .replace(".rpm", "")
      .split(".")
      .reverse();
    return clipSides(arch[1]);
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
};
