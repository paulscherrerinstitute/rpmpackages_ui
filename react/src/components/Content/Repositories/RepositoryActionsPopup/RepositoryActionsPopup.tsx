import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as rap_styles from "./RepositoryActionsPopup.styles";
import * as styles from "../../Content.styles";
import {
  addRepositoryAndFolder,
  getAllRepositories,
  removeRepositoryAndFolder,
} from "../../../../services/dataService";
import ClearIcon from "@mui/icons-material/Clear";
import type { Repository } from "../../../../services/dataService.types";
import { getPaths } from "../../../../services/infoService";

export function RepositoryActionPopup({
  action,
  open,
  onClose,
}: RepositoryActionPopupProps) {
  useEffect(() => {
    if (action == "None") onClose();
  }, []);
  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={rap_styles.wrapper}>
        <Box sx={rap_styles.content}>
          {action == "Add" && <ActionPopupAdd open={open} onClose={onClose} />}
          {action == "Remove" && (
            <ActionPopupRemove open={open} onClose={onClose} />
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

type RepositoryActionPopupProps = {
  action: Action;
  open: boolean;
  onClose: () => void;
};

type ActionPopupElementProps = {
  open?: boolean;
  onClose: () => void;
};

export type Action = "Add" | "Remove" | "None";

function ActionPopupAdd({ open, onClose }: ActionPopupElementProps) {
  const [repository, setRepository] = useState("");
  const [paths, setPaths] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const updateRepository = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setRepository(e.target.value);
  };

  const addRepository = () => {
    if (repository) addRepositoryAndFolder(repository, paths.indexOf(selectedPath));
    onClose();
  };

  const fetchPaths = async () => {
    getPaths().then((val) => {
      setPaths(val)
    })
  }

  const handleChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectedPath(value)
  }

  useEffect(() => {
    if (open) {
      fetchPaths()
      setIsDisabled(true);
    }
  }, [open]);

  useEffect(() => {
    if (repository != "" && selectedPath != "") {
      setIsDisabled(false)
    } else setIsDisabled(true)
  }, [repository, selectedPath])

  return (
    <Box>
      <Box sx={rap_styles.clearWrapper}>
        <Typography variant="h6">Add new Repository</Typography>
        <Tooltip title="Close">
          <ClearIcon onClick={onClose} sx={styles.clickButtonBig} />
        </Tooltip>
      </Box>
      <Box sx={{ "& > *": {marginTop: 2}}}>
        <TextField
          variant="standard"
          value={repository}
          onChange={updateRepository}
          label="Repository"
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="select-label">Save at path:</InputLabel>
          <Select
            value={selectedPath}
            onChange={handleChange}
            id="select"
            labelId="select-label"
            label="Save at path:"
          >
            {paths.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={rap_styles.buttonWrapper}>
        <Button
          variant="outlined"
          disabled={isDisabled}
          onClick={addRepository}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}

function ActionPopupRemove({ open, onClose }: ActionPopupElementProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [selectedRepoValue, setSelectedRepoValue] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleRepositoryChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;

    setSelectedRepoValue(value);

    if (value !== "") {
      setIsDisabled(false);
      const repo = repositories.find((r) => r.element === value) || null;
      setSelectedRepository(repo);
    } else {
      setIsDisabled(true);
      setSelectedRepository(null);
    }
  };

  const fetchData = async () => {
    const data = await getAllRepositories();
    setRepositories(data);
  };

  useEffect(() => {
    if (open) {
      fetchData();
      setIsDisabled(true);
    }
  }, [open]);

  const removeRepository = () => {
    const prompt = confirm(`Do you want to permanently delete the repository '${selectedRepository?.element}'?`)
    if (prompt) {
      if (selectedRepository) removeRepositoryAndFolder(selectedRepository.element, selectedRepository.dir_idx);
      onClose();
    }
  };

  return (
    <Box sx={rap_styles.selectWrapper}>
      <Box sx={rap_styles.clearWrapper}>
        <Typography variant="h6">Remove Repository</Typography>
        <Tooltip title="Close">
          <ClearIcon onClick={onClose} sx={styles.clickButtonBig} />
        </Tooltip>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="select-label">Repositories</InputLabel>
        <Select
          value={selectedRepoValue}
          onChange={handleRepositoryChange}
          id="select"
          labelId="select-label"
          label="Repositories"
        >
          {repositories.map((r) => (
            <MenuItem key={r.element} value={r.element}>
              {r.element}
            </MenuItem>
          ))}
        </Select> </FormControl>
      <Box sx={rap_styles.buttonWrapper}>
        <Button
          variant="outlined"
          disabled={isDisabled}
          onClick={removeRepository}
        >
          Remove
        </Button>
      </Box>
    </Box>
  );
}
