import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { useOrderedFeeds } from '../hooks/useOrderedFeeds'
import { LazyFeedFormDialog } from '../components/feeds/LazyFeedFormDialog'
import { PageTitle } from '../components/PageTitle'
import { feedPath } from '../routes/paths'

// Index of `/feeds`: redirects to the user's first feed once feeds load, and
// shows an empty state with a create action when they have none yet.
export function FeedsIndexPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { data: feeds, isPending, isError } = useOrderedFeeds()
    const [createOpen, setCreateOpen] = useState(false)

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

    if (feeds !== undefined && feeds.length > 0) {
        return <Navigate to={feedPath(feeds[0].id)} replace />
    }

    return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
            <PageTitle screen={t('titles.feeds')} />
            <Typography variant="h6">{t('feed.empty.title')}</Typography>
            <Typography variant="body2" color="text.secondary">
                {t('feed.empty.body')}
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 3 }}
                onClick={() => setCreateOpen(true)}
            >
                {t('feed.create')}
            </Button>
            <LazyFeedFormDialog
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onCreated={(feed) => navigate(feedPath(feed.id))}
            />
        </Box>
    )
}
