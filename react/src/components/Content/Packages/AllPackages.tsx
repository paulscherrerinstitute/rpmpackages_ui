import {
  Box,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import * as styles from "../Content.styles";
import { useEffect, useState } from "react";
import {
  getAllPackages,
  getPackageInclusions,
  removePackageFromRepo,
  updatePackage,
} from "../../../helper/dataService";
import {
  getArchitecture,
  getDistribution,
  getName,
  getVersion,
  getVersionNote,
} from "../../helpers/DetailsHelper";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { AddDetails } from "../Details/AddDetails";
import { DetailsPopup, type DetailsForm } from "../Details/DetailsPopup";

export default function AllPackages() {
  const [data, setData] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [item, setItem] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const resultData = await getAllPackages();
      setData(resultData.sort((a, b) => a.localeCompare(b)));
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

  const handleClose = () => setOpen(false);

  const handleNestedClose = () => {
    setOpenNested(false);
    fetchInclusionData(item);
  };

  const handleAdd = () => setOpenNested(true);

  const handleRemoveAll = async () => {
    const prompt = confirm(
      `Do you want to remove ${item} from all repositories it is contained in?`
    );
    if (prompt) {
      inclusions.forEach(async (it) => {
        await removePackageFromRepo(item, it);
      });
    }
    handleClose();
    await fetchData();
  };

  const handleRemove = async (repo: string) => {
    const prompt = confirm(`Do you want to remove ${item} from ${repo}?`);
    if (prompt) {
      await removePackageFromRepo(item, repo);
    }
    fetchInclusionData(item);
  };

  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleEditClose = async () => {
    setOpenEdit(false);
    await fetchData();
  };

  const handleSave = async (form: DetailsForm) => {
    var pk: string;
    if (form.versionNote !== "") {
      pk = `${form.name}-${form.version}-${form.versionNote}.${form.distribution}.${form.architecture}.rpm`;
    } else {
      pk = `${form.name}-${form.version}.${form.distribution}.${form.architecture}.rpm`;
    }
    inclusions.forEach(async (rep) => {
      await updatePackage(item, pk, rep);
    });
    await fetchData;
    await fetchInclusionData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (inclusions.length == 0) {
      setOpen(false);
    }
    fetchData();
  }, [inclusions]);

  return (
    <Box sx={styles.main}>
      <h2>All Packages</h2>
      <Box>
        <Table>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={`list-${i}`} hover>
                <TableCell>
                  <Typography
                    sx={styles.clickButton}
                    key={item}
                    onClick={() => getInclusions(item)}
                  >
                    {item}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <Box sx={styles.packageTitle}>
          <DialogTitle>{item}</DialogTitle>
          <Box sx={styles.dialogIcons}>
            <Tooltip title="Add to other repository">
              <AddIcon onClick={handleAdd} />
            </Tooltip>
            <Tooltip title="Edit across all repositories">
              <EditIcon onClick={handleEdit} />
            </Tooltip>
            <Tooltip title="Delete in all repositories">
              <DeleteOutlineIcon onClick={handleRemoveAll} />
            </Tooltip>
          </Box>
        </Box>
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
        {inclusions.length > 0 && (
          <Box>
            <DialogTitle>This package is included in:</DialogTitle>
            <Table>
              <TableBody>
                {inclusions.map((i) => (
                  <TableRow hover key={"included-" + i} sx={styles.packageRow}>
                    <TableCell>
                      <Typography
                        sx={styles.clickButton}
                        onClick={() =>
                          navigate(`/Packages/${i.replace(".repo_cfg", "")}`)
                        }
                      >
                        {i}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        sx={styles.clickButtonBig}
                        title="Delete from this repository"
                      >
                        <DeleteOutlineIcon onClick={() => handleRemove(i)} />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <AddDetails
                open={openNested}
                handleClose={handleNestedClose}
                item={item}
                inclusions={inclusions}
              />
            </Table>
          </Box>
        )}
        <DetailsPopup
          open={openEdit}
          pkge={item}
          onSave={(f) => handleSave(f)}
          onClose={handleEditClose}
          isAdd={false}
        ></DetailsPopup>
      </Dialog>
    </Box>
  );
}
