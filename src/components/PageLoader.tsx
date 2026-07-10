import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

// Fallback shown while a lazily-loaded route chunk resolves.
export function PageLoader() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50dvh',
            }}
        >
            <CircularProgress size={28} />
        </Box>
    )
}
