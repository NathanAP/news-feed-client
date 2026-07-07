const rawApiUrl = import.meta.env.VITE_API_URL

if (!rawApiUrl) {
    throw new Error('VITE_API_URL is not defined. Check your .env file.')
}

// Base URL of the news-feed API, including the version prefix (e.g. .../v1).
export const API_URL: string = rawApiUrl
