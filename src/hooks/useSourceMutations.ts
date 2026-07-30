import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { sourcesService } from '../services/api'
import type { SourceInput } from '../types/source'

// Every source write invalidates the source listing. Editing also touches the
// articles: the source name is rendered in each news card footer, so a rename
// would otherwise keep showing the old one. The ['feedArticles'] prefix also
// covers the per-feed unread count, which hangs off the same key.
function useSourceInvalidation() {
    const queryClient = useQueryClient()
    return () => {
        void queryClient.invalidateQueries({ queryKey: ['sources'] })
        void queryClient.invalidateQueries({ queryKey: ['feedArticles'] })
    }
}

export function useCreateSource() {
    const invalidate = useSourceInvalidation()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (input: SourceInput) => sourcesService.create(input),
        onSuccess: () => {
            invalidate()
            enqueueSnackbar(t('admin.sources.toast.created'), {
                variant: 'success',
            })
        },
    })
}

export function useUpdateSource() {
    const invalidate = useSourceInvalidation()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: SourceInput }) =>
            sourcesService.update(id, input),
        onSuccess: () => {
            invalidate()
            enqueueSnackbar(t('admin.sources.toast.updated'), {
                variant: 'success',
            })
        },
    })
}

export function useDeleteSource() {
    const invalidate = useSourceInvalidation()
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (id: string) => sourcesService.remove(id),
        onSuccess: () => {
            invalidate()
            // Deleting a source soft-removes its articles too, so the tab
            // badges are stale on top of the listings invalidated above.
            void queryClient.invalidateQueries({ queryKey: ['unreadCounts'] })
            enqueueSnackbar(t('admin.sources.toast.deleted'), {
                variant: 'success',
            })
        },
    })
}
