import ky, { KyInstance, Options } from "ky";

export function http(prefix: string, options?: Options): KyInstance {
    return ky.extend({
        prefixUrl: `http://localhost:8000${prefix}`,
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
