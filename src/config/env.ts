const rawApiUrl = import.meta.env.VITE_API_URL

if (!rawApiUrl) {
    throw new Error('VITE_API_URL is not defined. Check your .env file.')
}

// Base URL of the news-feed API, including the version prefix (e.g. .../v1).
export const API_URL: string = rawApiUrl

// Whether to show the dev-login button. Gated by an env flag so the button is
// never present in production, regardless of whether the backend dev-login
// route happens to be mounted. The matching backend route only exists when the
// API runs with ENVIRONMENT=development.
export const DEV_LOGIN_ENABLED: boolean =
    import.meta.env.VITE_DEV_LOGIN_ENABLED === 'true'
