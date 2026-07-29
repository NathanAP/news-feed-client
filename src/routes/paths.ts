// Central route paths — avoids magic strings scattered across the app.
// Kept as an `as const` object (instead of a TS enum) to stay compatible with
// the `erasableSyntaxOnly` tsconfig flag; see rules/architecture notes.
// `Landing` (public) greets anonymous visitors with the login/marketing page;
// `Feeds` (protected) is where authenticated users land. Keeping the two on
// separate paths lets the route guards handle every case on their own: an
// authenticated visitor on `/` is bounced to `/feeds`, and an anonymous one on
// `/feeds` is bounced to `/`.
export const RoutePath = {
    Landing: '/',
    Feeds: '/feeds',
    Feed: '/feeds/:feedId',
    ArticleDetail: '/articles/:id',
    // Administrator-only (see AdminRoute): anyone else gets the not-found page.
    Sources: '/sources',
    AuthCallback: '/auth/callback',
} as const

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath]

export function feedPath(feedId: string): string {
    return `/feeds/${feedId}`
}

export function articleDetailPath(articleId: string): string {
    return `/articles/${articleId}`
}
