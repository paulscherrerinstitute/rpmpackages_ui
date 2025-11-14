import {
  Dialog,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
  Button,
  Tooltip,
} from "@mui/material";
import {
  getAllRepositories,
  addPackageToRepository,
  addSubtitlteToRepository,
} from "../../../../services/dataService/dataService";
import { type CreateDirectoryResponse } from "../../../../services/dataService/dataService.types";
import * as ar_styles from "./AddRepository.styles";
import * as styles from "../../Content.styles";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { getBackendHealth } from "../../../../services/infoService";

export function AddRepositoryPopup({
  open,
  handleClose,
  item,
  inclusions,
}: AddRepository) {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);
  const [newRepo, setNewRepo] = useState("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const fetchRepos = async () => {
    getBackendHealth().then(async (val) => {
      if (val == "Alive and Well!"){
        const res = await getAllRepositories();
        setAvailableRepos(res);
      }
    })
  };

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value != "") setIsDisabled(false);
    else setIsDisabled(true);
    setNewRepo(event.target.value as string);
  };

  const doesExist = (repo: string): boolean => {
    if (inclusions.includes(repo)) {
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    const res: CreateDirectoryResponse = await addSubtitlteToRepository(
      newRepo,
      "Added via Overview"
    );
    await addPackageToRepository(item, newRepo, res.index);
    handleClose();
  };

  useEffect(() => {
    setIsDisabled(true);
  }, []);

  useEffect(() => {
    setNewRepo("");
    fetchRepos();
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Box sx={ar_styles.dialogueWrapper}>
        <Box sx={ar_styles.formWrapper}>
          <Box sx={ar_styles.clearWrapper}>
            <Typography variant="h6">{item}</Typography>
            <Tooltip title="Close">
              <ClearIcon sx={styles.clickButtonBig} onClick={handleClose} />
            </Tooltip>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="select-label">Repositories</InputLabel>
            <Select
              value={newRepo}
              onChange={handleChange}
              labelId="select-label"
              id="select"
              label="Repositories"
            >
              {availableRepos.map((repo) => (
                <MenuItem disabled={doesExist(repo)} value={repo}>
                  {repo}
                </MenuItem>
              ))}
            </Select>
            <Box sx={ar_styles.formControl}>
              <Button
                color="primary"
                variant="outlined"
                disabled={isDisabled}
                onClick={handleAdd}
              >
                Add
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Dialog>
  );
}

type AddRepository = {
  open: boolean;
  handleClose: () => void;
  item: string;
  inclusions: string[];
};
