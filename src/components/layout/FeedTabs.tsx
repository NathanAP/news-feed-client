import { useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFeeds } from '../../hooks/useFeeds'
import { useUnreadCounts } from '../../hooks/useUnreadCounts'
import { useDeleteFeed } from '../../hooks/useFeedMutations'
import { FeedFormDialog } from '../feeds/FeedFormDialog'
import { ConfirmDialog } from '../ConfirmDialog'
import { feedPath, RoutePath } from '../../routes/paths'
import type { Feed } from '../../types/feed'

// Counts above this are shown as "9+" so a high number (or browser zoom) never
// overflows the tab.
const MAX_UNREAD_DISPLAY = 9

// Backend caps a user at this many active feeds (POST /feeds/create → 409).
const MAX_ACTIVE_FEEDS = 5

type DialogState = { type: 'create' } | { type: 'edit'; feed: Feed } | null

// Tabs mirror the user's feeds; the active one is driven by the route
// (/feeds/:feedId), not local state. Each tab shows an inline unread count and a
// "⋮" menu to edit/delete that feed; the "+" creates a new one.
export function FeedTabs() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { feedId } = useParams<{ feedId: string }>()
    const { data: feeds } = useFeeds()
    // Only poll once the feeds are known (i.e. the session is ready).
    const { data: unreadCounts } = useUnreadCounts(feeds !== undefined)
    const deleteFeed = useDeleteFeed()

    const [menu, setMenu] = useState<{
        anchor: HTMLElement
        feed: Feed
    } | null>(null)
    const [dialog, setDialog] = useState<DialogState>(null)
    const [deleteTarget, setDeleteTarget] = useState<Feed | null>(null)

    const activeFeed = feeds?.find((feed) => feed.id === feedId)
    const activeValue: string | false = activeFeed?.id ?? false
    const atFeedLimit = (feeds?.length ?? 0) >= MAX_ACTIVE_FEEDS

    const openMenu = (anchor: HTMLElement, feed: Feed) =>
        setMenu({ anchor, feed })
    const closeMenu = () => setMenu(null)

    const confirmDelete = () => {
        if (deleteTarget === null) {
            return
        }
        const target = deleteTarget
        deleteFeed.mutate(target.id, {
            onSuccess: () => {
                setDeleteTarget(null)
                // If the deleted feed was the active one, move to another feed
                // (or the empty state) since its route no longer resolves.
                if (feedId === target.id) {
                    const remaining = (feeds ?? []).filter(
                        (feed) => feed.id !== target.id,
                    )
                    navigate(
                        remaining.length > 0
                            ? feedPath(remaining[0].id)
                            : RoutePath.Home,
                    )
                }
            },
        })
    }

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
                                        {/* A real <button> can't nest inside the
                                        Tab's button, so the manage trigger is a
                                        keyboard-accessible span that stops the
                                        click from switching tabs. */}
                                        <Box
                                            component="span"
                                            role="button"
                                            tabIndex={0}
                                            aria-label={t('feed.manage', {
                                                name: feed.name,
                                            })}
                                            onMouseDown={(event) =>
                                                event.stopPropagation()
                                            }
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                openMenu(
                                                    event.currentTarget,
                                                    feed,
                                                )
                                            }}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === 'Enter' ||
                                                    event.key === ' '
                                                ) {
                                                    event.preventDefault()
                                                    event.stopPropagation()
                                                    openMenu(
                                                        event.currentTarget,
                                                        feed,
                                                    )
                                                }
                                            }}
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                borderRadius: '50%',
                                                cursor: 'pointer',
                                                color: 'text.secondary',
                                                '&:hover': {
                                                    color: 'text.primary',
                                                },
                                            }}
                                        >
                                            <MoreVertIcon
                                                sx={{ fontSize: 16 }}
                                            />
                                        </Box>
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
                        onClick={() => setDialog({ type: 'create' })}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>

            <Menu
                anchorEl={menu?.anchor ?? null}
                open={menu !== null}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem
                    onClick={() => {
                        if (menu !== null) {
                            setDialog({ type: 'edit', feed: menu.feed })
                        }
                        closeMenu()
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('feed.edit')}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (menu !== null) {
                            setDeleteTarget(menu.feed)
                        }
                        closeMenu()
                    }}
                >
                    <ListItemIcon>
                        <DeleteOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>
                        {t('feed.delete')}
                    </ListItemText>
                </MenuItem>
            </Menu>

            <FeedFormDialog
                open={dialog !== null}
                mode={dialog?.type === 'edit' ? 'edit' : 'create'}
                feed={dialog?.type === 'edit' ? dialog.feed : undefined}
                onClose={() => setDialog(null)}
                onCreated={(feed) => navigate(feedPath(feed.id))}
            />

            <ConfirmDialog
                open={deleteTarget !== null}
                title={t('feed.deleteConfirm.title')}
                description={t('feed.deleteConfirm.body', {
                    name: deleteTarget?.name ?? '',
                })}
                confirmLabel={t('feed.delete')}
                destructive
                loading={deleteFeed.isPending}
                onConfirm={confirmDelete}
                onClose={() => setDeleteTarget(null)}
            />
        </Box>
    )
}
