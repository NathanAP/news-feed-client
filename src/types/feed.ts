export interface Feed {
    id: string
    name: string
    keywords: string[]
}

// Payload for creating/updating a feed (POST /feeds/create, PUT /feeds/:id).
export interface FeedInput {
    name: string
    keywords: string[]
}

// Response of GET /feeds/check-for-new-articles: a flat map keyed by feed id
// whose value is that feed's unread-article count. Only feeds with ≥1 unread
// appear; no unread anywhere → {}.
export type UnreadCountsResponse = Record<string, number>

export interface FeedResponse {
    id: string
    status: string
    name: string
    keywords: string[]
    user_id: string
    created_at: string
    modified_at?: string | null
}

// Strategy the backend used to build the keyword suggestions, echoed in the
// response so the UI can label the list (GET /feeds/keyword-suggestions).
// - related: co-occur with the keywords already picked.
// - popular: most frequent overall (fallback when nothing is picked/related).
export const KeywordSuggestionStrategy = {
    Related: 'related',
    Popular: 'popular',
} as const
export type KeywordSuggestionStrategy =
    (typeof KeywordSuggestionStrategy)[keyof typeof KeywordSuggestionStrategy]

// A single suggested keyword and how many articles currently carry it (signal
// strength), used to rank/weight the suggestion in the UI.
export interface KeywordSuggestion {
    keyword: string
    count: number
}

export interface KeywordSuggestions {
    strategy: KeywordSuggestionStrategy
    suggestions: KeywordSuggestion[]
}
