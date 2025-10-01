import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Topbar from "./components/Topbar/Topbar";
import Content from "./components/Content/Content";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Topbar />
    <Content />
  </StrictMode>
);
