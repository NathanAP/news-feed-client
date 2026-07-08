import { Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useFeeds } from '../hooks/useFeeds'
import { feedPath } from '../routes/paths'

// Redirects to the user's first feed once feeds load; shows an empty state
// when they have none yet (creating a feed is a future version).
export function HomePage() {
    const { t } = useTranslation()
    const { data: feeds, isPending, isError } = useFeeds()

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

    if (feeds.length > 0) {
        return <Navigate to={feedPath(feeds[0].id)} replace />
    }

    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6">{t('feed.empty.title')}</Typography>
            <Typography variant="body2" color="text.secondary">
                {t('feed.empty.body')}
            </Typography>
        </Box>
    )
}
