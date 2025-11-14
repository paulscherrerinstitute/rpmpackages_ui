import { type EnvWindow } from "./services.types"
import { msalInstance } from "./auth/authservice";
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
    const host = await fetch(`${API}/host`, { headers: DEFAULT_HEADERS }).then((res) => {
        const data = res.json();
        return data;
    })
    return host;
}

export async function getRPMLocation(): Promise<string> {
    const location = await fetch(`${API}/location`, { headers: DEFAULT_HEADERS }).then((res) => {
        const data = res.json();
        return data;
    })
    return location;
}

export async function getBackendHealth(): Promise<string> {
    try {

        const health = await fetch(`${API}/health`, { headers: DEFAULT_HEADERS }).then(async (res) => {
            const data = res.json();
            return data;
        });

        if (health?.message) {
            console.info(
                "[" + new Date().toISOString() + "]",
                "BACKEND: ",
                health.message
            );
            return health.message;
        } else if (health?.detail.error == "invalid_token") {
            await msalInstance.loginRedirect({
                ...loginRequest
            })
            return "Unauthenticated"
        } else return "";
    } catch (error) {
        return String(error);
    }
}