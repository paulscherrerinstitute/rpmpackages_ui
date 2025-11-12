import { createRoot } from "react-dom/client";
import Topbar from "./components/Topbar/Topbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { AuthProvider, msalInstance } from "./auth/AuthProvider";
import { Box } from "@mui/material";
import { loginRequest } from "./auth/auth-config";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <Topbar />
      {await isAuthenticated() ? (

        <Routes>
          {NAV_ITEMS.map((item) => (
            <Route
              key={item.key}
              path={item.path + "/:path"}
              element={<item.component />}
            />
          ))}
          {NAV_ITEMS.map((item) => (
            <Route key={item.key} path={item.path} element={<item.component />} />
          ))}
        </Routes>) : (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>NOT AUTHORIZED: To view any content, please log in.</Box>)
      }
    </BrowserRouter>
  </AuthProvider>
);

async function isAuthenticated() {
  await msalInstance.initialize();
  const activeAccount = msalInstance.getActiveAccount();


  if (activeAccount) {
    await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: activeAccount,
    })
    return true;
  } else {
    return false
  }
}