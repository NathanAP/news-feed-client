// Which view an administrator is currently looking at. Purely visual: it only
// changes what the client renders and never affects a request — the API has no
// notion of this mode (see PROJECT.md, "Administradores").
export const AdminViewMode = {
    User: 'user',
    Admin: 'admin',
} as const

export type AdminViewMode = (typeof AdminViewMode)[keyof typeof AdminViewMode]

// Persisted per-device in localStorage (same trade-off as the feed order and
// the tutorial flag: the backend has no field for it). Without persisting, a
// reload would silently drop an administrator back into the other view.
const STORAGE_KEY = 'nfc.adminView'

const listeners = new Set<() => void>()

// The snapshot is a primitive, so useSyncExternalStore's Object.is comparison
// is satisfied without caching the parsed value.
function read(): AdminViewMode {
    return localStorage.getItem(STORAGE_KEY) === AdminViewMode.Admin
        ? AdminViewMode.Admin
        : AdminViewMode.User
}

export const adminViewStore = {
    subscribe(listener: () => void): () => void {
        listeners.add(listener)
        return () => listeners.delete(listener)
    },
    getSnapshot(): AdminViewMode {
        return read()
    },
    setMode(mode: AdminViewMode): void {
        localStorage.setItem(STORAGE_KEY, mode)
        listeners.forEach((listener) => listener())
    },
}
