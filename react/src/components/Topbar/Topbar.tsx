import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NAV_ITEMS, TITLE } from "../helpers/NavbarHelper";
import { useNavigate } from "react-router-dom";
import * as styles from "./Topbar.styles";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";
import { type EnvWindow } from "../../services/dataService.types";

const drawerWidth = 240;
const env = (window as EnvWindow)._env_;
const API = env?.RPM_PACKAGES_PUBLIC_BACKEND_URL;
const WS_URL = API?.includes("http") ? `ws://${API.replace(/^https?:\/\//g, "")}/ws` : `ws://${window.location.hostname}${API}/ws`
export default function Topbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {TITLE}
      </Typography>
      <Divider />
      <List sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "100%" }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              sx={{ ...styles.topBarButton, color: "black" }}
              onClick={() => navigate(item.path)}
            >
              <ListItemText primary={item.key} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window.document.body;

  const { lastJsonMessage } = useWebSocket(
    WS_URL, { share: false, onOpen: () => console.info("Connected to Websocket and listening for external changes"), shouldReconnect: () => true }
  )

  useEffect(() => {
    if (lastJsonMessage != null) {
      const lastEvent = JSON.parse(`${lastJsonMessage}`);
      const file = lastEvent.name.split("\\").reverse()[0]
      console.info(
        "[" + new Date().toISOString() + "]",
        `External Input has been recorded: "${file}" has been ${lastEvent.type}.`,
      );
      window.location.reload();
    }
  }, [lastJsonMessage])

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {TITLE}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.key}
                sx={styles.topBarButton}
                onClick={() => navigate(item.path)}
              >
                {item.key}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
