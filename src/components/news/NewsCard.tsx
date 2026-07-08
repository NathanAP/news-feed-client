import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DoneIcon from '@mui/icons-material/Done'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import type { Article } from '../../types/article'
import { formatRelativeTime } from '../../utils/relativeTime'
import { stripHtml } from '../../utils/stripHtml'
import { articlesService } from '../../services/api'
import { articleDetailPath } from '../../routes/paths'

// Clamp to two lines — titles and bodies never exceed two lines.
const clamp2 = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
} as const

function getDateFnsLocale(language: string): Locale {
    return language.startsWith('pt') ? pt : enUS
}

export function NewsCard({
    article,
    feedId,
}: {
    article: Article
    feedId: string
}) {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)

    const createdAt = new Date(article.createdAt)
    const timeAgo = formatRelativeTime(createdAt, t)
    const createdAtLabel = format(createdAt, 'dd MMM yyyy, HH:mm', {
        locale: getDateFnsLocale(i18n.language),
    })
    const bodyPreview = stripHtml(article.content)
    const isUnread = article.isRead !== true

    const markAsReadMutation = useMutation({
        mutationFn: () => articlesService.markAsRead(article.id),
        onSuccess: () => {
            // Covers both the article list and the unread-count query for this
            // feed (they share the ['feedArticles', feedId] prefix).
            void queryClient.invalidateQueries({
                queryKey: ['feedArticles', feedId],
            })
        },
    })

    return (
        <Card
            variant="outlined"
            sx={{ mb: 1.5, borderRadius: 3, position: 'relative' }}
        >
            <CardActionArea
                onClick={() => navigate(articleDetailPath(article.id))}
                sx={{ p: 2 }}
            >
                <Box sx={{ display: 'flex', gap: 1, minWidth: 0, pr: 4 }}>
                    {isUnread && (
                        <Box
                            sx={{
                                flex: 'none',
                                mt: '7px',
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                            }}
                        />
                    )}
                    <Typography
                        variant="subtitle1"
                        sx={{ ...clamp2, fontWeight: 500 }}
                    >
                        {article.title}
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, ...clamp2 }}
                >
                    {bodyPreview}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 1.5,
                        color: 'text.secondary',
                    }}
                >
                    <AccessTimeIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption">
                        {createdAtLabel} · {timeAgo}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 'auto' }}>
                        {article.source?.name ?? ''}
                    </Typography>
                </Box>
            </CardActionArea>

            <IconButton
                size="small"
                aria-label={t('feed.moreOptions')}
                onClick={(event) => {
                    event.stopPropagation()
                    setMenuAnchor(event.currentTarget)
                }}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
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
                {isUnread && (
                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null)
                            markAsReadMutation.mutate()
                        }}
                    >
                        <ListItemIcon>
                            <DoneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{t('feed.markAsRead')}</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </Card>
    )
}
