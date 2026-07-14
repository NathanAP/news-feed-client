import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import {
    usePreferences,
    useUpdatePreferences,
} from '../../hooks/usePreferences'
import {
    Language,
    AiPersonality,
    type UserPreferences,
} from '../../types/preferences'

const schema = z.object({
    languageToTranslate: z.enum(Language).nullable(),
    aiPersonality: z.enum(AiPersonality),
})

// Sentinel for the "translation off" option (languageToTranslate = null), since
// MUI Select can't hold a null value. Must be non-empty: MUI Select treats an
// empty-string value as "no selection" and wouldn't render the option's label.
const OFF = 'off'

export function PreferencesDialog({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const { t, i18n } = useTranslation()
    const { data: preferences, isPending } = usePreferences()
    const updatePreferences = useUpdatePreferences()

    const { control, handleSubmit, reset } = useForm<UserPreferences>({
        resolver: zodResolver(schema),
        defaultValues: {
            languageToTranslate: null,
            aiPersonality: AiPersonality.Mixed,
        },
    })

    // Prefill from the loaded preferences whenever the dialog opens.
    useEffect(() => {
        if (open && preferences !== undefined) {
            reset(preferences)
        }
    }, [open, preferences, reset])

    const onSubmit = handleSubmit((values) => {
        updatePreferences.mutate(values, { onSuccess: () => onClose() })
    })

    return (
        <Dialog
            open={open}
            onClose={updatePreferences.isPending ? undefined : onClose}
            fullWidth
            maxWidth="xs"
        >
            <form onSubmit={onSubmit} noValidate>
                <DialogTitle>{t('preferences.title')}</DialogTitle>
                <DialogContent>
                    {isPending ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    ) : (
                        <Stack spacing={2.5} sx={{ mt: 1 }}>
                            {updatePreferences.isError && (
                                <Alert severity="error">
                                    {t('preferences.saveError')}
                                </Alert>
                            )}
                            {/* UI language is a client-only setting (i18next),
                            applied instantly on change — not part of the backend
                            preferences form below. */}
                            <TextField
                                select
                                fullWidth
                                label={t('preferences.uiLanguageLabel')}
                                value={i18n.resolvedLanguage ?? 'en'}
                                onChange={(event) =>
                                    void i18n.changeLanguage(event.target.value)
                                }
                            >
                                <MenuItem value="pt">Português</MenuItem>
                                <MenuItem value="en">English</MenuItem>
                            </TextField>
                            <Controller
                                control={control}
                                name="languageToTranslate"
                                render={({ field }) => (
                                    <TextField
                                        select
                                        fullWidth
                                        label={t('preferences.languageLabel')}
                                        helperText={t(
                                            'preferences.languageHelp',
                                        )}
                                        value={field.value ?? OFF}
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.value === OFF
                                                    ? null
                                                    : event.target.value,
                                            )
                                        }
                                    >
                                        <MenuItem value={OFF}>
                                            {t(
                                                'preferences.languageOptions.off',
                                            )}
                                        </MenuItem>
                                        {Object.values(Language).map(
                                            (value) => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {t(
                                                        `preferences.languageOptions.${value}`,
                                                    )}
                                                </MenuItem>
                                            ),
                                        )}
                                    </TextField>
                                )}
                            />
                            <Controller
                                control={control}
                                name="aiPersonality"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label={t(
                                            'preferences.aiPersonalityLabel',
                                        )}
                                    >
                                        {Object.values(AiPersonality).map(
                                            (value) => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {t(
                                                        `preferences.aiPersonalityOptions.${value}`,
                                                    )}
                                                </MenuItem>
                                            ),
                                        )}
                                    </TextField>
                                )}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        disabled={updatePreferences.isPending}
                        color="inherit"
                    >
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        loading={updatePreferences.isPending}
                        disabled={isPending}
                    >
                        {t('common.save')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
