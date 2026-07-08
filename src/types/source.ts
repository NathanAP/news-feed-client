export interface Source {
    id: string
    name: string
    url: string
}

export interface SourceResponse {
    id: string
    status: string
    name: string
    url: string
    url_rss: string
    created_at: string
    modified_at?: string | null
}
