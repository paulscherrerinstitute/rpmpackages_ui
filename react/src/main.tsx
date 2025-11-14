import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./services/auth/AuthProvider";
import { Content } from "./index"

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
    <Content />
    </BrowserRouter>
  </AuthProvider>
);