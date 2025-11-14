import Topbar from "./components/Topbar/Topbar";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { msalInstance } from "./services/auth/AuthProvider";
import { loginRequest } from "./services/auth/auth-config";
import { useEffect, useState } from "react";
import type { PublicClientApplication } from "@azure/msal-browser";

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

export function redoAuthentication({ setIsAuthenticated, msalInstance }: { setIsAuthenticated: (value: boolean) => void, msalInstance: PublicClientApplication }) {
    const activeAccount = msalInstance.getActiveAccount();
    console.log(activeAccount)

    if (activeAccount) {
        msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
        })
        setIsAuthenticated(true);
        return true;
    } else {
        setIsAuthenticated(false);
        return false;
    }
}

export function isUserAuthenticated(msalInstance: PublicClientApplication) {
    if (msalInstance.getActiveAccount()) {
        return true;
    } else {
        return false;
    }
}
