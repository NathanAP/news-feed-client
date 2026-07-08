import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

// Chrome shared by the authenticated area: the top bar + a centered column.
export function AppLayout() {
    return (
        <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
            <AppHeader />
            <Container maxWidth="sm" sx={{ py: 2 }}>
                <Outlet />
            </Container>
        </Box>
    )
}
