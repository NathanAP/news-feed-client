import type { ApiClient } from './ApiClient'
import { toSource } from './SourcesService'
import type { Article, ArticleResponse } from '../../types/article'
import type { PaginatedResponse } from '../../types/pagination'

export interface ListByFeedResult {
    items: Article[]
    totalCount: number
}

export interface ListByFeedParams {
    isRead?: boolean
    pageSize?: number
}

export class ArticlesService {
    private readonly client: ApiClient

    constructor(client: ApiClient) {
        this.client = client
    }

    async listByFeed(
        feedId: string,
        params: ListByFeedParams = {},
    ): Promise<ListByFeedResult> {
        const query = new URLSearchParams({ with_sources: 'true' })
        if (params.isRead !== undefined) {
            query.set('is_read', String(params.isRead))
        }
        if (params.pageSize !== undefined) {
            query.set('page_size', String(params.pageSize))
        }

        const data = await this.client.get<PaginatedResponse<ArticleResponse>>(
            `/feeds/${encodeURIComponent(feedId)}/articles?${query.toString()}`,
        )
        return {
            items: data.docs.map((item) => this.toArticle(item)),
            totalCount: data.pagination.total_count,
        }
    }

    async getById(articleId: string): Promise<Article> {
        const data = await this.client.get<ArticleResponse>(
            `/articles/${encodeURIComponent(articleId)}`,
        )
        return this.toArticle(data)
    }

    // Marks the article as read across every feed of the current user that
    // contains it. Idempotent and safe to call even if it's in none (204).
    async markAsRead(articleId: string): Promise<void> {
        await this.client.put<void>(
            `/articles/${encodeURIComponent(articleId)}/read`,
        )
    }

    private toArticle(data: ArticleResponse): Article {
        return {
            id: data.id,
            title: data.title,
            content: data.content,
            createdAt: data.created_at,
            sourceId: data.source_id,
            source: data.source !== undefined ? toSource(data.source) : null,
            isRead: data.is_read ?? null,
        }
    }
}
