import { useMemo, useSyncExternalStore } from 'react'
import { useFeeds } from './useFeeds'
import { feedOrderStore } from './feedOrderStore'
import type { Feed } from '../types/feed'

// Applies the stored order to the feed list: feeds present in the saved order
// come first (in that order), and any feed not yet in it (newly created) keeps
// its backend position at the end. Ids in the order that no longer exist are
// dropped.
function reconcile(feeds: Feed[], order: string[]): Feed[] {
    const byId = new Map(feeds.map((feed) => [feed.id, feed]))
    const ordered = order
        .map((id) => byId.get(id))
        .filter((feed): feed is Feed => feed !== undefined)
    const orderedIds = new Set(ordered.map((feed) => feed.id))
    const remaining = feeds.filter((feed) => !orderedIds.has(feed.id))
    return [...ordered, ...remaining]
}

// Subscribes to the persisted order and exposes a setter.
export function useFeedOrder() {
    const order = useSyncExternalStore(
        feedOrderStore.subscribe,
        feedOrderStore.getSnapshot,
    )
    return { order, setOrder: feedOrderStore.setOrder }
}

// Like useFeeds, but with the feeds sorted by the user's saved tab order.
export function useOrderedFeeds() {
    const query = useFeeds()
    const { order } = useFeedOrder()
    const data = useMemo(
        () =>
            query.data !== undefined
                ? reconcile(query.data, order)
                : query.data,
        [query.data, order],
    )
    return { ...query, data }
}
