import ky, { KyInstance, Options } from "ky";
import { APP_BASE_URL } from "../bootstarp";

export function http(prefix: string, options?: Options): KyInstance {
    return ky.extend({
        // prefixUrl: `http://localhost:8000${prefix}`,
        prefixUrl: `${import.meta.env.VITE_APP_BASE_URL}${prefix}`,
        credentials: "include",
        hooks: {
            beforeRequest: [
                (request) => {
                    const token = xsrfToken();
                    if (token) {
                        request.headers.set("X-XSRF-TOKEN", token);
                    }
                },
            ],
        },
        ...options,
    });
}

function xsrfToken(): string | undefined {
    const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];
    return xsrfToken ? decodeURIComponent(xsrfToken) : undefined;
}
