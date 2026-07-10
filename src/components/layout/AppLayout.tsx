import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { PageLoader } from '../PageLoader'

// Chrome shared by the authenticated area: the top bar + a centered column.
// The Suspense boundary sits around the Outlet so the header stays put while a
// lazy page chunk loads.
export function AppLayout() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
            <AppHeader />
            <Container maxWidth="sm" sx={{ py: 2 }}>
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </Container>
        </Box>
    )
}
