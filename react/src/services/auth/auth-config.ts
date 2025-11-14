import { LogLevel } from "@azure/msal-browser";
import type { EnvWindow } from "../services.types";

const ENV = (window as EnvWindow)._env_;
const SCOPES = ENV?.RPM_PACKAGES_AUTH_SCOPES.split(";") ?? [];

export const msalConfig = {
  auth: {
    clientId: ENV?.RPM_PACKAGES_AUTH_CLIENT_ID ?? "",
    authority: ENV?.RPM_PACKAGES_AUTH_AUTHORITY ?? "",
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: SCOPES,
};
