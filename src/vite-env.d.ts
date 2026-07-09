/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // Optional: when 'true', shows the dev-login button on the login screen.
    // Off by default so it never ships enabled to production.
    readonly VITE_DEV_LOGIN_ENABLED?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
