import type { ApiClient } from './ApiClient'
import type {
    RssDiscoveryResponse,
    Source,
    SourceInput,
    SourceResponse,
} from '../../types/source'
import type { PaginatedResponse } from '../../types/pagination'

export interface ListSourcesResult {
    items: Source[]
    totalPages: number
    totalCount: number
}

export interface ListSourcesParams {
    page?: number
    // Case-insensitive substring match on the name, applied by the API.
    name?: string
}

export class SourcesService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    // Paginated listing of every source known to the system. Reading is open to
    // any authenticated user; only the write routes are admin-only. The page
    // size follows the API default (20).
    async list(params: ListSourcesParams = {}): Promise<ListSourcesResult> {
        const query = new URLSearchParams({
            page: String(params.page ?? 1),
        })
        if (params.name !== undefined && params.name !== '') {
            query.set('name', params.name)
        }
        const data = await this.client.get<PaginatedResponse<SourceResponse>>(
            `/sources?${query.toString()}`,
        )
        return {
            items: data.docs.map((item) => toSource(item)),
            totalPages: data.pagination.total_pages,
            totalCount: data.pagination.total_count,
        }
    }

    async getById(sourceId: string): Promise<Source> {
        const data = await this.client.get<SourceResponse>(
            `/sources/${encodeURIComponent(sourceId)}`,
        )
        return toSource(data)
    }

    // Finds the RSS feeds advertised by a site. Unlike the write routes below,
    // this one is open to any authenticated user; it only lives behind the
    // administrator UI because that's the sole path to it in this client.
    // An empty list means "no feed found", not an error.
    async discoverRss(url: string): Promise<string[]> {
        const data = await this.client.get<RssDiscoveryResponse>(
            `/sources/rss-discovery?url=${encodeURIComponent(url)}`,
        )
        return data.feeds
    }

    // Admin-only. 409 when another active source already uses the same url.
    async create(input: SourceInput): Promise<Source> {
        const data = await this.client.post<SourceResponse>(
            '/sources/create',
            toRequestBody(input),
        )
        return toSource(data)
    }

    // Admin-only.
    async update(sourceId: string, input: SourceInput): Promise<Source> {
        const data = await this.client.put<SourceResponse>(
            `/sources/${encodeURIComponent(sourceId)}`,
            toRequestBody(input),
        )
        return toSource(data)
    }

    // Admin-only. Soft delete — it cascades to the articles of this source.
    async remove(sourceId: string): Promise<void> {
        await this.client.delete<void>(
            `/sources/${encodeURIComponent(sourceId)}`,
        )
    }
}

function toRequestBody(input: SourceInput) {
    return { name: input.name, url: input.url, url_rss: input.urlRss }
}

// Shared by this service and by the articles listing, which embeds the source
// with `with_sources=true`.
export function toSource(data: SourceResponse): Source {
    return {
        id: data.id,
        name: data.name,
        url: data.url,
        urlRss: data.url_rss,
        createdAt: data.created_at,
    }
}
