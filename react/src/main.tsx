import { createRoot } from "react-dom/client";
import Topbar from "./components/Topbar/Topbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { useAuthProvider } from "./auth/AuthProvider";
import { MsalProvider } from "@azure/msal-react";
import { type Configuration, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth/auth-config";

const { AuthProvider } = useAuthProvider();


const pcs = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={pcs}>
    <BrowserRouter>
      <Topbar />
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
      </Routes>
    </BrowserRouter>
  </MsalProvider>
);
