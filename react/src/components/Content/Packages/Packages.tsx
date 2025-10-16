import { Box } from "@mui/material";
import PackagesInRepository from "./PackagesInRepository";
import AllPackages from "./AllPackages";
import { useParams } from "react-router-dom";

export function Packages() {
  let { path } = useParams();
  var displayPackagesForRepo: boolean = path !== undefined;

  return (
    <Box component="main">
      {displayPackagesForRepo && <PackagesInRepository />}
      {!displayPackagesForRepo && <AllPackages />}
    </Box>
  );
}
