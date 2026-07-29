import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { feedsService } from '../services/api'
import { useDebouncedValue } from './useDebouncedValue'
import type { KeywordSuggestions } from '../types/feed'

// How long to wait after the user stops changing keywords before asking the
// backend for fresh suggestions.
const SUGGESTIONS_DEBOUNCE_MS = 400

// Keyword suggestions for the feed form. Debounces the picked keywords so a
// request goes out once the user pauses (not on every chip added/removed), and
// re-queries as the list changes — starting on `popular` (nothing picked) and
// moving to `related`. `enabled` should track the dialog being open so it never
// polls while closed.
export function useKeywordSuggestions(keywords: string[], enabled: boolean) {
    // Debounce a primitive (CSV), not the array: a fresh array identity on every
    // render would otherwise reset the debounce timer forever.
    const csv = keywords.join(',')
    const debouncedCsv = useDebouncedValue(csv, SUGGESTIONS_DEBOUNCE_MS)
    const debouncedKeywords = debouncedCsv === '' ? [] : debouncedCsv.split(',')

    return useQuery<KeywordSuggestions>({
        queryKey: ['keywordSuggestions', debouncedCsv],
        queryFn: () => feedsService.keywordSuggestions(debouncedKeywords),
        enabled,
        // Keep the previous list visible while the next one loads, so the chips
        // don't flicker/collapse between keystrokes.
        placeholderData: keepPreviousData,
        staleTime: 60_000,
    })
}
