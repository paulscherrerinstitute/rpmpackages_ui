import { type EnvWindow } from "./services.types"
import { msalInstance } from "./auth/AuthProvider";
import { loginRequest } from "./auth/auth-config";

const TOKEN: string = msalInstance.getActiveAccount()?.idToken ?? "";
// const ACCESSTOKEN = account?.idToken;
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
}

const ENV = (window as EnvWindow)._env_;
const API = ENV?.RPM_PACKAGES_PUBLIC_BACKEND_URL;

export async function getCurrentHost(): Promise<string> {
    try {
        const host = await fetch(`${API}/host`, { headers: DEFAULT_HEADERS }).then((res) => {
            const data = res.json();
            return data;
        })
        return host;
    } catch (error) {
        checkForceLogin(error);
        return "";
    }
}

export async function getRPMLocation(): Promise<string> {
    try {

        const location = await fetch(`${API}/location`, { headers: DEFAULT_HEADERS }).then((res) => {
            const data = res.json();
            return data;
        })
        return location;
    } catch (error) {
        checkForceLogin(error);
        return "";
    }
}

export async function getBackendHealth(): Promise<string> {
    try {
        const health = await fetch(`${API}/health`, { headers: DEFAULT_HEADERS }).then(async (res) => {
            const data = res.json();
            return data;
        });
        if (health) {
            console.info(
                "[" + new Date().toISOString() + "]",
                "BACKEND: ",
                health.message
            );
            return health.message;
        }
        return "";

    } catch (error) {
        checkForceLogin(error);
        console.info(
            "[" + new Date().toISOString() + "]",
            "BACKEND:",
            "Dead and definitely not well"
        );
        return "Does not feel so good";
    }
}

function checkForceLogin(error: any) {
    if (error?.status == 401) {
        msalInstance.loginRedirect({
            ...loginRequest
        })
    }
}