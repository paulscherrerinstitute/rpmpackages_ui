import { type EnvWindow } from "./dataService.types"

const env = (window as EnvWindow)._env_;
const API = env?.RPM_PACKAGES_PUBLIC_BACKEND_URL;

export async function getBackendHealth(): Promise<string> {
    try {
        const health = await fetch(`${API}/health`).then(async (res) => {
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

    } catch {
        console.info(
            "[" + new Date().toISOString() + "]",
            "BACKEND:",
            "Dead and definitely not well"
        );
        return "Does not feel so good";
    }
}
