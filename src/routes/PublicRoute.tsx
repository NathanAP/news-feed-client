import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { RoutePath } from './paths'

// Keeps already-authenticated users away from public-only pages: someone with a
// live session opening the landing at `/` goes straight to their feeds.
export function PublicRoute() {
    const { isAuthenticated } = useSession()

    if (isAuthenticated) {
        return <Navigate to={RoutePath.Feeds} replace />
    }

    return <Outlet />
}
