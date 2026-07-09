export const MIN_KEYWORDS = 5
export const MAX_KEYWORDS = 20

// Normalizes raw keyword tokens: trim, lowercase, drop empties, dedupe, and cap
// at MAX_KEYWORDS. Feed keywords feed the backend's article-matching, so they
// are kept canonical (lowercase) and free of duplicates.
export function normalizeKeywords(raw: string[]): string[] {
    const seen = new Set<string>()
    const result: string[] = []
    for (const token of raw) {
        const value = token.trim().toLowerCase()
        if (value.length === 0 || seen.has(value)) {
            continue
        }
        seen.add(value)
        result.push(value)
        if (result.length >= MAX_KEYWORDS) {
            break
        }
    }
    return result
}
