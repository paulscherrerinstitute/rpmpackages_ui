import Topbar from "./components/Topbar/Topbar";
import { NAV_ITEMS } from "./components/helpers/NavbarHelper";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

export function Content() {

    return (<>
        <Topbar />
        <AuthenticatedTemplate>

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
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 20 }}>To view any content, please log in.</Box>
        </UnauthenticatedTemplate>

    </>)
}