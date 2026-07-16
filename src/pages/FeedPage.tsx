import { Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeeds } from '../hooks/useFeeds'
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
    // Names the browser tab after the open feed. Reads from the same ['feeds']
    // query the tabs already load, so this is a cache hit, not a new request.
    const { data: feeds } = useFeeds()
    const feedName = feeds?.find((feed) => feed.id === feedId)?.name

    if (feedId === undefined) {
        return <Navigate to={RoutePath.Feeds} replace />
    }

    return (
        <>
            {/* Falls back to the section name until the feed list resolves. */}
            <PageTitle screen={feedName ?? t('titles.feeds')} />
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
