import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // Expose the dev server on the local network (accessible via the machine's
    // LAN IP). Note: reaching the API from a LAN origin requires that origin in
    // the backend's CORS_ALLOWED_ORIGINS, and Google login also requires the
    // matching /auth/callback URL in OAUTH_ALLOWED_REDIRECT_URIS.
    server: { host: true },
})
