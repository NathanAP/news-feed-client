import { Suspense } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { AdminViewOutline } from './AdminViewOutline'
import { PageLoader } from '../PageLoader'
import { LazyTutorialDialog } from '../tutorial/LazyTutorialDialog'
import { TutorialVariant } from '../tutorial/tutorialVariant'
import { useTutorialSeen } from '../../hooks/useTutorialSeen'

// Chrome shared by the authenticated area: the top bar + a centered column.
// The Suspense boundary sits around the Outlet so the header stays put while a
// lazy page chunk loads.
export function AppLayout() {
    // The welcome tutorial is mounted here (rather than on a page) so it greets
    // a first-time visitor wherever they land in the authenticated area.
    const { seen, markSeen } = useTutorialSeen()

    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
            <AppHeader />
            <Container maxWidth="sm" sx={{ py: 2 }}>
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </Container>
            <LazyTutorialDialog
                open={!seen}
                onClose={markSeen}
                variant={TutorialVariant.Welcome}
            />
            <AdminViewOutline />
        </Box>
    )
}
