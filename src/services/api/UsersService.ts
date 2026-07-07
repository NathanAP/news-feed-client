import type { ApiClient } from './ApiClient'
import type { User, UserResponse } from '../../types/user'

export class UsersService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    async getMe(): Promise<User> {
        const data = await this.client.get<UserResponse>('/users/me')
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture ?? null,
            createdAt: data.created_at,
        }
    }
}
