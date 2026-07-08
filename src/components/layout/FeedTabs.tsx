import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeeds } from '../../hooks/useFeeds'
import { feedPath } from '../../routes/paths'

// Tabs mirror the user's feeds; the active one is driven by the route
// (/feeds/:feedId), not local state. The per-tab unread indicator is
// deferred to 0.6.0.0 (would need a lightweight request per feed).
export function FeedTabs() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { feedId } = useParams<{ feedId: string }>()
    const { data: feeds } = useFeeds()
    const activeFeed = feeds?.find((feed) => feed.id === feedId)
    const activeValue: string | false = activeFeed?.id ?? false

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {feeds !== undefined && feeds.length > 0 && (
                <Tabs
                    value={activeValue}
                    onChange={(_, next: string) => navigate(feedPath(next))}
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{ minHeight: 40 }}
                >
                    {feeds.map((feed) => (
                        <Tab
                            key={feed.id}
                            value={feed.id}
                            label={feed.name}
                            sx={{ minHeight: 40, textTransform: 'none' }}
                        />
                    ))}
                </Tabs>
            )}
            <IconButton
                aria-label={t('feed.create')}
                size="small"
                color="inherit"
            >
                <AddIcon fontSize="small" />
            </IconButton>
        </Box>
    )
}
