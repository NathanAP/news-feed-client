import { useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useOrderedFeeds } from '../../hooks/useOrderedFeeds'
import { useUnreadCounts } from '../../hooks/useUnreadCounts'
import { LazyFeedFormDialog } from '../feeds/LazyFeedFormDialog'
import { feedPath } from '../../routes/paths'

// Counts above this are shown as "9+" so a high number (or browser zoom) never
// overflows the tab.
const MAX_UNREAD_DISPLAY = 9

// Backend caps a user at this many active feeds (POST /feeds/create → 409).
const MAX_ACTIVE_FEEDS = 5

// Tabs mirror the user's feeds; the active one is driven by the route
// (/feeds/:feedId), not local state. Each tab shows an inline unread count; the
// "+" creates a feed. Editing/deleting a feed lives in the feed list header
// (FeedActionsMenu), so it acts on the feed you've opened.
export function FeedTabs() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { feedId } = useParams<{ feedId: string }>()
    const { data: feeds } = useOrderedFeeds()
    // Only poll once the feeds are known (i.e. the session is ready).
    const { data: unreadCounts } = useUnreadCounts(feeds !== undefined)
    const [createOpen, setCreateOpen] = useState(false)

    const activeFeed = feeds?.find((feed) => feed.id === feedId)
    const activeValue: string | false = activeFeed?.id ?? false
    const atFeedLimit = (feeds?.length ?? 0) >= MAX_ACTIVE_FEEDS

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
                                    <Box
                                        component="span"
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            maxWidth: 200,
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {feed.name}
                                        </Box>
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
            <Tooltip
                title={
                    atFeedLimit
                        ? t('feed.limitReached', { max: MAX_ACTIVE_FEEDS })
                        : t('feed.create')
                }
            >
                {/* span keeps the tooltip working while the button is disabled */}
                <span>
                    <IconButton
                        aria-label={t('feed.create')}
                        size="small"
                        color="inherit"
                        disabled={atFeedLimit}
                        onClick={() => setCreateOpen(true)}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>

            <LazyFeedFormDialog
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
                onCreated={(feed) => navigate(feedPath(feed.id))}
            />
        </Box>
    )
}
