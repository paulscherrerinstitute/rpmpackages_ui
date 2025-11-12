import { Box } from "@mui/material";
import PackagesInRepository from "./PackagesInRepository/PackagesInRepository";
import AllPackages from "../Packages/AllPackages/AllPackages";
import { useParams } from "react-router-dom";
import { ErrorBar } from "../Details/ErrorBar";
import { useEffect, useState } from "react";
import { getBackendHealth } from "../../../services/infoService";
import { AuthenticatedTemplate } from "@azure/msal-react";

export function Packages() {
  const { path } = useParams();
  const displayPackagesForRepo: boolean = path !== undefined;
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);

  useEffect(() => {
    getBackendHealth().then((val) => {
      if (val == "Alive and Well!") {
        setIsBackendHealthy(true);
      } else {
        setIsBackendHealthy(false);
      }
    });
  }, []);

  return (
    <Box component="main">
      <ErrorBar open={!isBackendHealthy} />
      <AuthenticatedTemplate>
        {displayPackagesForRepo && <PackagesInRepository />}
        {!displayPackagesForRepo && <AllPackages />}
      </AuthenticatedTemplate>
    </Box>
  );
}
