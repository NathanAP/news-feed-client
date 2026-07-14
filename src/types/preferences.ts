// Enums mirror the API. Kept as `as const` objects (not TS enums) to stay
// compatible with the `erasableSyntaxOnly` tsconfig flag.

// Target language for on-demand content translation. Distinct from the UI
// language switcher (PT/EN, client-side). `null` means translation is off.
export const Language = {
    Pt: 'pt',
    En: 'en',
    Es: 'es',
    Fr: 'fr',
    De: 'de',
    It: 'it',
} as const
export type Language = (typeof Language)[keyof typeof Language]

// Tone the AI adopts when translating content.
export const AiPersonality = {
    Fun: 'fun',
    Mixed: 'mixed',
    Informative: 'informative',
} as const
export type AiPersonality = (typeof AiPersonality)[keyof typeof AiPersonality]

// Domain model (camelCase). `theme` is no longer a server preference — it lives
// only on the client (MUI color scheme + localStorage). `languageToTranslate`
// null = translation disabled (it also merges the old translate_content flag).
export interface UserPreferences {
    languageToTranslate: Language | null
    aiPersonality: AiPersonality
}

// Raw API DTO (snake_case) from GET/PUT /users/me/preferences.
export interface UserPreferencesResponse {
    language_to_translate: Language | null
    ai_personality: AiPersonality
}

// PUT /users/me/preferences returns a freshly-minted access_token (preferences
// live in the JWT) alongside the updated preferences.
export interface UpdatePreferencesResponse {
    access_token: string
    expires_in: number
    preferences: UserPreferencesResponse
}
