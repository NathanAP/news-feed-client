// Content languages known to the API. Lives on its own (rather than inside
// preferences) because two unrelated features use it: the user's translation
// target (`language_to_translate`) and an article's original language
// (`language_original`).
//
// Kept as an `as const` object (not a TS enum) to stay compatible with the
// `erasableSyntaxOnly` tsconfig flag.
export const Language = {
    Pt: 'pt',
    En: 'en',
    Es: 'es',
    Fr: 'fr',
    De: 'de',
    It: 'it',
} as const

export type Language = (typeof Language)[keyof typeof Language]
