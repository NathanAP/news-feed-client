import './i18n'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { SnackbarProvider } from 'notistack'
import { SessionProvider } from './contexts/SessionProvider'
import { useSession } from './hooks/useSession'
import { queryClient } from './config/queryClient'
import { router } from './routes/router'
import { theme } from './theme/theme'
import { MaintenancePage } from './pages/MaintenancePage'

function SplashScreen() {
    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
            }}
        >
            <CircularProgress />
        </Box>
    )
}

function AppContent() {
    const { isInitializing, isUnderMaintenance } = useSession()

    if (isUnderMaintenance) {
        return <MaintenancePage />
    }

    if (isInitializing) {
        return <SplashScreen />
    }

    return <RouterProvider router={router} />
}

function App() {
    return (
        <ThemeProvider theme={theme} defaultMode="dark">
            <CssBaseline />
            <SnackbarProvider
                maxSnack={3}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <QueryClientProvider client={queryClient}>
                    <SessionProvider>
                        <AppContent />
                    </SessionProvider>
                    {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}
                </QueryClientProvider>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App
