import { Fragment } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import type { Source } from '../../types/source'

export interface SourcesListProps {
    sources: Source[]
    totalCount: number
    page: number
    totalPages: number
    isPending: boolean
    isError: boolean
    onPageChange: (page: number) => void
}

// Read-only listing of the news sources. Names and URLs come from the API and
// can be long, so every line clamps to one row with an ellipsis.
export function SourcesList({
    sources,
    totalCount,
    page,
    totalPages,
    isPending,
    isError,
    onPageChange,
}: SourcesListProps) {
    const { t } = useTranslation()

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
                {t('admin.sources.loadError')}
            </Typography>
        )
    }

    if (sources.length === 0) {
        return (
            <Typography
                color="text.secondary"
                sx={{ py: 4, textAlign: 'center' }}
            >
                {t('admin.sources.empty')}
            </Typography>
        )
    }

    return (
        <Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, pl: 0.5 }}
            >
                {t('admin.sources.summary', { count: totalCount })}
            </Typography>

            <Paper variant="outlined">
                <List disablePadding>
                    {sources.map((source, index) => (
                        <Fragment key={source.id}>
                            {index > 0 && <Divider component="li" />}
                            <ListItem
                                sx={{
                                    display: 'block',
                                    py: 1.5,
                                    minWidth: 0,
                                }}
                            >
                                <Typography variant="subtitle2" noWrap>
                                    {source.name}
                                </Typography>
                                <Link
                                    href={source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="body2"
                                    sx={{
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {source.url}
                                </Link>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                    sx={{ display: 'block' }}
                                >
                                    {t('admin.sources.rss', {
                                        url: source.urlRss,
                                    })}
                                </Typography>
                            </ListItem>
                        </Fragment>
                    ))}
                </List>
            </Paper>

            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => onPageChange(value)}
                        size="small"
                    />
                </Box>
            )}
        </Box>
    )
}
