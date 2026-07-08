import { useQuery } from '@tanstack/react-query'
import { articlesService } from '../services/api'

export function useFeedArticles(feedId: string | undefined) {
    return useQuery({
        queryKey: ['feedArticles', feedId],
        // `enabled` guarantees this only runs when feedId is defined.
        queryFn: () => articlesService.listByFeed(feedId as string),
        enabled: feedId !== undefined,
    })
}
