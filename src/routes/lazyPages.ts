import { lazy } from 'react'

// Code-split page components: each becomes its own chunk loaded on demand,
// keeping the initial bundle small and deferring page-specific deps. See
// rules/performance.md.
export const HomePage = lazy(() =>
    import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
)
export const FeedPage = lazy(() =>
    import('../pages/FeedPage').then((m) => ({ default: m.FeedPage })),
)
export const ArticleDetailPage = lazy(() =>
    import('../pages/ArticleDetailPage').then((m) => ({
        default: m.ArticleDetailPage,
    })),
)
export const LoginPage = lazy(() =>
    import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
export const AuthCallbackPage = lazy(() =>
    import('../pages/AuthCallbackPage').then((m) => ({
        default: m.AuthCallbackPage,
    })),
)
export const NotFoundPage = lazy(() =>
    import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
