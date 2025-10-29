import {
  Box,
  Dialog,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import * as styles from "../../Content.styles";
import * as ap_styles from "./AllPackages.styles";
import { useEffect, useState } from "react";
import {
  getAllPackagesOverall,
  getPackageFileFromDirectory,
  getDirectoriesIncludingPkge,
  getRepositoriesOfPackage,
  removePackageFromRepository,
  updatePackageInRepository,
} from "../../../../helper/dataService";
import {
  getArchitecture,
  getDistribution,
  getName,
  getVersion,
  getVersionNote,
} from "../../../helpers/DetailsHelper";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AddDetails } from "../../Details/AddDetails/AddRepository";
import {
  DetailsPopup,
  type DetailsForm,
} from "../../Details/DetailsPopup/DetailsPopup";
import AllPackagesInputPopup from "../../Details/AllPackagesInputPopup/AllPackagesInputPopup";
import { SearchResultsEmpty } from "../../Details/SearchResultsEmpty/SearchResultsEmpty";

export default function AllPackages() {
  const [data, setData] = useState<string[]>([]);
  const [inclusionsInRepositories, setinclusionsInRepositories] = useState<
    string[]
  >([]);
  const [open, setOpen] = useState(false);
  const [openNested, setOpenNested] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [pkge, setPkge] = useState("");
  const [inclusionsInDirectories, setInclusionsInDirectories] = useState<
    string[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [displayInput, setDisplayInput] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const resultData = await getAllPackagesOverall();
      setData(resultData.sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const fetchInclusionData = async (pk: string) => {
    try {
      const resultData = await getRepositoriesOfPackage(pk);
      setinclusionsInRepositories(resultData);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const openPopup = (pk: string) => {
    setOpen(true);
    setPkge(pk);
    fetchInclusionData(pk);
  };

  const handleClose = () => setOpen(false);

  const handleNestedClose = () => {
    setOpenNested(false);
    fetchInclusionData(pkge);
  };

  const handleAdd = () => setOpenNested(true);

  const handleRemoveAll = async () => {
    const prompt = confirm(
      `Do you want to remove ${pkge} from all repositories it is contained in?`
    );
    if (prompt) {
      inclusionsInRepositories.forEach(async (it) => {
        await removePackageFromRepository(pkge, it);
      });
    }
    handleClose();
    await fetchData();
  };

  const handleRemove = async (repo: string) => {
    const prompt = confirm(`Do you want to remove ${pkge} from ${repo}?`);
    if (prompt) {
      await removePackageFromRepository(pkge, repo);
    }
    fetchInclusionData(pkge);
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
    inclusionsInRepositories.forEach(async (rep) => {
      await updatePackageInRepository(pkge, pk, rep);
    });
    await fetchData;
    await fetchInclusionData;
  };

  const fetchInclusionsInDirectories = async () => {
    if (pkge) {
      var inclDirectories = await getDirectoriesIncludingPkge(pkge);
      setInclusionsInDirectories(inclDirectories);
    }
  };

  const fetchFile = async () => {
    if (inclusionsInDirectories.length > 0) {
      const pk = await getPackageFileFromDirectory(
        inclusionsInDirectories[0],
        pkge
      );
      setFile(pk);
    }
  };

  const updatedPackage = async () => {
    await fetchFile();
    await fetchInclusionsInDirectories();
  };

  useEffect(() => {
    fetchData();
    fetchInclusionsInDirectories();
  }, []);

  useEffect(() => {
    if (inclusionsInRepositories.length == 0) {
      setOpen(false);
    }
    fetchData();
    fetchFile();
  }, [inclusionsInRepositories]);

  useEffect(() => {
    fetchInclusionsInDirectories();
    if (open) fetchFile();
  }, [open]);

  useEffect(() => {
    setDisplayInput(
      inclusionsInDirectories.length != inclusionsInRepositories.length
    );
  }, [inclusionsInDirectories]);

  const [packageSearch, setPackageSearch] = useState("");
  const updatePackageSearch = (e: React.ChangeEvent<any>) => {
    if (e.target && e.target.value) {
      setPackageSearch(e.target.value);
    } else setPackageSearch("");
  };

  const clearPackageSearch = () => setPackageSearch("");
  const mapDataForSearchResults = (arr: string[]) => {
    var mapped = arr.map((f) => {
      return {
        name: f,
      };
    });
    return mapped;
  };

  return (
    <Box sx={styles.main}>
      <Box sx={ap_styles.body}>
        <Box sx={ap_styles.titleWrapper}>
          <Typography variant="h5">All Packages</Typography>
          <Box sx={ap_styles.searchWrapper}>
            <TextField
              variant="standard"
              value={packageSearch}
              onChange={updatePackageSearch}
              label="Search Packages"
            />
            <Tooltip title="Clear search">
              <ClearIcon
                onClick={clearPackageSearch}
                sx={styles.clickButtonBig}
              />
            </Tooltip>
          </Box>
        </Box>
        <Table>
          <TableBody>
            {data.map(
              (pkge, i) =>
                (pkge.includes(packageSearch) || packageSearch.length == 0) && (
                  <TableRow key={`${pkge}-${i}`} hover>
                    <TableCell>
                      <Typography
                        sx={styles.clickButton}
                        key={pkge}
                        onClick={() => openPopup(pkge)}
                      >
                        {pkge}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
            )}
            <SearchResultsEmpty
              allResults={mapDataForSearchResults(data)}
              searchField={packageSearch}
              onEmpty="No packages found in any repository"
              onNoMatch="No Match"
              onEmptyColor="rgba(255, 0, 0, 0.05)"
            />
          </TableBody>
        </Table>
      </Box>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <Box sx={styles.packageTitle}>
          <DialogTitle>{pkge}</DialogTitle>
          <Box sx={ap_styles.dialogIcons}>
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
                <TableCell>{getName(pkge)}</TableCell>
                <TableCell>{getVersion(pkge)}</TableCell>
                <TableCell>{getVersionNote(pkge)}</TableCell>
                <TableCell>{getDistribution(pkge)}</TableCell>
                <TableCell>{getArchitecture(pkge)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {inclusionsInRepositories.length > 0 && (
          <Box>
            <DialogTitle>This package is included in:</DialogTitle>
            <Table>
              <TableBody>
                {inclusionsInRepositories.map((i) => (
                  <TableRow
                    hover
                    key={"included-" + i}
                    sx={ap_styles.packageRow}
                  >
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
                    <TableCell
                      colSpan={2}
                      sx={ap_styles.tableFileStatusWrapper}
                    >
                      {Array.isArray(inclusionsInDirectories) &&
                        !inclusionsInDirectories.includes(
                          i.replace(".repo_cfg", "")
                        ) && <Box sx={ap_styles.noFile}>No File detected.</Box>}
                      {Array.isArray(inclusionsInDirectories) &&
                        inclusionsInDirectories.includes(
                          i.replace(".repo_cfg", "")
                        ) && <Box sx={ap_styles.isFile}>File detected.</Box>}
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
                item={pkge}
                inclusions={inclusionsInRepositories}
              />
            </Table>
            <AllPackagesInputPopup
              fileIncludedIn={inclusionsInDirectories}
              packageIncludedIn={inclusionsInRepositories}
              displayInput={displayInput}
              file={file}
              setFile={setFile}
              updatePackages={updatedPackage}
            />
          </Box>
        )}
        <DetailsPopup
          open={openEdit}
          pkge={pkge}
          onSave={(f) => handleSave(f)}
          onClose={handleEditClose}
          isAdd={false}
          enableFileUpload={false}
        ></DetailsPopup>
      </Dialog>
    </Box>
  );
}
