import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useSources } from '../../hooks/useSources'
import { SourcesList } from '../../components/admin/SourcesList'
import { LazySourceFormDialog } from '../../components/admin/LazySourceFormDialog'
import { PageTitle } from '../../components/PageTitle'

// Administrator-only management of the news sources (guarded by AdminRoute).
export function SourcesPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)
    const sourcesQuery = useSources(page)

    const sources = sourcesQuery.data?.items ?? []

    // Deleting the last row of a page beyond the first would leave the listing
    // empty (the API answers with an empty `docs`, not an error), so step back.
    const handleDeleted = () => {
        if (sources.length === 1 && page > 1) {
            setPage(page - 1)
        }
    }

    return (
        <>
            <PageTitle screen={t('titles.sources')} />
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('admin.sources.title')}
            </Typography>
            <SourcesList
                sources={sources}
                totalCount={sourcesQuery.data?.totalCount ?? 0}
                page={page}
                totalPages={sourcesQuery.data?.totalPages ?? 1}
                isPending={sourcesQuery.isPending}
                isError={sourcesQuery.isError}
                onPageChange={setPage}
                onCreate={() => setCreateOpen(true)}
                onDeleted={handleDeleted}
            />
            {/* One dialog instance for both triggers (header button and empty
            state), owned here so neither has to keep its own state. */}
            <LazySourceFormDialog
                open={createOpen}
                mode="create"
                onClose={() => setCreateOpen(false)}
            />
        </>
    )
}
