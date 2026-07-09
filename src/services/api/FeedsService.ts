import type { ApiClient } from './ApiClient'
import type {
    Feed,
    FeedInput,
    FeedResponse,
    UnreadCountsResponse,
} from '../../types/feed'
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

    // Light poll of unread counts across all of the user's feeds in one call.
    // Returns a plain map { [feedId]: unreadCount }; feeds with no unread are
    // simply absent (so callers should default missing ids to 0).
    async checkForNewArticles(): Promise<UnreadCountsResponse> {
        return this.client.get<UnreadCountsResponse>(
            '/feeds/check-for-new-articles',
        )
    }

    async create(input: FeedInput): Promise<Feed> {
        const data = await this.client.post<FeedResponse>(
            '/feeds/create',
            input,
        )
        return this.toFeed(data)
    }

    async update(id: string, input: FeedInput): Promise<Feed> {
        const data = await this.client.put<FeedResponse>(`/feeds/${id}`, input)
        return this.toFeed(data)
    }

    async remove(id: string): Promise<void> {
        await this.client.delete<void>(`/feeds/${id}`)
    }

    private toFeed(data: FeedResponse): Feed {
        return { id: data.id, name: data.name, keywords: data.keywords }
    }
}
