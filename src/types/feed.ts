export interface Feed {
    id: string
    name: string
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
