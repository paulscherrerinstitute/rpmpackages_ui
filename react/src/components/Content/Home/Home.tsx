import { Box, Typography, Toolbar, List, ListItem } from "@mui/material";
import * as styles from "../Content.styles";
import { getBackendHealth, getCurrentHost, getRPMLocation } from "../../../services/infoService";
import { useEffect, useState } from "react";
import { AuthenticatedTemplate } from "@azure/msal-react";

export function Home() {
  const GITHUB_URL = "https://github.com/paulscherrerinstitute/rpmpackages_ui";

  const [settings, setSettings] = useState({
    host: "",
    location: "",
    health: "",
  })

  const fetchData = async () => {
    const health = await getBackendHealth();
    if (health == "Alive and Well!") {
      setSettings({
        host: await getCurrentHost(),
        location: await getRPMLocation(),
        health: await getBackendHealth(),
      })
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <Box component="main" sx={styles.main}>
      <Toolbar />
      <AuthenticatedTemplate>
        <h2>Home</h2>
        <Box>
          This application is a simple UI to manage RPM-Packages and their associated configurations and folders.
          It provides for changes made to packages, adding new packages, adding a new repository or managing orphaned files associated with packages.
          The current configuration is as follows:
          <List>
            <ListItem>Host: {settings.host}</ListItem>
            <ListItem>Location of RPMs: {settings.location}</ListItem>
            <ListItem>Health of Backend: {settings.health}</ListItem>
          </List>
        </Box>
        <Box>
          <h2>Documentation</h2>
          <Typography>
            The Documentation is located <a href={GITHUB_URL}>here</a>.
          </Typography>
          <Box>
            <h2>Acknoledgements</h2>
            <Typography>
              This application was developed by Yannick Wernle.
            </Typography>
            <Typography> © Paul Scherrer Institute 2025</Typography>
          </Box>
        </Box>
      </AuthenticatedTemplate>
    </Box >
  );
}
