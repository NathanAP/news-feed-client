import { useEffect } from 'react'
import { useColorScheme } from '@mui/material/styles'
import { usePreferences } from './usePreferences'

// Applies the backend theme preference (the source of truth) to MUI's color
// scheme once preferences load and whenever they change. MUI keeps the last mode
// in localStorage, so the initial paint isn't blocked on this fetch.
export function useThemeSync() {
    const { setMode } = useColorScheme()
    const { data: preferences } = usePreferences()
    const theme = preferences?.theme

    useEffect(() => {
        if (theme !== undefined) {
            setMode(theme)
        }
    }, [theme, setMode])
}
