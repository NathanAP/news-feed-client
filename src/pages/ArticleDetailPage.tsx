import { useEffect, useRef } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import { useArticle } from '../hooks/useArticle'
import { useSource } from '../hooks/useSource'
import { articlesService } from '../services/api'
import { RoutePath } from '../routes/paths'

function getDateFnsLocale(language: string): Locale {
    return language.startsWith('pt') ? pt : enUS
}

export function ArticleDetailPage() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()
    const query = useArticle(id)
    // GET /articles/:id doesn't populate `source` (unlike the feed listing
    // with with_sources=true), so the name is fetched separately here.
    const sourceQuery = useSource(query.data?.sourceId)
    // This page is protected (auth required), so marking as read is always
    // attempted. The backend already no-ops (204) when the article isn't in
    // any of the user's feeds — no pre-check needed.
    const marked = useRef(false)

    useEffect(() => {
        if (id === undefined || marked.current) {
            return
        }
        marked.current = true
        void articlesService.markAsRead(id).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['feedArticles'] })
        })
    }, [id, queryClient])

    if (id === undefined) {
        return <Navigate to={RoutePath.Home} replace />
    }

    if (query.isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={28} />
            </Box>
        )
    }

    if (query.isError) {
        return (
            <Typography
                color="text.secondary"
                sx={{ py: 4, textAlign: 'center' }}
            >
                {t('article.loadError')}
            </Typography>
        )
    }

    const article = query.data
    const createdAtLabel = format(
        new Date(article.createdAt),
        'dd MMM yyyy, HH:mm',
        { locale: getDateFnsLocale(i18n.language) },
    )
    const sanitizedContent = DOMPurify.sanitize(article.content)

    return (
        <Box>
            <IconButton
                onClick={() => navigate(-1)}
                aria-label={t('article.back')}
                sx={{ mb: 1 }}
            >
                <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {article.title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, mb: 3 }}
            >
                {sourceQuery.data !== undefined &&
                    `${sourceQuery.data.name} · `}
                {createdAtLabel}
            </Typography>

            <Box
                sx={{
                    lineHeight: 1.7,
                    '& img': { maxWidth: '100%' },
                }}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </Box>
    )
}
