// Central route paths — avoids magic strings scattered across the app.
// Kept as an `as const` object (instead of a TS enum) to stay compatible with
// the `erasableSyntaxOnly` tsconfig flag; see rules/architecture notes.
export const RoutePath = {
    Home: '/',
    Feed: '/feeds/:feedId',
    ArticleDetail: '/articles/:id',
    Login: '/login',
    AuthCallback: '/auth/callback',
} as const

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath]

export function feedPath(feedId: string): string {
    return `/feeds/${feedId}`
}

export function articleDetailPath(articleId: string): string {
    return `/articles/${articleId}`
}
