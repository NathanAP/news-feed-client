import { useQuery } from '@tanstack/react-query'
import { sourcesService } from '../services/api'

export function useSource(sourceId: string | undefined) {
    return useQuery({
        queryKey: ['source', sourceId],
        // `enabled` guarantees this only runs when sourceId is defined.
        queryFn: () => sourcesService.getById(sourceId as string),
        enabled: sourceId !== undefined,
    })
}
