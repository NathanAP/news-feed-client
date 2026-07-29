import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { AdminRoute } from './AdminRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { RoutePath } from './paths'
import {
    FeedsIndexPage,
    FeedPage,
    ArticleDetailPage,
    SourcesPage,
    LoginPage,
    AuthCallbackPage,
    NotFoundPage,
} from './lazyPages'

// Pages are code-split (see lazyPages / rules/performance.md). Structural pieces
// (layouts, guards) stay eager since they're always needed.
export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <AppLayout />,
                        children: [
                            {
                                path: RoutePath.Feeds,
                                element: <FeedsIndexPage />,
                            },
                            { path: RoutePath.Feed, element: <FeedPage /> },
                            {
                                path: RoutePath.ArticleDetail,
                                element: <ArticleDetailPage />,
                            },
                            // Administrator-only pages sit under the same
                            // AppLayout (one instance, so navigating in and out
                            // doesn't remount the header) behind AdminRoute.
                            {
                                element: <AdminRoute />,
                                children: [
                                    {
                                        path: RoutePath.Sources,
                                        element: <SourcesPage />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                element: <PublicRoute />,
                children: [{ path: RoutePath.Landing, element: <LoginPage /> }],
            },
            // The OAuth callback must stay outside the guards so it can process
            // tokens regardless of the current session state.
            { path: RoutePath.AuthCallback, element: <AuthCallbackPage /> },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
])
