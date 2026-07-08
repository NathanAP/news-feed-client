import type { ApiClient } from './ApiClient'
import type { Feed, FeedResponse } from '../../types/feed'
import type { PaginatedResponse } from '../../types/pagination'

export class FeedsService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    // Default page_size (20) comfortably covers the 5-active-feeds limit.
    async list(): Promise<Feed[]> {
        const data =
            await this.client.get<PaginatedResponse<FeedResponse>>('/feeds')
        return data.docs.map((item) => this.toFeed(item))
    }

    private toFeed(data: FeedResponse): Feed {
        return { id: data.id, name: data.name }
    }
}
