/*
import { loginRequest } from "./auth-config";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth-config";
import { AuthProvider } from "./AuthProvider";

export async function redoAuthentication({ setIsAuthenticated, msalInstance }: { setIsAuthenticated?: (value: boolean) => void, msalInstance: PublicClientApplication }) {
    await msalInstance.initialize();
    const activeAccount = msalInstance.getActiveAccount();

    if (activeAccount) {
        msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
        })
        if (setIsAuthenticated) setIsAuthenticated(true);
        return true;
    } else {
        if (setIsAuthenticated) setIsAuthenticated(false);
        return false;
    }
}

export async function isUserAuthenticated(msalInstance: PublicClientApplication) {
    await msalInstance.initialize();
    if (msalInstance.getActiveAccount()) {
        return true;
    } else {
        redoAuthentication({ msalInstance });
        window.location.reload();
        return false;
    }
}
    */