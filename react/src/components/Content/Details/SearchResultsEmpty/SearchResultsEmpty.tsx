import { TableRow, TableCell, ListItem, ListItemText } from "@mui/material";
import * as styles from "./SearchResultsEmpty.styles";

export function SearchResultsEmpty({
  allResults,
  searchField,
  onEmpty,
  onEmptyColor,
  onNoMatch,
  onNoMatchColor,
  treatAsList = false,
  isLoading,
}: SearchResultsProps) {
  return (
    <>
      {!treatAsList && !isLoading && (
        <>
          {allResults.length == 0 && searchField.length == 0 && (
            <TableRow sx={styles.empty(onEmptyColor ?? "")}>
              <TableCell>{onEmpty}</TableCell>
            </TableRow>
          )}
          {allResults.filter((f) => f.name.includes(searchField)).length == 0 &&
            searchField.length > 0 && (
              <TableRow sx={styles.noMatch(onNoMatchColor ?? "")}>
                <TableCell>{onNoMatch}</TableCell>
              </TableRow>
            )}
        </>
      )}
      {treatAsList && !isLoading && (
        <>
          {allResults.length == 0 && searchField.length == 0 && (
            <ListItem sx={styles.empty(onEmptyColor ?? "")}>
              <ListItemText>{onEmpty}</ListItemText>
            </ListItem>
          )}
          {allResults.filter((f) => f.name.includes(searchField)).length == 0 &&
            searchField.length > 0 && (
              <ListItem sx={styles.noMatch(onNoMatchColor ?? "")}>
                <ListItemText>{onNoMatch}</ListItemText>
              </ListItem>
            )}
        </>
      )}
    </>
  );
}

type SearchResultsProps = {
  allResults: Results[];
  searchField: string;
  onEmpty: string;
  onEmptyColor?: string;
  onNoMatch: string;
  onNoMatchColor?: string;
  treatAsList?: boolean;
  isLoading?: boolean
};

type Results = {
  name: string;
};
