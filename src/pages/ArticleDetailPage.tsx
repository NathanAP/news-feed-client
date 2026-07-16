import { useEffect, useRef } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
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
import { PageTitle } from '../components/PageTitle'
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
    // Tracks the id already marked (not a plain boolean) so navigating straight
    // from one article to another — which reuses this component instance — still
    // marks the new one, while StrictMode's double effect stays deduped.
    const marked = useRef<string | null>(null)

    useEffect(() => {
        if (id === undefined || marked.current === id) {
            return
        }
        marked.current = id
        void articlesService.markAsRead(id).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['feedArticles'] })
            void queryClient.invalidateQueries({ queryKey: ['unreadCounts'] })
        })
    }, [id, queryClient])

    if (id === undefined) {
        return <Navigate to={RoutePath.Feeds} replace />
    }

    // Until the article resolves there's no headline to name the tab after, so
    // these two branches fall back to the section name.
    if (query.isPending) {
        return (
            <>
                <PageTitle screen={t('titles.article')} />
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            </>
        )
    }

    if (query.isError) {
        return (
            <>
                <PageTitle screen={t('titles.article')} />
                <Typography
                    color="text.secondary"
                    sx={{ py: 4, textAlign: 'center' }}
                >
                    {t('article.loadError')}
                </Typography>
            </>
        )
    }

    const article = query.data
    const createdAtLabel = format(
        new Date(article.createdAt),
        'dd MMM yyyy, HH:mm',
        { locale: getDateFnsLocale(i18n.language) },
    )

    return (
        <Box>
            {/* The headline names the tab — far more useful than "Article"
            when several are open. */}
            <PageTitle screen={article.title} />
            <IconButton
                onClick={() => navigate(-1)}
                aria-label={t('article.back')}
                sx={{ mb: 1 }}
            >
                <ArrowBackIcon />
            </IconButton>

            <Typography
                variant="h5"
                sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
            >
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

            {/* The content is HTML already sanitized by the backend (bluemonday,
            strict allowlist incl. YouTube/Twitch iframes; no class/style/id), so
            we render it directly. Style by tag/context selectors only. */}
            <Box
                sx={{
                    lineHeight: 1.7,
                    // Long unbroken tokens (URLs) in the article HTML must wrap
                    // instead of pushing the page into horizontal scroll.
                    overflowWrap: 'anywhere',
                    '& img': { maxWidth: '100%', height: 'auto' },
                    // Video embeds (YouTube/Twitch) come as fixed-size iframes;
                    // make them fill the column at a 16:9 ratio.
                    '& iframe': {
                        width: '100%',
                        maxWidth: '100%',
                        aspectRatio: '16 / 9',
                        height: 'auto',
                        border: 0,
                    },
                    '& pre, & code': {
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                    },
                    '& pre': { overflowX: 'auto' },
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </Box>
    )
}
