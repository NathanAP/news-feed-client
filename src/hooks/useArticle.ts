import { useQuery } from '@tanstack/react-query'
import { articlesService } from '../services/api'

export function useArticle(articleId: string | undefined) {
    return useQuery({
        queryKey: ['article', articleId],
        // `enabled` guarantees this only runs when articleId is defined.
        queryFn: () => articlesService.getById(articleId as string),
        enabled: articleId !== undefined,
    })
}
