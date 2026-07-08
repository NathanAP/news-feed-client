import { useState } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { placeholderFeeds } from '../../data/placeholderNews'

// Placeholder tabs for the 0.4 shell. In 0.5 these come from GET /feeds and
// selecting one drives the news column.
export function FeedTabs() {
    const { t } = useTranslation()
    const [value, setValue] = useState(0)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tabs
                value={value}
                onChange={(_, next: number) => setValue(next)}
                variant="scrollable"
                scrollButtons={false}
                sx={{ minHeight: 40 }}
            >
                {placeholderFeeds.map((feed) => (
                    <Tab
                        key={feed.id}
                        sx={{ minHeight: 40, textTransform: 'none' }}
                        label={
                            feed.hasUnread ? (
                                <Badge
                                    color="primary"
                                    variant="dot"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -8,
                                            top: 4,
                                        },
                                    }}
                                >
                                    {feed.name}
                                </Badge>
                            ) : (
                                feed.name
                            )
                        }
                    />
                ))}
            </Tabs>
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
