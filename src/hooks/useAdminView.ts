import { useSyncExternalStore } from 'react'
import { adminViewStore, AdminViewMode } from './adminViewStore'
import { useCurrentUser } from './useCurrentUser'

export interface AdminView {
    // The user really is an administrator (drives whether the toggle exists).
    isAdmin: boolean
    // The administrator is currently looking at the admin view (drives whether
    // admin-only UI and routes are available).
    isAdminView: boolean
    // True while the current user hasn't loaded yet, so callers can wait
    // instead of briefly treating an administrator as a regular user.
    isPending: boolean
    mode: AdminViewMode
    setMode: (mode: AdminViewMode) => void
}

// Single source of truth for "should I render administrator UI?". The flag
// comes from GET /users/me (already cached by useCurrentUser, so this costs no
// extra request); the view mode comes from the local store.
export function useAdminView(): AdminView {
    const { data: user, isPending } = useCurrentUser()
    const mode = useSyncExternalStore(
        adminViewStore.subscribe,
        adminViewStore.getSnapshot,
    )
    const isAdmin = user?.admin === true

    return {
        isAdmin,
        // The backend flag always wins: a stale 'admin' left in localStorage
        // can't unlock anything on its own.
        isAdminView: isAdmin && mode === AdminViewMode.Admin,
        isPending,
        mode,
        setMode: adminViewStore.setMode,
    }
}
