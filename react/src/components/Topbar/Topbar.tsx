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
  Button
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { NAV_ITEMS, TITLE } from "../helpers/NavbarHelper";
import { useNavigate } from "react-router-dom";
import * as styles from "./Topbar.styles";
import { loginRequest } from "../../auth/auth-config";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
export default function Topbar(props: Props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {TITLE}
      </Typography>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              sx={styles.topBarButton}
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
    window !== undefined ? () => window().document.body : undefined;

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
            <LoginLogoutComponent />
            {NAV_ITEMS.map((item) => (
              item.key != "Initial" &&
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

function LoginLogoutComponent() {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleLoginRedirect = () => {
    instance.loginRedirect({
      ...loginRequest,
      redirectUri: '/',
    }).catch((error) => console.log(error));
  }

  const handleLogOutRedirect = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/'
    });
    window.location.reload();
  }


  return (
    <>
      <AuthenticatedTemplate>
        <span onClick={handleLogOutRedirect}>Logout</span>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <span onClick={handleLoginRedirect}>Login</span>
      </UnauthenticatedTemplate>
    </>
  )
}
