export interface EnvWindow extends Window {
    _env_?: {
        RPM_PACKAGES_INTERNAL_BACKEND_URL: string;
        RPM_PACKAGES_CONFIG_ENDING: string;
        RPM_PACKAGES_PUBLIC_BACKEND_URL: string;
        RPM_PACKAGES_AUTH_CLIENT_ID: string;
        RPM_PACKAGES_AUTH_AUTHORITY: string;
        RPM_PACKAGES_AUTH_SCOPES: string;
    };
}
