import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAdminView } from '../../hooks/useAdminView'
import { useFeeds } from '../../hooks/useFeeds'
import { useDeleteFeed } from '../../hooks/useFeedMutations'
import { LazyFeedFormDialog } from './LazyFeedFormDialog'
import { LazyReorderFeedsDialog } from './LazyReorderFeedsDialog'
import { ConfirmDialog } from '../ConfirmDialog'
import { feedPath, RoutePath } from '../../routes/paths'

// Edit/delete menu for the currently open feed, shown in the feed list header.
// Living here (rather than inside a tab) keeps the trigger a plain button and
// means managing a feed requires opening it first.
export function FeedActionsMenu({ feedId }: { feedId: string }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { data: feeds } = useFeeds()
    const deleteFeed = useDeleteFeed()
    const { isAdminView } = useAdminView()

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [reorderOpen, setReorderOpen] = useState(false)

    // Reordering needs at least two feeds to be meaningful.
    const canReorder = (feeds?.length ?? 0) >= 2

    const feed = feeds?.find((item) => item.id === feedId)
    if (feed === undefined) {
        return null
    }

    const handleDelete = () => {
        deleteFeed.mutate(feed.id, {
            onSuccess: () => {
                setConfirmOpen(false)
                // The deleted feed is the active one, so move to another feed
                // (or the empty state) since its route no longer resolves.
                const remaining = (feeds ?? []).filter(
                    (item) => item.id !== feed.id,
                )
                navigate(
                    remaining.length > 0
                        ? feedPath(remaining[0].id)
                        : RoutePath.Feeds,
                )
            },
        })
    }

    return (
        <>
            <IconButton
                aria-label={t('feed.manage', { name: feed.name })}
                size="small"
                onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={menuAnchor}
                open={menuAnchor !== null}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => {
                        setEditOpen(true)
                        setMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('feed.edit')}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setConfirmOpen(true)
                        setMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <DeleteOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>
                        {t('feed.delete')}
                    </ListItemText>
                </MenuItem>
                <Divider />
                {/* Global action (reorders all feeds), separated from the
                per-feed actions above. */}
                <MenuItem
                    disabled={!canReorder}
                    onClick={() => {
                        setReorderOpen(true)
                        setMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <SwapVertIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('feed.reorder')}</ListItemText>
                </MenuItem>
                {/* Array, not a fragment, so MUI can still walk the items for
                keyboard navigation. */}
                {isAdminView && [
                    <Divider key="admin-divider" />,
                    <MenuItem
                        key="admin-new-article"
                        onClick={() => {
                            setMenuAnchor(null)
                            void navigate(RoutePath.ArticleNew)
                        }}
                    >
                        <ListItemIcon>
                            <PostAddOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{t('article.create')}</ListItemText>
                    </MenuItem>,
                ]}
            </Menu>

            <LazyFeedFormDialog
                open={editOpen}
                mode="edit"
                feed={feed}
                onClose={() => setEditOpen(false)}
            />

            <ConfirmDialog
                open={confirmOpen}
                title={t('feed.deleteConfirm.title')}
                description={t('feed.deleteConfirm.body', { name: feed.name })}
                confirmLabel={t('feed.delete')}
                destructive
                loading={deleteFeed.isPending}
                onConfirm={handleDelete}
                onClose={() => setConfirmOpen(false)}
            />

            <LazyReorderFeedsDialog
                open={reorderOpen}
                onClose={() => setReorderOpen(false)}
            />
        </>
    )
}
