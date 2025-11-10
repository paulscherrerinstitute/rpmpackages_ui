import { type AuthenticationResult, EventType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./auth-config";
import { MsalProvider } from "@azure/msal-react";
import { type ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

const msalInstance = new PublicClientApplication(msalConfig);
export const AuthProvider = ({ children }: AuthProviderProps) => {

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.enableAccountStorageEvents();

    msalInstance.addEventCallback((event) => {
        var authenticationResult = event?.payload as AuthenticationResult;
        if (event.eventType === EventType.LOGIN_SUCCESS && authenticationResult?.account) {
            const account = authenticationResult?.account;
            msalInstance.setActiveAccount(account);
            window.location.reload();
        }
    });

    console.log(msalInstance.getAllAccounts())

    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export function useAuthProvider() {
    return { AuthProvider };
}