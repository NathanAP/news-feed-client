import axios from 'axios'
import { API_URL } from '../../config/env'
import type { ApiClient } from './ApiClient'
import type { AuthResponse, AuthTokens } from '../../types/auth'

const AUTH_CALLBACK_PATH = '/auth/callback'

export class AuthService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    // The SPA callback URL the backend redirects back to. Must be registered in
    // the backend allowlist (OAUTH_ALLOWED_REDIRECT_URIS), matched exactly.
    getAuthCallbackUrl(): string {
        return `${window.location.origin}${AUTH_CALLBACK_PATH}`
    }

    // Full-page redirect target that starts the Google OAuth flow.
    getGoogleLoginUrl(): string {
        const redirectUri = encodeURIComponent(this.getAuthCallbackUrl())
        return `${API_URL}/auth/google?redirect_uri=${redirectUri}`
    }

    // Refresh is a public endpoint and must bypass the client interceptors to
    // avoid a refresh-on-401 loop, so it uses a bare Axios call.
    async refresh(refreshToken: string): Promise<AuthTokens> {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/auth/refresh`,
            { refresh_token: refreshToken },
        )
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
        }
    }

    async logout(): Promise<void> {
        await this.client.post<void>('/auth/logout')
    }

    // Development-only shortcut that logs in the seeded dev user without the
    // Google OAuth flow. Like `refresh`, it's a public endpoint that establishes
    // a session, so it uses a bare Axios call to bypass the client interceptors.
    // The backend route only exists when it runs with ENVIRONMENT=development
    // (404 otherwise), and the client gates the button behind DEV_LOGIN_ENABLED.
    async devLogin(): Promise<AuthTokens> {
        const response = await axios.post<AuthResponse>(
            `${API_URL}/users/dev-login`,
        )
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresIn: response.data.expires_in,
        }
    }
}
