import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NewsCard } from './NewsCard'
import { FeedActionsMenu } from '../feeds/FeedActionsMenu'
import type { Article } from '../../types/article'

export interface NewsListProps {
    feedId: string
    articles: Article[]
    totalCount: number
    unreadCount: number
    isPending: boolean
    isError: boolean
}

export function NewsList({
    feedId,
    articles,
    totalCount,
    unreadCount,
    isPending,
    isError,
}: NewsListProps) {
    const { t } = useTranslation()

    if (isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={28} />
            </Box>
        )
    }

    if (isError) {
        return (
            <Typography
                color="text.secondary"
                sx={{ py: 4, textAlign: 'center' }}
            >
                {t('feed.loadError')}
            </Typography>
        )
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1.5,
                    pl: 0.5,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {t('feed.summary', {
                        unread: unreadCount,
                        total: totalCount,
                    })}
                </Typography>
                <FeedActionsMenu feedId={feedId} />
            </Box>
            {articles.length === 0 ? (
                <Typography
                    color="text.secondary"
                    sx={{ py: 4, textAlign: 'center' }}
                >
                    {t('feed.noArticles')}
                </Typography>
            ) : (
                articles.map((article) => (
                    <NewsCard
                        key={article.id}
                        article={article}
                        feedId={feedId}
                    />
                ))
            )}
        </Box>
    )
}
