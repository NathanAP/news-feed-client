import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
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
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (input: FeedInput) => feedsService.create(input),
        onSuccess: () => {
            invalidate()
            enqueueSnackbar(t('feed.toast.created'), { variant: 'success' })
        },
    })
}

export function useUpdateFeed() {
    const invalidate = useFeedInvalidation()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: FeedInput }) =>
            feedsService.update(id, input),
        onSuccess: () => {
            invalidate()
            enqueueSnackbar(t('feed.toast.updated'), { variant: 'success' })
        },
    })
}

export function useDeleteFeed() {
    const invalidate = useFeedInvalidation()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (id: string) => feedsService.remove(id),
        onSuccess: () => {
            invalidate()
            enqueueSnackbar(t('feed.toast.deleted'), { variant: 'success' })
        },
    })
}
