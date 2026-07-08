import type { Source, SourceResponse } from './source'

// `null` = not in any of the user's feeds; `false`/`true` = unread/read.
// GET /feeds/:id/articles always resolves this to a boolean (the article is,
// by definition, in that feed); GET /articles/:id can return `null`.
export type ArticleReadState = boolean | null

export interface Article {
    id: string
    title: string
    content: string
    createdAt: string
    sourceId: string
    // Populated only when the fetching route resolves it (e.g. the feed
    // listing with with_sources=true); GET /articles/:id leaves this null.
    source: Source | null
    isRead: ArticleReadState
}

export interface ArticleResponse {
    id: string
    status: string
    title: string
    content: string
    url_original: string
    keywords: string[]
    source_id: string
    language_original?: string | null
    created_at: string
    modified_at?: string | null
    is_read?: ArticleReadState
    source?: SourceResponse
}
