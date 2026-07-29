import { Outlet } from 'react-router-dom'
import { useAdminView } from '../hooks/useAdminView'
import { PageLoader } from '../components/PageLoader'
import { NotFoundPage } from './lazyPages'

// Guards administrator-only pages. Anyone without the administrator view — a
// regular user typing the URL, or an administrator who switched back to the
// user view — gets the not-found page, as specified in PROJECT.md.
//
// It renders the page in place instead of redirecting, so the URL is preserved
// and the result is indistinguishable from any other invalid address. Because
// the view mode is read reactively, flipping the toggle while on a guarded page
// drops straight to not-found with no extra wiring.
export function AdminRoute() {
    const { isAdminView, isPending } = useAdminView()

    // Waiting on GET /users/me: showing not-found here would flash a 404 at an
    // administrator who reloads the page.
    if (isPending) {
        return <PageLoader />
    }

    if (!isAdminView) {
        return <NotFoundPage embedded />
    }

    return <Outlet />
}
