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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
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
    Theme,
    Language,
    AiPersonality,
    type UserPreferences,
} from '../../types/preferences'

const schema = z.object({
    theme: z.enum(Theme),
    language: z.enum(Language),
    translateContent: z.boolean(),
    aiPersonality: z.enum(AiPersonality),
})

export function PreferencesDialog({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const { t } = useTranslation()
    const { data: preferences, isPending } = usePreferences()
    const updatePreferences = useUpdatePreferences()

    const { control, handleSubmit, reset } = useForm<UserPreferences>({
        resolver: zodResolver(schema),
        defaultValues: {
            theme: Theme.Dark,
            language: Language.En,
            translateContent: false,
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
                            <Controller
                                control={control}
                                name="theme"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label={t('preferences.themeLabel')}
                                    >
                                        {Object.values(Theme).map((value) => (
                                            <MenuItem key={value} value={value}>
                                                {t(
                                                    `preferences.themeOptions.${value}`,
                                                )}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            <Controller
                                control={control}
                                name="language"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label={t('preferences.languageLabel')}
                                        helperText={t(
                                            'preferences.languageHelp',
                                        )}
                                    >
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
                            <Controller
                                control={control}
                                name="translateContent"
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(event) =>
                                                    field.onChange(
                                                        event.target.checked,
                                                    )
                                                }
                                            />
                                        }
                                        label={t(
                                            'preferences.translateContentLabel',
                                        )}
                                    />
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
