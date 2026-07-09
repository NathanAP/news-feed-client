import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feedsService } from '../services/api'
import type { FeedInput } from '../types/feed'

// After any feed create/update/delete, both the feed list and the per-feed
// unread badges may change, so invalidate both.
function useFeedInvalidation() {
    const queryClient = useQueryClient()
    return () => {
        void queryClient.invalidateQueries({ queryKey: ['feeds'] })
        void queryClient.invalidateQueries({ queryKey: ['unreadCounts'] })
    }
}

export function useCreateFeed() {
    const invalidate = useFeedInvalidation()
    return useMutation({
        mutationFn: (input: FeedInput) => feedsService.create(input),
        onSuccess: invalidate,
    })
}

export function useUpdateFeed() {
    const invalidate = useFeedInvalidation()
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: FeedInput }) =>
            feedsService.update(id, input),
        onSuccess: invalidate,
    })
}

export function useDeleteFeed() {
    const invalidate = useFeedInvalidation()
    return useMutation({
        mutationFn: (id: string) => feedsService.remove(id),
        onSuccess: invalidate,
    })
}
