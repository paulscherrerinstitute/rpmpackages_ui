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
} from "../../../../services/dataService";
import { type CreateDirectoryResponse, type Repository } from "../../../../services/dataService.types";
import * as ar_styles from "./AddRepository.styles";
import * as styles from "../../Content.styles";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

export function AddRepositoryPopup({
  open,
  handleClose,
  item,
  inclusions,
}: AddRepository) {
  const [availableRepos, setAvailableRepos] = useState<Repository[]>([]);
  const [newRepoValue, setNewRepoValue] = useState<string>("");
  const [newRepo, setNewRepo] = useState<Repository | undefined>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);


  const fetchRepos = async () => {
    const res = await getAllRepositories();
    setAvailableRepos(res);
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;

    setNewRepoValue(value);

    if (value !== "") {
      setIsDisabled(false);
      setNewRepo(availableRepos.find((r) => r.element === value));
    } else {
      setIsDisabled(true);
      setNewRepo(undefined);
    }
  };

  const doesExist = (repo: string): boolean => {
    if (inclusions.filter((r) => r.element == repo).length > 0) {
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    if (newRepo) {
      const res: CreateDirectoryResponse = await addSubtitlteToRepository(
        newRepo.element,
        "Added via Overview",
        newRepo.directory_index
      );
      await addPackageToRepository(item, newRepo.element, res.index, newRepo.directory_index);
      handleClose();
    }
  };

  useEffect(() => {
    setIsDisabled(true);
  }, []);

  useEffect(() => {
    fetchRepos();
    if(open) setNewRepoValue("")
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
              value={newRepoValue}
              onChange={handleChange}
              labelId="select-label"
              id="select"
              label="Repositories"
            >
              {availableRepos.map((repo) => (
                <MenuItem
                  key={repo.element}
                  disabled={doesExist(repo.element)}
                  value={repo.element}
                >
                  {repo.element}
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
  inclusions: Repository[];
};
