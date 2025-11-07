import { TableRow, TableCell, ListItem, ListItemText, Box, CircularProgress } from "@mui/material";
import * as styles from "./SearchResultsNotes.styles";

export function SearchResultsNotes({
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
      {!isLoading &&
        <>
          {!treatAsList && (
            <EmptySearchTable
              allResults={allResults}
              searchField={searchField}
              onEmpty={onEmpty}
              onNoMatch={onNoMatch}
              onNoMatchColor={onNoMatchColor}
              onEmptyColor={onEmptyColor}
            />
          )}
          {treatAsList && (
            <EmptySearchList
              allResults={allResults}
              searchField={searchField}
              onEmpty={onEmpty}
              onNoMatch={onNoMatch}
              onNoMatchColor={onNoMatchColor}
              onEmptyColor={onEmptyColor}
            />
          )}
        </>
      }
    </>
  );
}

function EmptySearchTable({ allResults, searchField, onEmpty, onNoMatch, onNoMatchColor, onEmptyColor }: SearchResultsProps) {
  return <>
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
}

function EmptySearchList({ allResults, searchField, onEmpty, onNoMatch, onNoMatchColor, onEmptyColor }: SearchResultsProps) {
  return <>
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

export function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return <>
    {isLoading && <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <CircularProgress />
    </Box>}
  </>
}