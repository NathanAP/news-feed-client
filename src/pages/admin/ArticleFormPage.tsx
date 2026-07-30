import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useArticle } from '../../hooks/useArticle'
import {
    useCreateArticle,
    useUpdateArticle,
} from '../../hooks/useArticleMutations'
import { KeywordsInput } from '../../components/feeds/KeywordsInput'
import { SourcePicker } from '../../components/admin/SourcePicker'
import { PageLoader } from '../../components/PageLoader'
import { PageTitle } from '../../components/PageTitle'
import { Language } from '../../types/language'
import type { Source } from '../../types/source'
import { articleDetailPath, RoutePath } from '../../routes/paths'
import { MIN_KEYWORDS, MAX_KEYWORDS } from '../../components/feeds/keywords'

// `languageOriginal` starts empty so the administrator has to choose one — the
// value drives translation, so defaulting it would quietly pick wrong.
interface ArticleFormValues {
    title: string
    source: Source | null
    languageOriginal: Language | ''
    urlOriginal: string
    keywords: string[]
    content: string
}

const EMPTY_VALUES: ArticleFormValues = {
    title: '',
    source: null,
    languageOriginal: '',
    urlOriginal: '',
    keywords: [],
    content: '',
}

// Create/edit screen for an article (administrator only, guarded by AdminRoute).
// A screen rather than a dialog because the body is raw HTML and needs room —
// the route also asks for the wider container (see the `wide` route handle).
export function ArticleFormPage() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const mode = id === undefined ? 'create' : 'edit'

    const articleQuery = useArticle(id)
    const createArticle = useCreateArticle()
    const updateArticle = useUpdateArticle()

    // Rebuilt on language change so validation messages stay localized.
    const schema = useMemo(
        () =>
            z.object({
                title: z
                    .string()
                    .trim()
                    .min(1, t('articleForm.errors.titleRequired')),
                // Only creation carries a source: the API treats it as
                // immutable, so the edit screen doesn't show the field.
                source: z
                    .custom<Source | null>()
                    .refine(
                        (value) => mode === 'edit' || value !== null,
                        t('articleForm.errors.sourceRequired'),
                    ),
                // The union (not a plain string) keeps the schema's input type
                // equal to the form's, which the resolver's typing requires;
                // the type predicate then narrows the empty default away.
                languageOriginal: z
                    .union([z.literal(''), z.enum(Language)])
                    .refine(
                        (value): value is Language => value !== '',
                        t('articleForm.errors.languageRequired'),
                    ),
                // z.url(), not z.string().url() — the latter is deprecated in
                // Zod 4.
                urlOriginal: z.url(t('articleForm.errors.urlInvalid')),
                keywords: z
                    .array(z.string())
                    .min(
                        MIN_KEYWORDS,
                        t('articleForm.errors.keywordsMin', {
                            min: MIN_KEYWORDS,
                        }),
                    )
                    .max(
                        MAX_KEYWORDS,
                        t('articleForm.errors.keywordsMax', {
                            max: MAX_KEYWORDS,
                        }),
                    ),
                content: z
                    .string()
                    .trim()
                    .min(1, t('articleForm.errors.contentRequired')),
            }),
        // i18n.language is the actual trigger; t is stable per language.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [i18n.language, mode],
    )

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ArticleFormValues>({
        resolver: zodResolver(schema),
        defaultValues: EMPTY_VALUES,
    })

    // Prefill once the article arrives (edit mode only).
    const article = articleQuery.data
    useEffect(() => {
        if (article === undefined) {
            return
        }
        reset({
            title: article.title,
            source: article.source,
            languageOriginal: article.languageOriginal ?? '',
            urlOriginal: article.urlOriginal,
            keywords: article.keywords,
            content: article.content,
        })
    }, [article, reset])

    const mutation = mode === 'edit' ? updateArticle : createArticle
    const isPending = mutation.isPending

    const errorMessage = useMemo(() => {
        if (!mutation.error) {
            return null
        }
        const status = isAxiosError(mutation.error)
            ? mutation.error.response?.status
            : undefined
        return status === 409
            ? t('articleForm.errors.duplicate')
            : t('articleForm.errors.generic')
    }, [mutation.error, t])

    const onSubmit = handleSubmit((values) => {
        // Narrowing, not a cast: the schema already rejects the empty value.
        if (values.languageOriginal === '') {
            return
        }
        const input = {
            title: values.title,
            content: values.content,
            urlOriginal: values.urlOriginal,
            keywords: values.keywords,
            languageOriginal: values.languageOriginal,
        }

        if (mode === 'edit' && id !== undefined) {
            updateArticle.mutate(
                { id, input },
                { onSuccess: () => void navigate(articleDetailPath(id)) },
            )
            return
        }
        if (values.source === null) {
            return
        }
        createArticle.mutate(
            { ...input, sourceId: values.source.id },
            {
                onSuccess: (created) =>
                    void navigate(articleDetailPath(created.id)),
            },
        )
    })

    if (mode === 'edit' && articleQuery.isPending) {
        return <PageLoader />
    }

    if (mode === 'edit' && articleQuery.isError) {
        return (
            <Typography color="text.secondary" sx={{ py: 4 }}>
                {t('article.loadError')}
            </Typography>
        )
    }

    return (
        <>
            <PageTitle
                screen={t(
                    mode === 'edit'
                        ? 'articleForm.editTitle'
                        : 'articleForm.createTitle',
                )}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t(
                    mode === 'edit'
                        ? 'articleForm.editTitle'
                        : 'articleForm.createTitle',
                )}
            </Typography>

            {/* Manual creation skips the judgement pipeline, so the article
            lands in no feed. Saying so up front beats letting an administrator
            wonder why nothing showed up (see PROJECT.md, "Administradores"). */}
            {mode === 'create' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {t('articleForm.noJudgementNotice')}
                </Alert>
            )}

            <form onSubmit={onSubmit} noValidate autoComplete="off">
                <Stack spacing={2.5}>
                    {errorMessage !== null && (
                        <Alert severity="error">{errorMessage}</Alert>
                    )}

                    <TextField
                        {...register('title')}
                        label={t('articleForm.titleLabel')}
                        fullWidth
                        autoFocus
                        error={errors.title !== undefined}
                        helperText={errors.title?.message}
                    />

                    {mode === 'create' && (
                        <Controller
                            control={control}
                            name="source"
                            render={({ field, fieldState }) => (
                                <SourcePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isPending}
                                    error={fieldState.error !== undefined}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    )}

                    <Controller
                        control={control}
                        name="languageOriginal"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                select
                                label={t('articleForm.languageLabel')}
                                fullWidth
                                error={fieldState.error !== undefined}
                                helperText={fieldState.error?.message}
                            >
                                {Object.values(Language).map((value) => (
                                    <MenuItem key={value} value={value}>
                                        {t(`languages.${value}`)}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <TextField
                        {...register('urlOriginal')}
                        label={t('articleForm.urlLabel')}
                        fullWidth
                        error={errors.urlOriginal !== undefined}
                        helperText={errors.urlOriginal?.message}
                    />

                    <Controller
                        control={control}
                        name="keywords"
                        render={({ field, fieldState }) => (
                            <KeywordsInput
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isPending}
                                error={fieldState.error !== undefined}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <TextField
                        {...register('content')}
                        label={t('articleForm.contentLabel')}
                        helperText={
                            errors.content?.message ??
                            t('articleForm.contentHelp')
                        }
                        fullWidth
                        multiline
                        minRows={10}
                        error={errors.content !== undefined}
                        slotProps={{
                            htmlInput: {
                                style: {
                                    fontFamily: 'ui-monospace, monospace',
                                },
                            },
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={() =>
                                void navigate(
                                    mode === 'edit' && id !== undefined
                                        ? articleDetailPath(id)
                                        : RoutePath.Feeds,
                                )
                            }
                            disabled={isPending}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            loading={isPending}
                        >
                            {t(
                                mode === 'edit'
                                    ? 'common.save'
                                    : 'articleForm.createSubmit',
                            )}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </>
    )
}
