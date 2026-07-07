import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { RoutePath } from './paths'

// Keeps already-authenticated users away from public-only pages (e.g. login).
export function PublicRoute() {
    const { isAuthenticated } = useSession()

    if (isAuthenticated) {
        return <Navigate to={RoutePath.Home} replace />
    }

    return <Outlet />
}
