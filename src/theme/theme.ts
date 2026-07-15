import { createTheme } from '@mui/material/styles'

// The ChronoFeed brand gold. Kept as a first-class palette token (single source
// of truth) so surfaces can reference `brand.main` instead of hardcoding hex.
// Per scheme: a warm gold on dark, a deeper gold that stays legible on the light
// near-white background.
export const brandGold = {
    dark: '#c8a04a',
    light: '#8a6a1f',
} as const

// Make the custom `brand` color known to the theme/`sx` typings.
declare module '@mui/material/styles' {
    interface Palette {
        brand: Palette['primary']
    }
    interface PaletteOptions {
        brand?: PaletteOptions['primary']
    }
}

// Dark-first, graphite-blue palette (not pure black/gray). Light kept sober.
export const theme = createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#3b6fe0' },
                brand: { main: brandGold.light, contrastText: '#ffffff' },
                background: { default: '#f6f7f9', paper: '#ffffff' },
            },
        },
        dark: {
            palette: {
                primary: { main: '#6b9bff' },
                brand: { main: brandGold.dark, contrastText: '#14161b' },
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
