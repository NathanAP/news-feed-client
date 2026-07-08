import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NewsCard } from './NewsCard'
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
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, px: 0.5 }}
            >
                {t('feed.summary', { unread: unreadCount, total: totalCount })}
            </Typography>
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
