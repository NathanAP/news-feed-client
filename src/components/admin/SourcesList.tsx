import { Fragment } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { SourceActionsMenu } from './SourceActionsMenu'
import type { Source } from '../../types/source'

export interface SourcesListProps {
    sources: Source[]
    totalCount: number
    page: number
    totalPages: number
    isPending: boolean
    isError: boolean
    onPageChange: (page: number) => void
    onCreate: () => void
    onDeleted: () => void
}

// Listing of the news sources. Names and URLs come from the API and can be
// long, so every line clamps to one row with an ellipsis. Creating is a header
// action (it belongs to no row); editing and deleting hang off each row's menu.
export function SourcesList({
    sources,
    totalCount,
    page,
    totalPages,
    isPending,
    isError,
    onPageChange,
    onCreate,
    onDeleted,
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
            <Stack spacing={2} sx={{ py: 4, alignItems: 'center' }}>
                <Typography color="text.secondary">
                    {t('admin.sources.empty')}
                </Typography>
                <Button
                    onClick={onCreate}
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    {t('admin.sources.create')}
                </Button>
            </Stack>
        )
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1.5,
                    pl: 0.5,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {t('admin.sources.summary', { count: totalCount })}
                </Typography>
                <Button
                    onClick={onCreate}
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{ flexShrink: 0 }}
                >
                    {t('admin.sources.create')}
                </Button>
            </Box>

            <Paper variant="outlined">
                <List disablePadding>
                    {sources.map((source, index) => (
                        <Fragment key={source.id}>
                            {index > 0 && <Divider component="li" />}
                            <ListItem
                                sx={{ py: 1.5, gap: 1 }}
                                secondaryAction={
                                    <SourceActionsMenu
                                        source={source}
                                        onDeleted={onDeleted}
                                    />
                                }
                            >
                                {/* minWidth: 0 lets the ellipsis kick in
                                instead of the text pushing the row wider. */}
                                <Box sx={{ minWidth: 0, flex: 1 }}>
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
                                </Box>
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
