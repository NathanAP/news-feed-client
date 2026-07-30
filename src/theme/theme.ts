import { createTheme } from '@mui/material/styles'

// The ChronoFeed brand gold. Kept as a first-class palette token (single source
// of truth) so surfaces can reference `brand.main` instead of hardcoding hex.
// Per scheme: a warm gold on dark, a deeper gold that stays legible on the light
// near-white background.
export const brandGold = {
    dark: '#c8a04a',
    light: '#8a6a1f',
} as const

// Colour of the administrator-mode indicator (viewport frame + the header
// toggle). A token of its own rather than a borrowed `primary`: primary is tuned
// for buttons and links, and on the light scheme it turned the frame into the
// most saturated line on screen, reading as a browser focus ring instead of a
// mode. Violet also keeps the indicator clear of the two colours that carry
// meaning here — primary blue and the brand gold.
// Same per-scheme logic as the gold: lighter than the background on dark, deeper
// than it on light.
export const adminViolet = {
    dark: '#a78bfa',
    light: '#5b21b6',
} as const

// Make the custom `brand` and `admin` colors known to the theme/`sx` typings.
declare module '@mui/material/styles' {
    interface Palette {
        brand: Palette['primary']
        admin: Palette['primary']
    }
    interface PaletteOptions {
        brand?: PaletteOptions['primary']
        admin?: PaletteOptions['primary']
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
                admin: { main: adminViolet.light, contrastText: '#ffffff' },
                background: { default: '#f6f7f9', paper: '#ffffff' },
            },
        },
        dark: {
            palette: {
                primary: { main: '#6b9bff' },
                brand: { main: brandGold.dark, contrastText: '#14161b' },
                admin: { main: adminViolet.dark, contrastText: '#14161b' },
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
    components: {
        // No browser autofill anywhere. None of our fields hold personal data:
        // they name feeds and news sources — and a source is a global record, so
        // an absent-minded autofill would write someone's name into something
        // every user sees. Set as a default here (rather than field by field) so
        // every TextField, including the ones a future form adds, starts off.
        MuiTextField: { defaultProps: { autoComplete: 'off' } },
    },
})
