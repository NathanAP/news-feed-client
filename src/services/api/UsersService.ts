import type { ApiClient } from './ApiClient'
import type { User, UserResponse } from '../../types/user'
import type {
    UserPreferences,
    UserPreferencesResponse,
    UpdatePreferencesResponse,
} from '../../types/preferences'

// Result of updating preferences: the updated preferences plus the freshly
// re-issued access token (preferences live in the JWT).
export interface UpdatePreferencesResult {
    preferences: UserPreferences
    accessToken: string
    expiresIn: number
}

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
            admin: data.admin,
        }
    }

    async getPreferences(): Promise<UserPreferences> {
        const data = await this.client.get<UserPreferencesResponse>(
            '/users/me/preferences',
        )
        return this.toPreferences(data)
    }

    async updatePreferences(
        input: UserPreferences,
    ): Promise<UpdatePreferencesResult> {
        const data = await this.client.put<UpdatePreferencesResponse>(
            '/users/me/preferences',
            {
                language_to_translate: input.languageToTranslate,
                ai_personality: input.aiPersonality,
            },
        )
        return {
            preferences: this.toPreferences(data.preferences),
            accessToken: data.access_token,
            expiresIn: data.expires_in,
        }
    }

    private toPreferences(data: UserPreferencesResponse): UserPreferences {
        return {
            languageToTranslate: data.language_to_translate,
            aiPersonality: data.ai_personality,
        }
    }
}
