import { createRoot } from "react-dom/client";
import Topbar from "./components/Topbar/Topbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { AuthProvider } from "./auth/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
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
  </AuthProvider>
);
