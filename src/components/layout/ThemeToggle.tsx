import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
    const { t } = useTranslation()
    const { mode, setMode } = useColorScheme()
    // defaultMode is dark; treat the pre-hydration undefined as dark too.
    const isDark = mode !== 'light'

    return (
        <IconButton
            onClick={() => setMode(isDark ? 'light' : 'dark')}
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
