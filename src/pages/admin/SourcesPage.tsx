import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useSources } from '../../hooks/useSources'
import { SourcesList } from '../../components/admin/SourcesList'
import { PageTitle } from '../../components/PageTitle'

// Administrator-only listing of the news sources (guarded by AdminRoute).
// Read-only for now: creating, editing and deleting sources arrive in 0.19.
export function SourcesPage() {
    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const sourcesQuery = useSources(page)

    return (
        <>
            <PageTitle screen={t('titles.sources')} />
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('admin.sources.title')}
            </Typography>
            <SourcesList
                sources={sourcesQuery.data?.items ?? []}
                totalCount={sourcesQuery.data?.totalCount ?? 0}
                page={page}
                totalPages={sourcesQuery.data?.totalPages ?? 1}
                isPending={sourcesQuery.isPending}
                isError={sourcesQuery.isError}
                onPageChange={setPage}
            />
        </>
    )
}
