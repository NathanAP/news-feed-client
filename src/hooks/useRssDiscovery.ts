import { useMutation } from '@tanstack/react-query'
import { sourcesService } from '../services/api'

// Looks up the RSS feeds of a site on demand. Modelled as a mutation rather
// than a query because it is an imperative action fired by a button, not state
// the screen keeps in sync — and TanStack's idiomatic escape hatch for that is
// mutate(), not a disabled query with a manual refetch.
export function useRssDiscovery() {
    return useMutation({
        mutationFn: (url: string) => sourcesService.discoverRss(url),
    })
}
