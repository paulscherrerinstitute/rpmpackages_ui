import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Tooltip
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { NAV_ITEMS, TITLE } from "../helpers/NavbarHelper";
import { useNavigate } from "react-router-dom";
import * as styles from "./Topbar.styles";
import { loginRequest } from "../../services/auth/auth-config";
import { msalInstance } from "../../services/auth/AuthProvider";
import { isUserAuthenticated } from "../..";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}
const drawerWidth = 240;
export default function Topbar(props: Props) {
  const path = window.location.pathname;
  const navigate = useNavigate();
  const windowProps = props?.window;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6">
        {TITLE}
      </Typography>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              id={item.path}
              sx={styles.topBarButton(item, path)}
              onClick={() => navigate(item.path)}
            >
              <ListItemText primary={item.key} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    windowProps !== undefined ? () => windowProps().document.body : undefined;

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
              item.key != "Initial" &&
              <Button
                key={item.key}
                sx={styles.topBarButton(item, path)}
                onClick={() => navigate(item.path)}
              >
                {item.key}
              </Button>
            ))}
            <LoginLogoutComponent />
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

function LoginLogoutComponent() {
  const activeAccount = msalInstance.getActiveAccount();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleLoginRedirect = () => {
    msalInstance.loginRedirect({
      ...loginRequest
    }).catch((error) => console.error(error));
  }

  const handleLogOutRedirect = () => {
    msalInstance.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
    window.location.reload();
  }

  const authenticate = () => {
    msalInstance.initialize();
    const auth = isUserAuthenticated(msalInstance);
    setIsAuthenticated(auth)
  }

  useEffect(() => {
    authenticate();
  }, [])

  return (
    <>
      {isAuthenticated ?
        <Tooltip title={"Logged in as " + activeAccount?.name}>
          <Button sx={styles.logoutButton} onClick={handleLogOutRedirect}>Logout</Button>
        </Tooltip>
        :
        <Button sx={styles.loginButton} onClick={handleLoginRedirect}>Login</Button>
      }
    </>
  )
}
