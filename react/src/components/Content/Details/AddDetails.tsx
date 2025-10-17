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
} from "@mui/material";
import {
  getAvailableRepos,
  addPackageToRepo,
  createNewDirectoryInRepo,
  type CreateDirectoryResponse,
} from "../../../helper/dataService";
import * as styles from "./AddDetails.styles";
import { useEffect, useState } from "react";

export function AddDetails({
  open,
  handleClose,
  item,
  inclusions,
}: AddDetails) {
  const [availableRepos, setAvailableRepos] = useState<string[]>([]);
  const [newRepo, setNewRepo] = useState("");

  const fetchRepos = async () => {
    const res = await getAvailableRepos();
    setAvailableRepos(res);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setNewRepo(event.target.value as string);
  };

  const doesExist = (repo: string): boolean => {
    if (inclusions.includes(repo)) {
      return true;
    }
    return false;
  };

  const handleAdd = async () => {
    const res: CreateDirectoryResponse = await createNewDirectoryInRepo(
      newRepo,
      "Added via Overiew"
    );
    await addPackageToRepo(item, newRepo, res.index);
    handleClose();
  };

  useEffect(() => {
    setNewRepo("");
    fetchRepos();
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Box sx={styles.dialogueWrapper}>
        <Box sx={styles.formWrapper}>
          <Typography variant="h6">{item}</Typography>
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
            <Box sx={styles.formControl}>
              <Button color="primary" onClick={handleAdd}>
                Add
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>
    </Dialog>
  );
}

type AddDetails = {
  open: boolean;
  handleClose: () => void;
  item: string;
  inclusions: string[];
};
