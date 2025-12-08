import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllRepositories, getAllPackagesWithRepository } from "../../../services/dataService";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";
import * as r_styles from "./Repositories.styles";
import ClearIcon from "@mui/icons-material/Clear";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { LoadingSpinner, SearchResultsNotes } from "../Details/SearchResultsNotes/SearchResultsNotes";
import {
  RepositoryActionPopup,
  type Action,
} from "./RepositoryActionsPopup/RepositoryActionsPopup";
import { getBackendHealth, getPaths } from "../../../services/infoService";
import { ErrorBar } from "../Details/ErrorBar";
import type { PackageSearchObject, Repository } from "../../../services/dataService.types";
import { handleSearch_RepositoryandPackages } from "../../../services/searchService";

export function Repositories() {
  const [availableRepos, setAvailableRepos] = useState<Repository[]>([]);
  const navigate = useNavigate();
  const [backendIsHealthy, setBackendIsHealthy] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [allPackages, setAllPackages] = useState<PackageSearchObject[]>([]);
  const [paths, setPaths] = useState<string[]>([]);

  async function fetchData() {
    const repos = await getAllRepositories();
    setAvailableRepos(repos);
    const path = await getPaths();
    setPaths(path)
    setIsDataLoading(false);
  }
  useEffect(() => {
    async function load() {
      const health = await getBackendHealth();
      if (health !== "Alive and Well!") {
        setBackendIsHealthy(false);
        return;
      }
      setBackendIsHealthy(true);

      await fetchData();  // loads repos + paths
      const pkgs = await getAllPackagesWithRepository();
      setAllPackages(pkgs);

      setIsDataLoading(false);  // ← move this here!
    }

    load();
  }, []);



  const [repoSearch, setRepoSearch] = useState("");
  const updateRepoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setRepoSearch(e.target.value);
  };

  const clearRepoSearch = () => setRepoSearch("");
  const mapAvailableRepos = (arr: Repository[]) => {
    const mapped = arr.map((f) => {
      return { name: f.element };
    });
    return mapped;
  };

  const [openActionPopup, setOpenActionPopup] = useState<boolean>(false);
  const [action, setAction] = useState<Action>("None");

  const clickActionPopup = (act: Action) => {
    setOpenActionPopup(true);
    setAction(act);
  };

  const closeActionPopup = () => {
    setOpenActionPopup(false);
    getBackendHealth().then((val) => {
      if (val == "Alive and Well!") {
        fetchData();
      }
    })
  };

  return (
    <Box component="main" sx={styles.main}>
      <Box sx={r_styles.body}>
        <ErrorBar open={!backendIsHealthy} />
        <Box sx={r_styles.titleWrapper}>
          <Typography variant="h5">Available Repositories</Typography>
          <Box sx={r_styles.buttonWrapper}>
            <Button variant="outlined" onClick={() => clickActionPopup("Add")}>
              Add
            </Button>
            <Button
              variant="outlined"
              onClick={() => clickActionPopup("Remove")}
            >
              Delete
            </Button>
          </Box>
          <Box sx={r_styles.searchWrapper}>
            <Tooltip title="Start your search with 'pk:' to search repositories by their included packages.">
              <HelpOutlineIcon sx={{ ...styles.clickButtonBig, marginRight: 2 }} />
            </Tooltip>
            <TextField
              variant="standard"
              value={repoSearch}
              onChange={updateRepoSearch}
              label="Search Repos or Package"
              fullWidth
            />
            <Tooltip title="Clear search">
              <ClearIcon onClick={clearRepoSearch} sx={styles.clickButtonBig} />
            </Tooltip>
          </Box>
          <RepositoryActionPopup
            action={action}
            open={openActionPopup}
            onClose={closeActionPopup}
          />
        </Box>
        <Table>
          <TableBody>
            {!isDataLoading && availableRepos.filter(i => handleSearch_RepositoryandPackages(repoSearch, i, allPackages)).map(
              (item) =>
                <TableRow
                  hover
                  key={`repos-${item.element}-${item.directory_index}`}
                  onClick={() => navigate(`/Packages/${item.element.split(".")[0]}?idx=${item.directory_index}`)}
                >
                  <TableCell sx={{ ...styles.clickButton, display: "flex", flexDirection: "row", justifyContent: "space-between" }} key={`repos-${item.element}-${item.directory_index}`}>
                    <span key={`repos-${item.element}-${item.directory_index}-1`}>
                      {item.element.split(".")[0]}
                    </span>
                    <span style={{ color: "rgb(180, 180, 180)" }} key={`repos-${item.element}-${item.directory_index}-path`}>
                      {paths[item.directory_index]}
                    </span>
                  </TableCell>
                </TableRow>
            )}
            <SearchResultsNotes
              allResults={mapAvailableRepos(availableRepos.filter((item) => handleSearch_RepositoryandPackages(repoSearch, item, allPackages)))}
              searchField={repoSearch}
              isLoading={isDataLoading}
              onEmpty="No .repo_cfg files found"
              onNoMatch="No Match"
              onEmptyColor="rgba(255, 0, 0, 0.05)"
            />
          </TableBody>
        </Table>
        <LoadingSpinner isLoading={isDataLoading} />
      </Box>
    </Box>
  );
}
