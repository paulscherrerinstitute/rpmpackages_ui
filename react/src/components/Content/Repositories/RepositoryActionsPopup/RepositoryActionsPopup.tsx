import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as styles from "./RepositoryActionsPopup.styles";
import {
  addRepositoryAndFolder,
  getAllRepositories,
  removeRepositoryAndFolder,
} from "../../../../helper/dataService";

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
      <Box sx={styles.wrapper}>
        <Box sx={styles.content}>
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

function ActionPopupAdd({ onClose }: ActionPopupElementProps) {
  const [repository, setRepository] = useState("");

  const updateRepository = (e: React.ChangeEvent<any>) => {
    if (e.target) setRepository(e.target.value);
  };

  const addRepository = () => {
    console.log("ADD", repository);
    if (repository) addRepositoryAndFolder(repository);
    onClose();
  };
  return (
    <Box>
      <Typography variant="h6">Add new Repository</Typography>
      <TextField
        variant="standard"
        value={repository}
        onChange={updateRepository}
        label="Repository"
      />
      <Button variant="outlined" onClick={addRepository}>
        Add
      </Button>
    </Box>
  );
}

function ActionPopupRemove({ open, onClose }: ActionPopupElementProps) {
  const [repositories, setRepositories] = useState<string[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<string>("");

  const handleRepositoryChange = (e: SelectChangeEvent) => {
    setSelectedRepository(e.target.value as string);
  };

  const fetchData = async () => {
    const data = await getAllRepositories();
    setRepositories(data);
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const removeRepository = () => {
    if (selectedRepository) removeRepositoryAndFolder(selectedRepository);
    onClose();
  };

  return (
    <Box sx={styles.selectWrapper}>
      <Typography variant="h6">Remove Repository</Typography>
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
      <Button variant="outlined" onClick={removeRepository}>
        Remove
      </Button>
    </Box>
  );
}
