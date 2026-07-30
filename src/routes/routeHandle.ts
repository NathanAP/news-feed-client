import type { UIMatch } from 'react-router-dom'

// Per-route metadata React Router carries through `handle`, readable anywhere
// below with `useMatches`. Used so a route can ask the shared layout for
// something without the layout having to sniff the pathname.
export interface RouteHandle {
    // Widen the content container. The reading column (`sm`) is right for feeds
    // and articles, but cramped for a form holding a raw HTML body.
    wide?: boolean
}

export const WIDE_LAYOUT: RouteHandle = { wide: true }

// `handle` is typed as `unknown` by React Router, so narrow it in one place.
export function isWideLayout(matches: UIMatch[]): boolean {
    return matches.some(
        (match) => (match.handle as RouteHandle | undefined)?.wide === true,
    )
}
