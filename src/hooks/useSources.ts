import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { sourcesService } from '../services/api'

// Paginated listing of news sources. keepPreviousData holds the current page on
// screen while the next one loads, so paging doesn't flash an empty list.
export function useSources(page: number) {
    return useQuery({
        queryKey: ['sources', page],
        queryFn: () => sourcesService.list(page),
        placeholderData: keepPreviousData,
    })
}
