// Domain model (camelCase) used across the app.
export interface AuthTokens {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

// Raw API DTO (snake_case) returned by the /auth endpoints.
export interface AuthResponse {
    access_token: string
    refresh_token: string
    expires_in: number
}
