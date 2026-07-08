import { Navigate, useParams } from 'react-router-dom'
import { useFeedArticles } from '../hooks/useFeedArticles'
import { useFeedUnreadCount } from '../hooks/useFeedUnreadCount'
import { NewsList } from '../components/news/NewsList'
import { RoutePath } from '../routes/paths'

export function FeedPage() {
    const { feedId } = useParams<{ feedId: string }>()
    const articlesQuery = useFeedArticles(feedId)
    const unreadQuery = useFeedUnreadCount(feedId)

    if (feedId === undefined) {
        return <Navigate to={RoutePath.Home} replace />
    }

    return (
        <NewsList
            feedId={feedId}
            articles={articlesQuery.data?.items ?? []}
            totalCount={articlesQuery.data?.totalCount ?? 0}
            unreadCount={unreadQuery.data ?? 0}
            isPending={articlesQuery.isPending}
            isError={articlesQuery.isError}
        />
    )
}
