import type { ApiClient } from './ApiClient'
import type { Source, SourceResponse } from '../../types/source'
import type { PaginatedResponse } from '../../types/pagination'

export interface ListSourcesResult {
    items: Source[]
    totalPages: number
    totalCount: number
}

export class SourcesService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    // Paginated listing of every source known to the system. Reading is open to
    // any authenticated user; only the write routes are admin-only. The page
    // size follows the API default (20).
    async list(page: number): Promise<ListSourcesResult> {
        const data = await this.client.get<PaginatedResponse<SourceResponse>>(
            `/sources?page=${String(page)}`,
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
