import type { ApiClient } from './ApiClient'
import { toSource } from './SourcesService'
import type {
    Article,
    ArticleInput,
    ArticleResponse,
    CreateArticleInput,
} from '../../types/article'
import type { PaginatedResponse } from '../../types/pagination'

export interface ListByFeedResult {
    items: Article[]
    totalCount: number
}

export interface ListByFeedParams {
    isRead?: boolean
    pageSize?: number
}

// Shared by create and update — the two payloads differ only by `source_id`.
function toRequestBody(input: ArticleInput) {
    return {
        title: input.title,
        content: input.content,
        url_original: input.urlOriginal,
        keywords: input.keywords,
        language_original: input.languageOriginal,
    }
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

    // Admin-only. Note this does NOT run the judgement pipeline: a hand-made
    // article lands in no feed (see PROJECT.md — the route exists for API
    // symmetry and future sponsored articles). 409 on a duplicate url_original.
    async create(input: CreateArticleInput): Promise<Article> {
        const data = await this.client.post<ArticleResponse>(
            '/articles/create',
            { ...toRequestBody(input), source_id: input.sourceId },
        )
        return this.toArticle(data)
    }

    // Admin-only. `source_id` is immutable, so it isn't part of the payload.
    async update(articleId: string, input: ArticleInput): Promise<Article> {
        const data = await this.client.put<ArticleResponse>(
            `/articles/${encodeURIComponent(articleId)}`,
            toRequestBody(input),
        )
        return this.toArticle(data)
    }

    // Admin-only. Soft delete.
    async remove(articleId: string): Promise<void> {
        await this.client.delete<void>(
            `/articles/${encodeURIComponent(articleId)}`,
        )
    }

    private toArticle(data: ArticleResponse): Article {
        return {
            id: data.id,
            title: data.title,
            content: data.content,
            urlOriginal: data.url_original,
            keywords: data.keywords,
            languageOriginal: data.language_original ?? null,
            createdAt: data.created_at,
            sourceId: data.source_id,
            source: data.source !== undefined ? toSource(data.source) : null,
            isRead: data.is_read ?? null,
        }
    }
}
