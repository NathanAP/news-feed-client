import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTranslation } from 'react-i18next'
import type { NewsCardItem } from '../../types/news'
import { formatRelativeMinutes } from '../../utils/relativeTime'

// Clamp to two lines — titles and bodies never exceed two lines.
const clamp2 = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
} as const

export function NewsCard({ item }: { item: NewsCardItem }) {
    const { i18n } = useTranslation()
    const timeAgo = formatRelativeMinutes(item.minutesAgo, i18n.language)

    return (
        <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 3 }}>
            <CardActionArea sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1, minWidth: 0 }}>
                        {!item.isRead && (
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
                            {item.title}
                        </Typography>
                    </Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ flex: 'none' }}
                    >
                        {timeAgo}
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, ...clamp2 }}
                >
                    {item.body}
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
                        {item.createdAtLabel}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: 'auto' }}>
                        {item.sourceName}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    )
}
