export interface Source {
    id: string
    name: string
    url: string
    urlRss: string
    createdAt: string
}

// Payload accepted by both create and update (the API takes the same shape).
export interface SourceInput {
    name: string
    url: string
    urlRss: string
}

// GET /sources/rss-discovery: the RSS feed URLs found on a site. The list can
// be empty (no feed found) — that isn't an error.
export interface RssDiscoveryResponse {
    feeds: string[]
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
