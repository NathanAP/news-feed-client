import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { articlesService } from '../services/api'
import type { ArticleInput, CreateArticleInput } from '../types/article'

// Creating an article deliberately invalidates nothing: it doesn't go through
// the judgement pipeline, so it lands in no feed and nothing already cached can
// contain it (see PROJECT.md, "Administradores").
export function useCreateArticle() {
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (input: CreateArticleInput) =>
            articlesService.create(input),
        onSuccess: () => {
            enqueueSnackbar(t('article.toast.created'), { variant: 'success' })
        },
    })
}

export function useUpdateArticle() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ArticleInput }) =>
            articlesService.update(id, input),
        onSuccess: (_result, { id }) => {
            // The title and body are rendered by every feed listing and by the
            // detail page, so both caches go stale on an edit.
            void queryClient.invalidateQueries({ queryKey: ['feedArticles'] })
            void queryClient.invalidateQueries({ queryKey: ['article', id] })
            enqueueSnackbar(t('article.toast.updated'), { variant: 'success' })
        },
    })
}

export function useDeleteArticle() {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (id: string) => articlesService.remove(id),
        onSuccess: () => {
            // It disappears from every feed that held it — and if it was
            // unread, from the per-tab badges too.
            void queryClient.invalidateQueries({ queryKey: ['feedArticles'] })
            void queryClient.invalidateQueries({ queryKey: ['unreadCounts'] })
            enqueueSnackbar(t('article.toast.deleted'), { variant: 'success' })
        },
    })
}
