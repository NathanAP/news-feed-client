// Client-side (per-device) persistence of the feed tab order, kept in
// localStorage. Exposed as an external store so components can subscribe via
// useSyncExternalStore and re-render when the order changes. The backend has no
// order field yet — persisting server-side is a future upgrade.
const STORAGE_KEY = 'nfc.feedOrder'

let cachedRaw: string | null = null
let cachedIds: string[] = []
const listeners = new Set<() => void>()

// Returns a stable array reference while the stored value is unchanged, as
// required by useSyncExternalStore (it compares snapshots with Object.is).
function read(): string[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === cachedRaw) {
        return cachedIds
    }
    cachedRaw = raw
    try {
        const parsed: unknown = raw !== null ? JSON.parse(raw) : []
        cachedIds = Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === 'string')
            : []
    } catch {
        cachedIds = []
    }
    return cachedIds
}

export const feedOrderStore = {
    subscribe(listener: () => void): () => void {
        listeners.add(listener)
        return () => listeners.delete(listener)
    },
    getSnapshot(): string[] {
        return read()
    },
    setOrder(ids: string[]): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
        // Force the next read() to re-parse and hand out a fresh reference.
        cachedRaw = null
        listeners.forEach((listener) => listener())
    },
}
