/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_BASE_URL: string;
    // Add other VITE_ prefixed variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
