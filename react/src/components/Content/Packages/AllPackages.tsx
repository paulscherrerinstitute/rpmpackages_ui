import {
  Box,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import * as styles from "../Content.styles";
import { useEffect, useState } from "react";
import {
  getAllPackages,
  getPackageInclusions,
} from "../../../helper/dataService";
import {
  getArchitecture,
  getDistribution,
  getName,
  getVersion,
  getVersionNote,
} from "../../helpers/DetailsHelper";

export default function AllPackages() {
  const [data, setData] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState("");

  const fetchData = async () => {
    try {
      const resultData = await getAllPackages();
      setData(resultData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const fetchInclusionData = async (pk: string) => {
    try {
      const resultData = await getPackageInclusions(pk);
      setInclusions(resultData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const getInclusions = (it: string) => {
    setOpen(true);
    setItem(it);
    fetchInclusionData(it);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={styles.main}>
      <Typography>All Packages</Typography>
      <Box>
        {data.map((item) => (
          <Typography key={item} onClick={() => getInclusions(item)}>
            {item}
          </Typography>
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{item}</DialogTitle>
        <Box>
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
                <TableCell>{getName(item)}</TableCell>
                <TableCell>{getVersion(item)}</TableCell>
                <TableCell>{getVersionNote(item)}</TableCell>
                <TableCell>{getDistribution(item)}</TableCell>
                <TableCell>{getArchitecture(item)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <DialogTitle>This package is included in:</DialogTitle>
        <Table>
          <TableBody>
            {inclusions.map((i) => (
              <TableRow key={"included-"+i}>
                <TableCell>{i}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Dialog>
    </Box>
  );
}
