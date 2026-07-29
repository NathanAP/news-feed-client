import { useEffect, useMemo } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'
import { useCreateFeed, useUpdateFeed } from '../../hooks/useFeedMutations'
import type { Feed, FeedInput } from '../../types/feed'
import { KeywordsInput } from './KeywordsInput'
import { KeywordsGuide } from './KeywordsGuide'
import { KeywordSuggestions } from './KeywordSuggestions'
import { MIN_KEYWORDS, MAX_KEYWORDS, normalizeKeywords } from './keywords'

const MAX_NAME_LENGTH = 120

type FeedFormMode = 'create' | 'edit'

export interface FeedFormDialogProps {
    open: boolean
    mode: FeedFormMode
    // The feed being edited (required in edit mode; ignored in create mode).
    feed?: Feed
    onClose: () => void
    onCreated?: (feed: Feed) => void
}

// Create/edit dialog for a feed. Validates name (≤120) and keywords (5..20) with
// Zod via react-hook-form, and drives the create/update mutations.
export function FeedFormDialog({
    open,
    mode,
    feed,
    onClose,
    onCreated,
}: FeedFormDialogProps) {
    const { t, i18n } = useTranslation()
    const createFeed = useCreateFeed()
    const updateFeed = useUpdateFeed()

    // Schema is rebuilt when the language changes so validation messages stay
    // localized.
    const schema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, t('feedForm.errors.nameRequired'))
                    .max(MAX_NAME_LENGTH, t('feedForm.errors.nameTooLong')),
                keywords: z
                    .array(z.string())
                    .min(
                        MIN_KEYWORDS,
                        t('feedForm.errors.keywordsMin', { min: MIN_KEYWORDS }),
                    )
                    .max(
                        MAX_KEYWORDS,
                        t('feedForm.errors.keywordsMax', { max: MAX_KEYWORDS }),
                    ),
            }),
        // i18n.language is the actual trigger; t is stable per language.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [i18n.language],
    )

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FeedInput>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', keywords: [] },
    })

    // Current keywords, watched so the suggestions can react to every pick.
    const keywords = useWatch({ control, name: 'keywords' })

    // Add a suggested keyword to the list (normalized/deduped), validating so
    // the min-keywords error clears as soon as the count is satisfied.
    const handleAddSuggestion = (keyword: string) => {
        setValue(
            'keywords',
            normalizeKeywords([...(keywords ?? []), keyword]),
            {
                shouldValidate: true,
                shouldDirty: true,
            },
        )
    }

    // Reset the form whenever the dialog opens (prefilling in edit mode).
    useEffect(() => {
        if (open) {
            reset({
                name: feed?.name ?? '',
                keywords: feed?.keywords ?? [],
            })
        }
    }, [open, feed, reset])

    const mutation = mode === 'edit' ? updateFeed : createFeed
    const isPending = mutation.isPending

    const errorMessage = useMemo(() => {
        if (!mutation.error) {
            return null
        }
        const status = isAxiosError(mutation.error)
            ? mutation.error.response?.status
            : undefined
        return status === 409
            ? t('feedForm.errors.limit')
            : t('feedForm.errors.generic')
    }, [mutation.error, t])

    const onSubmit = handleSubmit((values) => {
        if (mode === 'edit' && feed) {
            updateFeed.mutate(
                { id: feed.id, input: values },
                { onSuccess: () => onClose() },
            )
        } else {
            createFeed.mutate(values, {
                onSuccess: (created) => {
                    onCreated?.(created)
                    onClose()
                },
            })
        }
    })

    return (
        <Dialog
            open={open}
            onClose={isPending ? undefined : onClose}
            fullWidth
            maxWidth="xs"
        >
            <form onSubmit={onSubmit} noValidate>
                <DialogTitle>
                    {mode === 'edit'
                        ? t('feedForm.editTitle')
                        : t('feedForm.createTitle')}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        {errorMessage !== null && (
                            <Alert severity="error">{errorMessage}</Alert>
                        )}
                        <TextField
                            {...register('name')}
                            label={t('feedForm.nameLabel')}
                            fullWidth
                            autoFocus
                            slotProps={{
                                htmlInput: { maxLength: MAX_NAME_LENGTH },
                            }}
                            error={errors.name !== undefined}
                            helperText={errors.name?.message}
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
                        <KeywordSuggestions
                            selected={keywords ?? []}
                            open={open}
                            disabled={isPending}
                            onAdd={handleAddSuggestion}
                        />
                        {/* Collapsed by default: the guidance is right where the
                        keywords are picked, without pushing the form down. */}
                        <Accordion
                            disableGutters
                            elevation={0}
                            sx={{
                                bgcolor: 'transparent',
                                '&::before': { display: 'none' },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ px: 0, minHeight: 0 }}
                            >
                                <Typography variant="body2">
                                    {t('keywordsGuide.title')}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 0, pt: 0 }}>
                                <KeywordsGuide />
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        disabled={isPending}
                        color="inherit"
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={isPending}
                    >
                        {mode === 'edit'
                            ? t('common.save')
                            : t('feedForm.createSubmit')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
