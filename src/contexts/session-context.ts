import { createContext } from 'react'
import type { AuthTokens } from '../types/auth'

export interface SessionContextValue {
    // access_token lives only in memory; null when not authenticated.
    accessToken: string | null
    isAuthenticated: boolean
    // True while the session is being rehydrated on boot.
    isInitializing: boolean
    // True when the backend is under maintenance (503).
    isUnderMaintenance: boolean
    login: (tokens: AuthTokens) => void
    logout: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)
