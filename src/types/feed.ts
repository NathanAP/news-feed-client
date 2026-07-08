export interface Feed {
    id: string
    name: string
}

export interface FeedResponse {
    id: string
    status: string
    name: string
    keywords: string[]
    user_id: string
    created_at: string
    modified_at?: string | null
}
