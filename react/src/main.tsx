import { createRoot } from "react-dom/client";
import Topbar from "./components/Topbar/Topbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { NavItems } from "./components/helpers/NavbarHelper";
import { Packages } from "./components/Content/Packages/Packages";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Topbar />
    <Routes>
      <Route path="/" element={<Navigate to="/Home" replace />} />
      {NavItems.map((item) => (
        <Route
          key={item.key}
          path={item.path + "/:path"}
          element={<item.component />}
        />
      ))}
      {NavItems.map((item) => (
        <Route key={item.key} path={item.path} element={<item.component />} />
      ))}
    </Routes>
  </BrowserRouter>
);
