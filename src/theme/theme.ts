import { createTheme } from '@mui/material/styles'

// Dark-first, graphite-blue palette (not pure black/gray). Light kept sober.
export const theme = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#3b6fe0' },
                background: { default: '#f6f7f9', paper: '#ffffff' },
            },
        },
        dark: {
            palette: {
                primary: { main: '#6b9bff' },
                background: { default: '#14161b', paper: '#1b1e25' },
                text: { primary: '#e8eaed', secondary: '#9aa0ab' },
                divider: 'rgba(255, 255, 255, 0.09)',
            },
        },
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
        button: { textTransform: 'none' },
    },
})
