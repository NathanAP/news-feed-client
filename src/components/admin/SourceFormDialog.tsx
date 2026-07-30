import { useEffect, useMemo } from 'react'
import { useForm, useWatch, Controller } from 'react-hook-form'
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
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import {
    useCreateSource,
    useUpdateSource,
} from '../../hooks/useSourceMutations'
import { useRssDiscovery } from '../../hooks/useRssDiscovery'
import type { Source, SourceInput } from '../../types/source'

const MAX_NAME_LENGTH = 120

type SourceFormMode = 'create' | 'edit'

export interface SourceFormDialogProps {
    open: boolean
    mode: SourceFormMode
    // The source being edited (required in edit mode; ignored in create mode).
    source?: Source
    onClose: () => void
}

// Create/edit dialog for a news source. Mirrors FeedFormDialog: Zod through
// react-hook-form, inline Alert for the request error, mutation drives the
// pending state.
export function SourceFormDialog({
    open,
    mode,
    source,
    onClose,
}: SourceFormDialogProps) {
    const { t, i18n } = useTranslation()
    const createSource = useCreateSource()
    const updateSource = useUpdateSource()
    const discovery = useRssDiscovery()

    // Rebuilt on language change so validation messages stay localized.
    const schema = useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .trim()
                    .min(1, t('sourceForm.errors.nameRequired'))
                    .max(MAX_NAME_LENGTH, t('sourceForm.errors.nameTooLong')),
                // z.url(), not z.string().url() — the latter is deprecated in
                // Zod 4.
                url: z.url(t('sourceForm.errors.urlInvalid')),
                urlRss: z.url(t('sourceForm.errors.urlRssInvalid')),
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
    } = useForm<SourceInput>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', url: '', urlRss: '' },
    })

    // The site URL feeds the discovery button, which is useless while empty.
    const url = useWatch({ control, name: 'url' })

    // Reset the form (and any previous discovery result) whenever the dialog
    // opens, prefilling in edit mode.
    useEffect(() => {
        if (open) {
            reset({
                name: source?.name ?? '',
                url: source?.url ?? '',
                urlRss: source?.urlRss ?? '',
            })
            discovery.reset()
        }
        // discovery.reset is stable, but listing it would re-run this on every
        // mutation state change and wipe what the user typed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, source, reset])

    const mutation = mode === 'edit' ? updateSource : createSource
    const isPending = mutation.isPending

    const errorMessage = useMemo(() => {
        if (!mutation.error) {
            return null
        }
        const status = isAxiosError(mutation.error)
            ? mutation.error.response?.status
            : undefined
        return status === 409
            ? t('sourceForm.errors.duplicate')
            : t('sourceForm.errors.generic')
    }, [mutation.error, t])

    const handleDiscover = () => {
        discovery.mutate(url, {
            onSuccess: (feeds) => {
                // A single hit is unambiguous, so fill it straight away;
                // several are offered as a choice below the field.
                if (feeds.length === 1) {
                    setValue('urlRss', feeds[0], {
                        shouldValidate: true,
                        shouldDirty: true,
                    })
                }
            },
        })
    }

    const discoveredFeeds = discovery.data ?? []
    const showFeedChoices = discoveredFeeds.length > 1

    const onSubmit = handleSubmit((values) => {
        if (mode === 'edit' && source) {
            updateSource.mutate(
                { id: source.id, input: values },
                { onSuccess: () => onClose() },
            )
        } else {
            createSource.mutate(values, { onSuccess: () => onClose() })
        }
    })

    return (
        <Dialog
            open={open}
            onClose={isPending ? undefined : onClose}
            fullWidth
            maxWidth="xs"
        >
            <form onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>
                    {mode === 'edit'
                        ? t('sourceForm.editTitle')
                        : t('sourceForm.createTitle')}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2.5} sx={{ mt: 1 }}>
                        {errorMessage !== null && (
                            <Alert severity="error">{errorMessage}</Alert>
                        )}
                        <TextField
                            {...register('name')}
                            label={t('sourceForm.nameLabel')}
                            fullWidth
                            autoFocus
                            slotProps={{
                                htmlInput: { maxLength: MAX_NAME_LENGTH },
                            }}
                            error={errors.name !== undefined}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            {...register('url')}
                            label={t('sourceForm.urlLabel')}
                            fullWidth
                            error={errors.url !== undefined}
                            helperText={errors.url?.message}
                        />
                        <Box>
                            {/* Controlled (unlike the fields above) because the
                            discovery button writes to it with setValue. An
                            uncontrolled MUI input only learns it has content
                            from a real change event or at mount, so a
                            programmatic write would leave the label sitting on
                            top of the text once the field loses focus. */}
                            <Controller
                                control={control}
                                name="urlRss"
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={t('sourceForm.urlRssLabel')}
                                        fullWidth
                                        error={fieldState.error !== undefined}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Button
                                onClick={handleDiscover}
                                disabled={isPending || url.trim() === ''}
                                loading={discovery.isPending}
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                {t('sourceForm.discover')}
                            </Button>
                            {discovery.isError && (
                                <Typography variant="caption" color="error">
                                    {t('sourceForm.discoveryError')}
                                </Typography>
                            )}
                            {discovery.isSuccess &&
                                discoveredFeeds.length === 0 && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {t('sourceForm.discoveryEmpty')}
                                    </Typography>
                                )}
                            {showFeedChoices && (
                                <Paper variant="outlined" sx={{ mt: 1 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', px: 2, pt: 1 }}
                                    >
                                        {t('sourceForm.discoveryPick')}
                                    </Typography>
                                    <List
                                        dense
                                        disablePadding
                                        sx={{
                                            maxHeight: 160,
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {discoveredFeeds.map((feed) => (
                                            <ListItemButton
                                                key={feed}
                                                onClick={() =>
                                                    setValue('urlRss', feed, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                }
                                            >
                                                <ListItemText
                                                    primary={feed}
                                                    slotProps={{
                                                        primary: {
                                                            noWrap: true,
                                                            variant: 'body2',
                                                        },
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </Box>
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
                            : t('sourceForm.createSubmit')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
