import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useTranslation } from 'react-i18next'
import {
    usePreferences,
    useUpdatePreferences,
} from '../../hooks/usePreferences'
import { Theme } from '../../types/preferences'

export function ThemeToggle() {
    const { t } = useTranslation()
    const { mode, setMode } = useColorScheme()
    const { data: preferences } = usePreferences()
    const updatePreferences = useUpdatePreferences()
    // defaultMode is dark; treat the pre-hydration undefined as dark too.
    const isDark = mode !== 'light'

    const toggle = () => {
        const next = isDark ? Theme.Light : Theme.Dark
        // Apply immediately for a snappy toggle; persist to the backend (the
        // source of truth) once preferences are known.
        setMode(next)
        if (preferences !== undefined) {
            updatePreferences.mutate({ ...preferences, theme: next })
        }
    }

    return (
        <IconButton
            onClick={toggle}
            aria-label={t('feed.toggleTheme')}
            size="small"
            color="inherit"
        >
            {isDark ? (
                <LightModeOutlinedIcon fontSize="small" />
            ) : (
                <DarkModeOutlinedIcon fontSize="small" />
            )}
        </IconButton>
    )
}
