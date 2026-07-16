import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeedArticles } from '../hooks/useFeedArticles'
import { useFeedUnreadCount } from '../hooks/useFeedUnreadCount'
import { NewsList } from '../components/news/NewsList'
import { PageTitle } from '../components/PageTitle'
import { RoutePath } from '../routes/paths'

export function FeedPage() {
    const { t } = useTranslation()
    const { feedId } = useParams<{ feedId: string }>()
    const articlesQuery = useFeedArticles(feedId)
    const unreadQuery = useFeedUnreadCount(feedId)

    if (feedId === undefined) {
        return <Navigate to={RoutePath.Feeds} replace />
    }

    return (
        <>
            <PageTitle screen={t('titles.feeds')} />
            <NewsList
                feedId={feedId}
                articles={articlesQuery.data?.items ?? []}
                totalCount={articlesQuery.data?.totalCount ?? 0}
                unreadCount={unreadQuery.data ?? 0}
                isPending={articlesQuery.isPending}
                isError={articlesQuery.isError}
            />
        </>
    )
}
