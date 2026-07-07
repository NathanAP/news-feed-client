import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RoutePath } from './paths'

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [{ path: RoutePath.Home, element: <HomePage /> }],
            },
            {
                element: <PublicRoute />,
                children: [{ path: RoutePath.Login, element: <LoginPage /> }],
            },
            // The OAuth callback must stay outside the guards so it can process
            // tokens regardless of the current session state.
            { path: RoutePath.AuthCallback, element: <AuthCallbackPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
])
