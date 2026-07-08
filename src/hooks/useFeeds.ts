import { useQuery } from '@tanstack/react-query'
import { feedsService } from '../services/api'

export function useFeeds() {
    return useQuery({
        queryKey: ['feeds'],
        queryFn: () => feedsService.list(),
    })
}
