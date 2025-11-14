import { loginRequest } from "./auth-config";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth-config";
import { AuthProvider } from "./AuthProvider";

export function redoAuthentication({ setIsAuthenticated, msalInstance }: { setIsAuthenticated: (value: boolean) => void, msalInstance: PublicClientApplication }) {
    const activeAccount = msalInstance.getActiveAccount();

    if (activeAccount) {
        msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
        })
        setIsAuthenticated(true);
        window.location.reload();
        return true;
    } else {
        setIsAuthenticated(false);
        window.location.reload();
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

export const msalInstance = new PublicClientApplication(msalConfig);
export function useAuthProvider() {
    return { AuthProvider };
}