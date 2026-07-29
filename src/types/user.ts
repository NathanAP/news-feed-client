// Domain model (camelCase).
export interface User {
    id: string
    email: string
    name: string
    picture: string | null
    createdAt: string
    // UI hint only: the API re-checks the flag in the database on every
    // admin-only request, so this decides what to render, never what is allowed.
    admin: boolean
}

// Raw API DTO (snake_case) from GET /users/me.
export interface UserResponse {
    id: string
    email: string
    name: string
    picture?: string | null
    created_at: string
    admin: boolean
}
