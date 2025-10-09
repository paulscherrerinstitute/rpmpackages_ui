import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export function DetailsPopup({ open, pkge, onClose }: DetailsPopupProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{pkge} </DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Package Name</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Version-Note</TableCell>
              <TableCell>Distribution</TableCell>
              <TableCell>Architecture</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{getName()}</TableCell>
              <TableCell>{getVersion()}</TableCell>
              <TableCell>{getVersionNote()}</TableCell>
              <TableCell>{getDistribution()}</TableCell>
              <TableCell>{getArchitecture()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );

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
    if(str == null) return str;
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
  onClose: () => void;
};
