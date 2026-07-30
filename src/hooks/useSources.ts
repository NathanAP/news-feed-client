import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { sourcesService } from '../services/api'

// Paginated listing of news sources. keepPreviousData holds the current page on
// screen while the next one loads, so paging doesn't flash an empty list.
export function useSources(page: number) {
    return useQuery({
        queryKey: ['sources', { page }],
        queryFn: () => sourcesService.list({ page }),
        placeholderData: keepPreviousData,
    })
}

// Name search behind the source picker of the article form. Debounce the term
// at the call site (see useDebouncedValue) so typing doesn't fire a request per
// keystroke; the empty term is a valid search and returns the first page.
export function useSourceSearch(name: string, enabled = true) {
    return useQuery({
        queryKey: ['sources', { name }],
        queryFn: () => sourcesService.list({ name }),
        enabled,
        placeholderData: keepPreviousData,
    })
}
