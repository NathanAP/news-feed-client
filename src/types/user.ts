// Domain model (camelCase).
export interface User {
    id: string
    email: string
    name: string
    picture: string | null
    createdAt: string
}

// Raw API DTO (snake_case) from GET /users/me.
export interface UserResponse {
    id: string
    email: string
    name: string
    picture?: string | null
    created_at: string
}
