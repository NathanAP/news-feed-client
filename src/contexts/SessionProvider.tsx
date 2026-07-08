import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthTokens } from '../types/auth'
import { SessionContext } from './session-context'
import type { SessionContextValue } from './session-context'
import { apiClient, authService } from '../services/api'
import { queryClient } from '../config/queryClient'

// The refresh_token is persisted so the session survives reloads. The
// access_token is intentionally kept in memory only.
const REFRESH_TOKEN_STORAGE_KEY = 'nfc.refresh_token'

type SessionStatus = 'initializing' | 'authenticated' | 'unauthenticated'

export function SessionProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<SessionStatus>(() =>
        localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) !== null
            ? 'initializing'
            : 'unauthenticated',
    )
    const [isUnderMaintenance, setIsUnderMaintenance] = useState(false)
    const [accessToken, setAccessTokenState] = useState<string | null>(null)
    // Mirror of the access token for the interceptor, which is set up once and
    // would otherwise close over a stale value.
    const accessTokenRef = useRef<string | null>(null)
    const booted = useRef(false)
    // Status captured at first render, before any callback login runs — so boot
    // rehydration doesn't clobber a session that was just set via /auth/callback.
    const initialStatusRef = useRef(status)

    const setAccessToken = useCallback((token: string | null) => {
        accessTokenRef.current = token
        setAccessTokenState(token)
    }, [])

    const clearSession = useCallback(() => {
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
        setAccessToken(null)
        setStatus('unauthenticated')
    }, [setAccessToken])

    const login = useCallback(
        (tokens: AuthTokens) => {
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
            setAccessToken(tokens.accessToken)
            setStatus('authenticated')
        },
        [setAccessToken],
    )

    const logout = useCallback(() => {
        // Fire the server-side logout first — its interceptor still needs the
        // access token — then clear the local session once it settles. The
        // request is best-effort; the local session is cleared either way.
        void authService
            .logout()
            .catch(() => undefined)
            .finally(() => {
                queryClient.clear()
                clearSession()
            })
    }, [clearSession])

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
        if (refreshToken === null) {
            return null
        }
        try {
            const tokens = await authService.refresh(refreshToken)
            localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
            setAccessToken(tokens.accessToken)
            setStatus('authenticated')
            return tokens.accessToken
        } catch {
            clearSession()
            return null
        }
    }, [setAccessToken, clearSession])

    // Register the client callbacks once.
    useEffect(() => {
        apiClient.setAuthHandlers({
            getAccessToken: () => accessTokenRef.current,
            refreshAccessToken,
            onSessionExpired: clearSession,
            onMaintenance: () => setIsUnderMaintenance(true),
        })
    }, [refreshAccessToken, clearSession])

    // Rehydrate the session on boot from the persisted refresh_token. When no
    // token is stored, `status` already starts as 'unauthenticated' (see the
    // useState initializer). State is only touched after the await, so this does
    // not set state synchronously within the effect body.
    useEffect(() => {
        if (booted.current) {
            return
        }
        booted.current = true

        // Only rehydrate when a token already existed on load (returning user),
        // not when the session was just established by the callback page.
        if (initialStatusRef.current !== 'initializing') {
            return
        }

        const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
        if (refreshToken === null) {
            return
        }

        void (async () => {
            try {
                const tokens = await authService.refresh(refreshToken)
                localStorage.setItem(
                    REFRESH_TOKEN_STORAGE_KEY,
                    tokens.refreshToken,
                )
                setAccessToken(tokens.accessToken)
                setStatus('authenticated')
            } catch {
                clearSession()
            }
        })()
    }, [clearSession, setAccessToken])

    const value = useMemo<SessionContextValue>(
        () => ({
            accessToken,
            isAuthenticated: status === 'authenticated',
            isInitializing: status === 'initializing',
            isUnderMaintenance,
            login,
            logout,
        }),
        [accessToken, status, isUnderMaintenance, login, logout],
    )

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}
