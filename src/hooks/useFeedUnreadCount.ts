import { useQuery } from '@tanstack/react-query'
import { articlesService } from '../services/api'

// Lightweight count-only fetch (page_size=1) — just needs pagination.total_count.
export function useFeedUnreadCount(feedId: string | undefined) {
    return useQuery({
        queryKey: ['feedArticles', feedId, 'unreadCount'],
        // `enabled` guarantees this only runs when feedId is defined.
        queryFn: async () => {
            const result = await articlesService.listByFeed(feedId as string, {
                isRead: false,
                pageSize: 1,
            })
            return result.totalCount
        },
        enabled: feedId !== undefined,
    })
}
