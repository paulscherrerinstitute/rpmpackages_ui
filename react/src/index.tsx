import Topbar from "./components/Topbar/Topbar";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { msalInstance } from "./services/auth/authservice";
import { useEffect, useState } from "react";
import { redoAuthentication } from "./services/auth/authservice";

export function Content() {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        authenticate();
    }, [])

    return (<>
        <Topbar />
        {isAuthenticated ? (
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
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>To view any content, please log in.</Box>)
        }
    </>)

    function authenticate() {
        msalInstance.initialize();
        redoAuthentication({ setIsAuthenticated, msalInstance });
    }
}