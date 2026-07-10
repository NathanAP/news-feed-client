import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { PageLoader } from '../components/PageLoader'

// App shell. Suspense here covers the lazy routes that render outside AppLayout
// (login, OAuth callback, not-found).
export function RootLayout() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    )
}
