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
} from "../../../../helper/dataService";
import ClearIcon from "@mui/icons-material/Clear";

export function RepositoryActionPopup({
  action,
  open,
  onClose,
}: RepositoryActionPopupProps) {
  useEffect(() => {
    if (action == "None") onClose;
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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const updateRepository = (e: React.ChangeEvent<any>) => {
    if (e.target) setRepository(e.target.value);
    if (e.target.value == "") setIsDisabled(true);
    else setIsDisabled(false);
  };

  const addRepository = () => {
    if (repository) addRepositoryAndFolder(repository);
    onClose();
  };

  useEffect(() => {
    if (open) {
      setIsDisabled(true);
    }
  }, [open]);

  return (
    <Box>
      <Box sx={rap_styles.clearWrapper}>
        <Typography variant="h6">Add new Repository</Typography>
        <Tooltip title="Close">
          <ClearIcon onClick={onClose} sx={styles.clickButtonBig} />
        </Tooltip>
      </Box>
      <TextField
        variant="standard"
        value={repository}
        onChange={updateRepository}
        label="Repository"
      />
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
  const [repositories, setRepositories] = useState<string[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleRepositoryChange = (e: SelectChangeEvent) => {
    if (e.target.value != "") setIsDisabled(false);
    else setIsDisabled(true);
    setSelectedRepository(e.target.value as string);
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
    if (selectedRepository) removeRepositoryAndFolder(selectedRepository);
    onClose();
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
          value={selectedRepository}
          onChange={handleRepositoryChange}
          id="select"
          labelId="select-label"
          label="Repositories"
        >
          {repositories.map((r) => (
            <MenuItem value={r}>{r}</MenuItem>
          ))}
        </Select>
      </FormControl>
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
