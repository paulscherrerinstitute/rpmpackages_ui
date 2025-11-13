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
import { getAllRepositories } from "../../../services/dataService/dataService";
import * as styles from "../Content.styles";
import { useNavigate } from "react-router-dom";
import * as r_styles from "./Repositories.styles";
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingSpinner, SearchResultsNotes } from "../Details/SearchResultsNotes/SearchResultsNotes";
import {
  RepositoryActionPopup,
  type Action,
} from "./RepositoryActionsPopup/RepositoryActionsPopup";
import { getBackendHealth } from "../../../services/infoService";
import { ErrorBar } from "../Details/ErrorBar";
import { AuthenticatedTemplate } from "@azure/msal-react";

export function Repositories() {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);
  const navigate = useNavigate();
  const [backendIsHealthy, setBackendIsHealthy] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const repos = await getAllRepositories();
      setAvailableRepos(repos);
      setIsDataLoading(false);
    }
    getBackendHealth().then((val) => {
      if (val == "Alive and Well!") {
        fetchData();
        setBackendIsHealthy(true);
      } else {
        setBackendIsHealthy(false);
      }
    });
  }, []);

  const [repoSearch, setRepoSearch] = useState("");
  const updateRepoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setRepoSearch(e.target.value);
  };

  const clearRepoSearch = () => setRepoSearch("");
  const mapAvailableRepos = (arr: string[]) => {
    const mapped = arr.map((f) => {
      return { name: f };
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
  };

  const [isDataLoading, setIsDataLoading] = useState(true);

  return (
    <Box component="main" sx={styles.main}>
      <AuthenticatedTemplate>

        <Box sx={r_styles.body}>
          <ErrorBar open={!backendIsHealthy} />
          <Box sx={r_styles.titleWrapper}>
            <Typography variant="h5">Available Repositories</Typography>
            <Box sx={r_styles.buttonWrapper}>
              <Button variant="outlined" onClick={() => clickActionPopup("Add")}>
                Add Repo
              </Button>
              <Button
                variant="outlined"
                onClick={() => clickActionPopup("Remove")}
              >
                Delete Repo
              </Button>
            </Box>
            <Box sx={r_styles.searchWrapper}>
              <TextField
                variant="standard"
                value={repoSearch}
                onChange={updateRepoSearch}
                label="Search Packages"
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
              {!isDataLoading && availableRepos.map(
                (item) =>
                  (item.includes(repoSearch) || repoSearch.length == 0) && (
                    <TableRow
                      hover
                      key={`repos-${item}`}
                      onClick={() => navigate(`/Packages/${item.split(".")[0]}`)}
                    >
                      <TableCell sx={styles.clickButton}>
                        {item.split(".")[0]}
                      </TableCell>
                    </TableRow>
                  )
              )}
              <SearchResultsNotes
                allResults={mapAvailableRepos(availableRepos)}
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
      </AuthenticatedTemplate>
    </Box>
  );
}
