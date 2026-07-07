import { useContext } from 'react'
import { SessionContext } from '../contexts/session-context'
import type { SessionContextValue } from '../contexts/session-context'

export function useSession(): SessionContextValue {
    const context = useContext(SessionContext)
    if (context === null) {
        throw new Error('useSession must be used within a SessionProvider')
    }
    return context
}
