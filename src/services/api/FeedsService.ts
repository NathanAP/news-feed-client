import type { ApiClient } from './ApiClient'
import type {
    Feed,
    FeedInput,
    FeedResponse,
    KeywordSuggestions,
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

    // Keyword suggestions for the feed-building screen. Pass the keywords the
    // user already picked (they steer the `related` strategy and are never
    // suggested back); with none, the backend falls back to `popular`. The
    // response is never paginated (a small ranked indicator, limit ≤ 50).
    async keywordSuggestions(
        keywords: string[],
        limit?: number,
    ): Promise<KeywordSuggestions> {
        const params = new URLSearchParams()
        if (keywords.length > 0) {
            params.set('keywords', keywords.join(','))
        }
        if (limit !== undefined) {
            params.set('limit', String(limit))
        }
        const query = params.toString()
        return this.client.get<KeywordSuggestions>(
            `/feeds/keyword-suggestions${query ? `?${query}` : ''}`,
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
