import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { RoutePath } from './paths'

// Guards authenticated areas: redirects to the landing/login page at `/` when
// there is no session.
export function ProtectedRoute() {
    const { isAuthenticated } = useSession()

    if (!isAuthenticated) {
        return <Navigate to={RoutePath.Landing} replace />
    }

    return <Outlet />
}
