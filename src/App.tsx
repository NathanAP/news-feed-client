import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from './contexts/SessionProvider'
import { useSession } from './hooks/useSession'
import { queryClient } from './config/queryClient'
import { router } from './routes/router'
import { MaintenancePage } from './pages/MaintenancePage'

function AppContent() {
    const { isInitializing, isUnderMaintenance } = useSession()

    if (isUnderMaintenance) {
        return <MaintenancePage />
    }

    if (isInitializing) {
        return <p>Loading…</p>
    }

    return <RouterProvider router={router} />
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AppContent />
            </SessionProvider>
            {import.meta.env.DEV && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    )
}

export default App
