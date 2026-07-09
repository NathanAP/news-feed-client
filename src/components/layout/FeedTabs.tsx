import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeeds } from '../../hooks/useFeeds'
import { useUnreadCounts } from '../../hooks/useUnreadCounts'
import { feedPath } from '../../routes/paths'

// Counts above this are shown as "9+" so a high number (or browser zoom) never
// overflows the tab.
const MAX_UNREAD_DISPLAY = 9

// Tabs mirror the user's feeds; the active one is driven by the route
// (/feeds/:feedId), not local state. Each tab shows an inline count pill with
// its unread total, polled together via GET /feeds/check-for-new-articles.
export function FeedTabs() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { feedId } = useParams<{ feedId: string }>()
    const { data: feeds } = useFeeds()
    // Only poll once the feeds are known (i.e. the session is ready).
    const { data: unreadCounts } = useUnreadCounts(feeds !== undefined)
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
                    {feeds.map((feed) => {
                        const unread = unreadCounts?.[feed.id] ?? 0
                        return (
                            <Tab
                                key={feed.id}
                                value={feed.id}
                                label={
                                    // Inline flow (name + count pill) so the count
                                    // stays inside the tab box and never gets
                                    // clipped by the scroller — unlike a floating
                                    // Badge, which overflows the tab edge.
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                        }}
                                    >
                                        {feed.name}
                                        {unread > 0 && (
                                            <Box
                                                component="span"
                                                aria-label={t(
                                                    'feed.unreadCount',
                                                    { count: unread },
                                                )}
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: 18,
                                                    height: 18,
                                                    px: 0.5,
                                                    borderRadius: '9px',
                                                    bgcolor: 'primary.main',
                                                    color: 'primary.contrastText',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 600,
                                                    lineHeight: 1,
                                                }}
                                            >
                                                {unread > MAX_UNREAD_DISPLAY
                                                    ? `${MAX_UNREAD_DISPLAY}+`
                                                    : unread}
                                            </Box>
                                        )}
                                    </Box>
                                }
                                sx={{ minHeight: 40, textTransform: 'none' }}
                            />
                        )
                    })}
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
