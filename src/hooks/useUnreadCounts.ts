import { useQuery } from '@tanstack/react-query'
import { feedsService } from '../services/api'
import type { UnreadCountsResponse } from '../types/feed'

// Poll interval for the per-feed unread indicator. Kept modest since this is a
// lightweight, un-paginated count endpoint. Future: replace polling with SSE or
// a WebSocket for real-time updates.
const UNREAD_POLL_INTERVAL_MS = 60_000

// Unread counts across all of the user's feeds, kept fresh by TanStack Query's
// own `refetchInterval` — the idiomatic way to poll in React Query. No manual
// setInterval/useEffect timer to wire up or tear down. `refetchIntervalInBackground`
// stays false so it pauses while the tab is hidden, and the query only runs when
// enabled (the caller passes `false` until the session is ready).
export function useUnreadCounts(enabled = true) {
    return useQuery<UnreadCountsResponse>({
        queryKey: ['unreadCounts'],
        queryFn: () => feedsService.checkForNewArticles(),
        enabled,
        refetchInterval: UNREAD_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
    })
}
